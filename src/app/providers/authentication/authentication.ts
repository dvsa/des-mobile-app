import { Injectable, Signal } from '@angular/core';
import { Capacitor } from '@capacitor/core';
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
  provider: AzureProvider;
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
  ) {
    this.provider = new AzureProvider();
    AuthConnect.setup({
      platform: Capacitor.isNativePlatform() ? 'capacitor' : 'web',
      logLevel: 'ERROR',
      ios: {
        webView: 'private',
      },
      web: {
        uiMode: 'popup',
        authFlow: 'PKCE',
      },
    });
  }

  async setProviderOptions() {
    const isNative = Capacitor.isNativePlatform();
    const authSettings: AuthProviderSettings = this.appConfig.getAppConfig().authentication;

    if (authSettings) {
      this.providerOptions = {
        audience: '',
        clientId: authSettings.clientId,
        discoveryUrl: `${authSettings.context}/v2.0/.well-known/openid-configuration?appid=${authSettings.clientId}`,
        logoutUrl: isNative ? authSettings.logoutUrl : 'http://localhost:8100',
        redirectUri: isNative ? authSettings.redirectUrl : 'http://localhost:8100',
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
      const decode = this.decodeToken(authResult.idToken);

      const employeeName = decode[appConfigAuth.employeeNameKey] as string;
      if (employeeName) this.store$.dispatch(LoadEmployeeName(employeeName));

      const employeeIDDecode = decode[appConfigAuth.employeeIdKey];
      const employeeID: string = Array.isArray(employeeIDDecode) ? employeeIDDecode[0] : employeeIDDecode;
      //Parse the employee id as an int then convert it back to a string to remove leading zeroes
      if (employeeID) this.store$.dispatch(LoadEmployeeId({ employeeId: Number.parseInt(employeeID, 10).toString() }));
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
    try {
      this.store$.dispatch(UpdateAuthResult(authResult));
    } catch (error) {
      this.logEvent(LogType.ERROR, 'Authentication provider - Store result State error', error);
      throw error;
    }
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
    if (!this.providerOptions) {
      await this.setProviderOptions();
    }
    let authResult: AuthResult = null;
    try {
      authResult = await this.getStoredAuthResult();
      if (!authResult || (await this.hasTokenExpired(authResult))) {
        // Initiate the login process and update the store with the auth result
        authResult = await AuthConnect.login(this.provider, this.providerOptions);
      }
    } catch (error) {
      this.logEvent(LogType.ERROR, 'Authentication provider - Login error', error);
      throw error;
    }
    try {
      // Dispatch action to update the auth result in the store
      await this.storeAuthResult(authResult);
    } catch (error) {
      this.logEvent(LogType.ERROR, 'Authentication provider - Store error during login', error);
    }
  }

  public isOffline(): boolean {
    // Return true if the app is offline
    return this.networkState.getNetworkState() === ConnectionStatus.OFFLINE;
  }

  public async refreshSession(): Promise<void> {
    try {
      //Refresh the session and update the store with the new auth result
      await this.storeAuthResult(await AuthConnect.refreshSession(this.provider, this.authResult()));
    } catch (error) {
      this.logEvent(LogType.ERROR, 'Authentication provider - Refresh error', error);
      throw error;
    }
  }

  public async isAuthenticated(): Promise<boolean> {
    try {
      // if offline, allow user to continue locally
      if (this.isOffline()) return true;
      // check to see if there is an access token to interrogate
      if (this.authResult()) {
        // determine if the existing token is expired
        if (await this.hasTokenExpired(this.authResult())) {
          // attempt a token refresh
          const previousResult = this.authResult().accessToken;
          await this.refreshSession();
          // return true if the token has changed successfully
          return previousResult !== this.authResult().accessToken;
        }
        // token should have refreshed if previously expired, and method returns true
        return true;
      }
      // return false if no token available
      return false;
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
