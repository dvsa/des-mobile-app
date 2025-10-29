import { Injectable, Signal } from '@angular/core';
import { AuthConnect, AuthResult, AzureProvider, ProviderOptions } from '@ionic-enterprise/auth';
import { Store } from '@ngrx/store';
import { DelegatedRekeySearchClearState } from '@pages/delegated-rekey-search/delegated-rekey-search.actions';
import { ResetRekeyReason } from '@pages/rekey-reason/rekey-reason.actions';
import { RekeySearchClearState } from '@pages/rekey-search/rekey-search.actions';
import { ResetFaultMode } from '@pages/test-report/test-report.actions';
import { AuthProviderSettings } from '@providers/authentication/authentication.constants';
import { CompletedTestPersistenceProvider } from '@providers/completed-test-persistence/completed-test-persistence';
import { ExaminerRecordsProvider } from '@providers/examiner-records/examiner-records';
import { LogHelper } from '@providers/logs/logs-helper';
import { serialiseLogMessage } from '@shared/helpers/serialise-log-message';
import { LogType } from '@shared/models/log.model';
import { StoreModel } from '@shared/models/store.model';
import { UnloadAppConfig } from '@store/app-config/app-config.actions';
import {
  LoadAppVersion,
  LoadEmployeeId,
  LoadEmployeeName,
  UnloadAppInfo,
  UpdateAuthResult,
} from '@store/app-info/app-info.actions';
import { selectAuthResult, selectEmployeeId } from '@store/app-info/app-info.selectors';
import { UnloadExaminerRecords } from '@store/examiner-records/examiner-records.actions';
import { UnloadJournal } from '@store/journal/journal.actions';
import { ClearLogs, SaveLog } from '@store/logs/logs.actions';
import { ClearTestCentresRefData } from '@store/reference-data/reference-data.actions';
import { ResetTestCentreJournal } from '@store/test-centre-journal/test-centre-journal.actions';
import { UnloadTests } from '@store/tests/tests.actions';
import * as jose from 'jose';
import { JWTPayload } from 'jose';
import { get } from 'lodash-es';
import { AppConfigProvider } from '../app-config/app-config';
import { DataStoreProvider, LocalStorageKey } from '../data-store/data-store';
import { ConnectionStatus, NetworkStateProvider } from '../network-state/network-state';
import { TestPersistenceProvider } from '../test-persistence/test-persistence';

export enum Token {
  ID = 'idToken',
  ACCESS = 'accessToken',
  REFRESH = 'refreshToken',
}

@Injectable()
export class AuthenticationProvider {
  provider: AzureProvider = new AzureProvider();
  providerOptions: ProviderOptions;

  authResult: Signal<AuthResult> = this.store$.selectSignal(selectAuthResult);

  constructor(
    public dataStoreProvider: DataStoreProvider,
    public appConfig: AppConfigProvider,
    public testPersistenceProvider: TestPersistenceProvider,
    public store$: Store<StoreModel>,
    private logHelper: LogHelper,
    public completedTestPersistenceProvider: CompletedTestPersistenceProvider,
    public examinerRecordsProvider: ExaminerRecordsProvider,
    private networkState: NetworkStateProvider
  ) {}

  async init() {
    return AuthConnect.setup({
      platform: 'capacitor',
      logLevel: 'ERROR',
      ios: {
        webView: 'private',
      },
    });
  }

  /**
   * Sets up the options for the azure provider needed for auth connect to function
   */
  setProviderOptions() {
    const authSettings: AuthProviderSettings = this.appConfig.getAppConfig().authentication;

    if (authSettings) {
      this.providerOptions = {
        audience: '',
        clientId: authSettings.clientId,
        discoveryUrl: `${authSettings.context}/v2.0/.well-known/openid-configuration?appid=${authSettings.clientId}`,
        logoutUrl: authSettings.logoutUrl,
        redirectUri: authSettings.redirectUrl,
        scope: 'openid offline_access profile email',
      };
    }
  }

  getEmployeeId(): string {
    return this.store$.selectSignal(selectEmployeeId)();
  }

  public async getAuthenticationToken(): Promise<string> {
    const needsRefresh: boolean = await (!this.isOffline() && this.hasTokenExpired(this.authResult()));
    if (needsRefresh) {
      await this.refreshSession();
    }
    await this.isAuthenticated();
    try {
      return this.authResult().idToken;
    } catch (error) {
      this.logEvent(LogType.ERROR, 'Logout', 'Get AuthToken Error');
      return Promise.resolve(null);
    }
  }

