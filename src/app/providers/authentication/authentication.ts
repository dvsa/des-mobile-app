import { Injectable, Signal } from '@angular/core';
import { LoginOptions, MsAuthPlugin } from '@dvsa/capacitor-plugin-msauth';
import { Store } from '@ngrx/store';
import { DelegatedRekeySearchClearState } from '@pages/delegated-rekey-search/delegated-rekey-search.actions';
import { ResetRekeyReason } from '@pages/rekey-reason/rekey-reason.actions';
import { RekeySearchClearState } from '@pages/rekey-search/rekey-search.actions';
import { ResetFaultMode } from '@pages/test-report/test-report.actions';
import { AuthProviderSettings, AuthenticationError } from '@providers/authentication/authentication.constants';
import { StorageCleared } from '@providers/authentication/authentification.actions';
import { CompletedTestPersistenceProvider } from '@providers/completed-test-persistence/completed-test-persistence';
import { ExaminerRecordsProvider } from '@providers/examiner-records/examiner-records';
import { LogHelper } from '@providers/logs/logs-helper';
import { LoginOptions, MsAuthPlugin } from '@recognizebv/capacitor-plugin-msauth';
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

export interface AuthResult {
  accessToken: string;
  idToken: string;
  scopes: string[];
  isMSAuth?: boolean;
}

@Injectable()
export class AuthenticationProvider {
  authResult: Signal<AuthResult> = this.store$.selectSignal(selectAuthResult);
  authOptions: LoginOptions = null;

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

  //Login to MSAuth plugin and return the auth result, tag it with a flag to identify that it came from MSAuth
  async pluginLogin(forceRefresh?: boolean): Promise<AuthResult> {
    const authResult: AuthResult = await MsAuthPlugin.login({
      ...this.authOptions,
      forceRefresh,
    });
    return {
      ...authResult,
      isMSAuth: true,
    };
  }

  async pluginLogout() {
    return await MsAuthPlugin.logoutAll(this.authOptions);
  }

  /**
   * Initialises Authentication settings from config
   */
  async init(): Promise<void> {
    const authSettings: AuthProviderSettings = this.appConfig.getAppConfig().authentication;
    try {
      // Extract the knownAuthoritiesLink and the tenant from the context url
      const [, knownAuthoritiesLink, tenant] = authSettings.context.match(/(.+\.com\/)(.+)/);
      this.authOptions = {
        clientId: authSettings.clientId,
        tenant: tenant,
        authorityType: 'AAD',
        authorityUrl: authSettings.context,
        knownAuthorities: [knownAuthoritiesLink],
        prompt: 'login',
      };
    } catch (error) {
      this.logEvent(LogType.ERROR, 'Authentication provider - Init error', error);
    }
  }

  /**
   * Returns the employee id from the state
   */
  getEmployeeId(): string {
    return this.store$.selectSignal(selectEmployeeId)();
  }

  /**
   * Gets the user's id token and returns it, attempting to refresh it beforehand if its expired.
   */
  public async getAuthenticationToken(): Promise<string> {
    const isAuthed: boolean = await this.isAuthenticated();
    try {
      if (isAuthed) {
        return (await this.getAuthResult()).idToken;
      }
      throw Error('User is not authorised');
    } catch (error) {
      this.logEvent(LogType.ERROR, 'getAuthenticationToken', 'Get AuthToken Error');
      return Promise.resolve(null);
    }
  }

  /**
   * Takes in a jwt token and returns the decoded result
   * @param token
   */
  decodeToken(token: string): JWTPayload {
    if (token) {
      return jose.decodeJwt(token);
    }
    return null;
  }

  /**
   * Loads employee details from the AuthResult and dispatches actions and dispatches them to the store
   * @param authResult
   */
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
      // Return the first item of that array to get the employee ID (Taken from legacy auth connect)
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

  /**
   * Manually reloads the employee's details from the current Auth Result
   */
  async refreshEmployeeDetails() {
    await this.loadEmployeeDetails(await this.getAuthResult());
  }

  /**
   * Takes in an auth result and stores it in both the storage and the state
   * @param authResult
   */
  async storeAuthResult(authResult: AuthResult) {
    await this.loadEmployeeDetails(authResult);

    try {
      if (authResult) {
        await this.dataStoreProvider.setItem(LocalStorageKey.AUTH_RESULT, JSON.stringify(authResult));
      } else {
        await this.dataStoreProvider.removeItem(LocalStorageKey.AUTH_RESULT);
      }
    } catch (error) {
      this.logEvent(LogType.ERROR, 'Authentication provider - Store result Storage error', error);
    }

    this.store$.dispatch(UpdateAuthResult(authResult));
  }