  decodeToken(token: string): JWTPayload {
    if (token) {
      return jose.decodeJwt(token);
    }
    return null;
  }

  async loadEmployeeDetails(authResult: AuthResult) {
    if (authResult?.idToken) {
      const appConfigAuth = (await this.appConfig.getAppConfigAsync())?.authentication;
      // Decode the JWT idToken to extract user details
      const decodedToken = this.decodeToken(authResult.idToken);

      // Extract the employee name using the configured key
      const employeeName = decodedToken[appConfigAuth.employeeNameKey] as string;

      // Extract the employee ID using the configured key
      const employeeID = decodedToken[appConfigAuth.employeeIdKey];

      // Check if the employee id is returned as an array, if it is,
      // return the first item of that array to get the employee ID (Taken from legacy auth connect)
      const normalizedEmployeeId: string = Array.isArray(employeeID) ? employeeID[0] : employeeID;

      if (employeeName) this.store$.dispatch(LoadEmployeeName(employeeName));
      if (normalizedEmployeeId) {
        this.store$.dispatch(
          LoadEmployeeId({
            employeeId: Number.parseInt(normalizedEmployeeId, 10).toString(),
          })
        );
      }
    }
  }

  async refreshEmployeeDetails() {
    await this.loadEmployeeDetails(this.authResult());
  }

  async storeAuthResult(authResult: AuthResult) {
    await this.loadEmployeeDetails(authResult);

    try {
      await this.dataStoreProvider.setItem(LocalStorageKey.AUTH_RESULT, JSON.stringify(authResult));
    } catch (error) {
      this.logEvent(LogType.ERROR, 'Authentication provider - Store result Storage error', error);
    }

    this.store$.dispatch(UpdateAuthResult(authResult));
  }

  async getAuthResult() {
    return this.dataStoreProvider.getItem(LocalStorageKey.AUTH_RESULT);
  }

  async getStoredAuthResult(): Promise<AuthResult> {
    try {
      const storedResult: string = await this.dataStoreProvider.getItem(LocalStorageKey.AUTH_RESULT);
      if (storedResult) {
        const parsedResult = JSON.parse(storedResult);
        if (parsedResult && get(parsedResult, 'provider')) {
          return parsedResult;
        }
      }
      return null;
    } catch (error) {
      this.logEvent(LogType.ERROR, 'Authentication provider - Get stored result error', error);
      return null;
    }
  }

  async login() {
    if (this.isOffline()) return;

    this.logEvent(LogType.DEBUG, 'Login', 'Started login flow');

    await AuthConnect.login(this.provider, this.providerOptions);
  }

  public isOffline(): boolean {
    // Return true if the app is offline
    return this.networkState.getNetworkState() === ConnectionStatus.OFFLINE;
  }

  public async refreshSession(): Promise<void> {
    try {
      let authResult = this.authResult();

      // check if the refresh token is available
      if (await AuthConnect.isRefreshTokenAvailable(authResult)) {
        authResult = await AuthConnect.refreshSession(this.provider, authResult);
      } else {
        throw new Error('No refresh token available');
      }

      await this.storeAuthResult(authResult);
    } catch (error) {
      this.logEvent(LogType.ERROR, 'Authentication provider - Refresh error', error);
      throw error;
    }
  }

  /**
   * Check if the user has a valid authResult, and attempt to refresh it manually if not.
   * This will automatically return true if the user offline to not disrupt their local session
   */
  // public async isAuthenticated(): Promise<boolean> {
  //   try {
  //     // if offline, allow user to continue locally
  //     if (this.isOffline()) return true;
  //
  //     const authResult = this.authResult();
  //
  //     // check to see if there is an access token to interrogate
  //     if (authResult) {
  //       // determine if the existing token is expired
  //       if (await this.hasTokenExpired(authResult)) {
  //         await this.refreshSession();
  //       }
  //
  //       // token should have refreshed if previously expired, and method returns true
  //       return true;
  //     }
  //
  //     // check if a value previously existed in storage - if so, hydrate the state
  //     const storedAuthResult = await this.getAuthResult();
  //     if (storedAuthResult) {
  //       // this.store$.dispatch(UpdateAuthResult(JSON.parse(storedAuthResult)));
  //
  //       if (await this.hasTokenExpired(authResult)) {
  //         await this.refreshSession();
  //       }
  //     }
  //
  //     // return false if no token available
  //     return false;
  //   } catch (err) {
  //     this.logEvent(LogType.ERROR, 'isAuthenticated error', err);
  //     return false;
  //   }
  // }

  public async isAuthenticated(): Promise<boolean> {
    try {
      // if offline, allow user to continue locally
      if (this.isOffline()) return true;

      // check to see if there is an access token to interrogate
      const authResult = this.authResult() ?? JSON.parse(await this.getAuthResult());
      if (!authResult) return false;

      // determine if the existing token is expired
      if (!(await this.hasTokenExpired(authResult))) return true;

      // attempt a token refresh
      await this.refreshSession();

      // return true if the token has changed successfully
      return true;
    } catch (err) {
      this.logEvent(LogType.ERROR, 'isAuthenticated error', err);
      return false;
    }
  }

  async hasTokenExpired(result: AuthResult): Promise<boolean> {
    const jwtPayload = this.decodeToken(result?.idToken);
    if (jwtPayload) {
      return !!(jwtPayload?.exp && new Date(jwtPayload.exp * 1000) < new Date());
    }
    return true;
  }

  /**Clears the entire store but keeps the app version*/
  async clearStore() {
    // Dispatch action to unload the journal
    this.store$.dispatch(UnloadJournal());

    // Dispatch action to unload tests
    this.store$.dispatch(UnloadTests());

    // Dispatch action to unload app config
    this.store$.dispatch(UnloadAppConfig());

    // Dispatch action to load app version
    this.store$.dispatch(LoadAppVersion());

    // Dispatch action to unload rekey search data
    this.store$.dispatch(RekeySearchClearState());

    // Dispatch action to unload delegated rekey search data
    this.store$.dispatch(DelegatedRekeySearchClearState());

    // Dispatch action to unload app information
    this.store$.dispatch(UnloadAppInfo());

    // Dispatch action to unload examiner records
    this.store$.dispatch(UnloadExaminerRecords());

    // Dispatch action to clear test centres reference data
    this.store$.dispatch(ClearTestCentresRefData());

    // Dispatch action to clear test centre journal state
    this.store$.dispatch(ResetTestCentreJournal());

    // Dispatch action to clear test centre journal state
    this.store$.dispatch(ResetRekeyReason());

    // Dispatch action to clear test report
    this.store$.dispatch(ResetFaultMode());

    // Dispatch action to clear logs
    this.store$.dispatch(ClearLogs());

    // Clear persisted tests from the test persistence provider
    await this.testPersistenceProvider.clearPersistedTests();

    try {
      // Clear persisted recall auto popup last displayed time from local storage
      await this.dataStoreProvider.removeItem(LocalStorageKey.JOURNAL_RECALL_AUTO_DISPLAY_TIME);
    } catch (error) {
      this.logEvent(LogType.ERROR, 'Logout', 'Clear JOURNAL_RECALL_AUTO_DISPLAY_TIME error');
    }

    try {
      // Clear app config from local storage
      await this.dataStoreProvider.removeItem(LocalStorageKey.CONFIG);
    } catch (error) {
      this.logEvent(LogType.ERROR, 'Logout', 'Clear CONFIG error');
    }

    try {
      // Clear auth result from local storage
      await this.dataStoreProvider.removeItem(LocalStorageKey.AUTH_RESULT);
    } catch (error) {
      this.logEvent(LogType.ERROR, 'Logout', 'Clear AUTH_RESULT error');
    }

    // Clear all reminiscent of examiner records from storage
    await this.examinerRecordsProvider.clearExaminerRecordsCache();

    // Clear persisted completed tests from the completed test persistence provider
    await this.completedTestPersistenceProvider.clearPersistedCompletedTests();
  }

  public async logout(): Promise<void> {
    try {
      this.logEvent(LogType.INFO, 'Logout', 'Started logout flow');
      await AuthConnect.logout(this.provider, this.authResult());

      this.logEvent(LogType.INFO, 'Logout', 'Finished logout flow');
    } catch (err) {
      this.logEvent(LogType.ERROR, 'Authentication provider - Logout error', err);
    }

    await this.clearStore();
    this.appConfig.shutDownStoreSubscription();
  }

  logEvent(logType: LogType, desc: string, msg: unknown) {
    this.store$.dispatch(
      SaveLog({
        payload: this.logHelper.createLog(logType, desc, `AuthenticationProvider => ${serialiseLogMessage(msg)}`),
      })
    );
  }
}