  /**
   * Gets the current auth result object, prioritising the state and relying on storage as a backup
   */
  async getAuthResult() {
    try {
      return this.authResult() ?? (await this.getStoredAuthResult());
    } catch (error) {
      this.logEvent(LogType.ERROR, 'Authentication provider - Get Auth Result error', error);
      return null;
    }
  }

  /**
   * Gets the stored auth result from the storage and returns it
   */
  async getStoredAuthResult(): Promise<AuthResult> {
    try {
      const storedResult: string = await this.dataStoreProvider.getItem(LocalStorageKey.AUTH_RESULT);
      if (storedResult) {
        const parsedResult = JSON.parse(storedResult);
        if (parsedResult && get(parsedResult, 'accessToken')) {
          return parsedResult;
        }
      }
      return null;
    } catch (error) {
      this.logEvent(LogType.ERROR, 'Authentication provider - Get stored result error', error);
      return null;
    }
  }

  /**
   * Triggers the login process, attempting to use an existing token if it is still valid and getting a new one if not
   */
  async login(forceRefresh?: boolean) {
    if (!this.authOptions) {
      await this.init();
    }

    this.logEvent(LogType.DEBUG, 'Login', 'Started login flow');

    let authResult: AuthResult = null;
    try {
      authResult = await this.pluginLogin(forceRefresh);
      if (!authResult && this.isOffline()) {
        throw new Error(AuthenticationError.OFFLINE);
      }
    } catch (error) {
      this.logEvent(LogType.ERROR, 'Authentication provider - Login error', error);
      throw error;
    }

    await this.storeAuthResult(authResult);
  }

  /**
   * Find out if the user is offline
   */
  public isOffline(): boolean {
    // Return true if the app is offline
    return this.networkState.getNetworkState() === ConnectionStatus.OFFLINE;
  }

  /**
   * Find out if auth result was generated via MSAuth plugin
   */
  public isTokenFromMSAuth(result: AuthResult) {
    if (get(result, 'isMSAuth')) {
      return result?.isMSAuth;
    }
    return false;
  }

  /**
   * Check if the user has a valid authResult, and attempt to refresh it manually if not.
   * This will automatically return true if the user offline to not disrupt their local session
   */
  public async isAuthenticated(): Promise<boolean> {
    try {
      // if offline, allow user to continue locally
      if (this.isOffline()) return true;
      // check to see if there is an access token to interrogate
      const authResult = await this.getAuthResult();
      if (!authResult) return false;
      if (!this.isTokenFromMSAuth(authResult)) {
        //Clear the old auth result from the state.
        await this.storeAuthResult(null);
        return false;
      }
      // determine if the existing token is expired
      if (await this.hasTokenExpired(authResult)) {
        this.logEvent(LogType.DEBUG, 'Authentication provider - Is Auth', 'token expired, attempting refresh');
        // attempt a token refresh
        await this.login(true);
      }
      // return true if the token has changed successfully
      return true;
    } catch (err) {
      this.logEvent(LogType.ERROR, 'isAuthenticated error', err);
      return false;
    }
  }

  /**
   * Gets the expiry date from the user's id token and compares it to the current time to see if it has expired
   * @param result
   */
  async hasTokenExpired(result: AuthResult): Promise<boolean> {
    const idJwtPayload = this.decodeToken(result?.idToken);
    const accessJwtPayload = this.decodeToken(result?.accessToken);

    let isExpired = false;
    if (idJwtPayload) {
      isExpired = !!(idJwtPayload?.exp && new Date(idJwtPayload.exp * 1000) < new Date());
      if (isExpired) {
        return true;
      }
      if (accessJwtPayload) {
        return !!(accessJwtPayload?.exp && new Date(accessJwtPayload.exp * 1000) < new Date());
      }
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

    this.store$.dispatch(StorageCleared());
  }

  /**
   * Logs the user out of Auth connect
   */
  public async logout(): Promise<void> {
    try {
      this.logEvent(LogType.INFO, 'Logout', 'Started logout flow');
      await this.pluginLogout();
      this.logEvent(LogType.INFO, 'Logout', 'Finished logout flow');
    } catch (err) {
      this.logEvent(LogType.ERROR, 'Authentication provider - Logout error', err);
    }

    await this.clearStore();
    this.appConfig.shutDownStoreSubscription();
  }

  /**
   * Saves Auth Provider related logs
   * @param logType
   * @param desc
   * @param msg
   */
  logEvent(logType: LogType, desc: string, msg: unknown) {
    this.store$.dispatch(
      SaveLog({
        payload: this.logHelper.createLog(logType, desc, `AuthenticationProvider => ${serialiseLogMessage(msg)}`),
      })
    );
  }
}
