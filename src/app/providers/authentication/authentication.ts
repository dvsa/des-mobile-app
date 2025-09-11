import { inject, Injectable, Signal } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import {
  Auth0Provider,
  AuthConnect,
  AuthResult,
  AzureProvider,
  ProviderOptions,
  TokenType,
} from '@ionic-enterprise/auth';
import { Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { NetworkStateProvider } from '@providers/network-state/network-state';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { UserSelectors } from '@providers/authentication/user.selectors';
import { AzureIDToken } from '@providers/authentication/auth-model';
import { ClearLogs, SaveLog } from '@store/logs/logs.actions';
import { LogType } from '@shared/models/log.model';
import { LogHelper } from '@providers/logs/logs-helper';
import { serialiseLogMessage } from '@shared/helpers/serialise-log-message';
import { ResetFaultMode } from '@pages/test-report/test-report.actions';
import { ResetRekeyReason } from '@pages/rekey-reason/rekey-reason.actions';
import { ResetTestCentreJournal } from '@store/test-centre-journal/test-centre-journal.actions';
import { ClearTestCentresRefData } from '@store/reference-data/reference-data.actions';
import { UnloadJournal } from '@store/journal/journal.actions';
import { UnloadTests } from '@store/tests/tests.actions';
import { UnloadAppConfig } from '@store/app-config/app-config.actions';
import { RekeySearchClearState } from '@pages/rekey-search/rekey-search.actions';
import { LoadAppVersion, UnloadAppInfo } from '@store/app-info/app-info.actions';
import { DelegatedRekeySearchClearState } from '@pages/delegated-rekey-search/delegated-rekey-search.actions';
import { UnloadExaminerRecords } from '@store/examiner-records/examiner-records.actions';
import { DataStoreProvider, LocalStorageKey } from '@providers/data-store/data-store';
import { TestPersistenceProvider } from '@providers/test-persistence/test-persistence';
import { CompletedTestPersistenceProvider } from '@providers/completed-test-persistence/completed-test-persistence';
import { ExaminerRecordsProvider } from '@providers/examiner-records/examiner-records';
import { UserActions } from './user.actions';

@Injectable({ providedIn: 'root' })
export class AuthenticationProvider {
  private logHelper = inject(LogHelper);
  private store = inject<Store<StoreModel>>(Store);
  private readonly network = inject(NetworkStateProvider);
  public appConfig = inject(AppConfigProvider);

  private dataStoreProvider = inject(DataStoreProvider);
  private testPersistenceProvider = inject(TestPersistenceProvider);
  private completedTestPersistenceProvider = inject(CompletedTestPersistenceProvider);
  private examinerRecordsProvider = inject(ExaminerRecordsProvider)

  private readonly provider: AzureProvider;
  private readonly authOptions: ProviderOptions;
  authResult: Signal<AuthResult> = this.store.selectSignal(UserSelectors.selectAuthResult);
  private employeeId: string;
  private employeeIdKey: string;
  private inUnAuthenticatedMode: boolean;
  public ionicAuth: Auth0Provider;

  constructor() {
    const authSettings = this.appConfig.getAppConfig()?.authentication;
    const isNative = Capacitor.isNativePlatform();
    this.provider = new AzureProvider();
    this.authOptions = {
      audience: '',
      clientId: authSettings.clientId,
      discoveryUrl:`${authSettings.context}/v2.0/.well-known/openid-configuration?appid=${authSettings.clientId}`,
      logoutUrl: isNative ? authSettings.logoutUrl : 'http://localhost:8100',
      redirectUri: isNative ? authSettings.redirectUrl : 'http://localhost:8100',
      scope: 'openid offline_access profile email',
    };
  }

  get authConnect() {
    // if the context of `ionicAuth` is lost, the re-initialise
    if (!this.ionicAuth) this.initialize();

    // update value of `inUnAuthenticatedMode` before trying to interact with auth connect methods
    // this.determineAuthenticationMode();

    return this.ionicAuth;
  }

  /**
   * Initialise the authentication service
   */
  initialize(): Promise<void> {
    const isNative = Capacitor.isNativePlatform();
    return AuthConnect.setup({
      platform: isNative ? 'capacitor' : 'web',
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

  /**
   * Reauthenticates the user if required
   */
  async reauthenticateIfRequired() {
    const authResult = this.authResult();

    try {
      if (!authResult) {
        new Error('Auth result not found');
      }

      if (!(await AuthConnect.isRefreshTokenAvailable(authResult))) {
        new Error('Refresh token not available');
      }

      if (!(await AuthConnect.isAccessTokenAvailable(authResult))) {
        new Error('Access token not available');
      }

      if (await AuthConnect.isAccessTokenExpired(authResult)) {
        await this.refreshToken(authResult);
        return;
      }

      if (!authResult.idToken) {
        new Error('ID token not available');
      }

      // Decode id token, and check if it has expired
      const azureIDToken = await AuthConnect.decodeToken<AzureIDToken>(TokenType.id, authResult);
      if (azureIDToken.exp < Date.now() / 1000) {
        await this.refreshToken(authResult);
      }
    } catch (error) {
      console.error(error);

      this.logEvent(
        LogType.ERROR,
        `Error occurred at reauthenticateIfRequired.`,
        error
      );

      await this.login();
    }
  }

  /**
   * Refreshes the token
   * @param authResult
   */
  async refreshToken(authResult: AuthResult) {
    try {
      const newAuthResult = await AuthConnect.refreshSession(this.provider, authResult);
      await this.storeAuthResult(newAuthResult);
    } catch (error) {
      console.error(error);

      this.logEvent(
        LogType.ERROR,
        `Error occurred at refreshToken. Auth result: ${JSON.stringify(authResult)}.`,
        error
      );

      await this.login();
    }
  }

  /**
   * Initiates the login process
   */
  async login(): Promise<void> {
    try {
      const authResult = await AuthConnect.login(this.provider, this.authOptions);
      await this.storeAuthResult(authResult);
    } catch (error) {
      console.error(error);

      this.logEvent(
        LogType.ERROR,
        `Error occurred at login.`,
        error
      );
    }
  }

  /**
   * Stores the authentication result in the store
   * @param authResult
   */
  async storeAuthResult(authResult: AuthResult) {
    try {
      const azureIDToken = await AuthConnect.decodeToken<AzureIDToken>(TokenType.id, authResult);

      const tokenInfo = {
        id: azureIDToken.sub || '',
        testerName: azureIDToken.name || '',
        testerEmail: azureIDToken.email || azureIDToken.preferred_username || '',
        oid: azureIDToken.oid || '',
        employeeId: azureIDToken.employeeid || azureIDToken.oid || '',
        authResult,
      };

      this.store.dispatch(UserActions.setTokenInfo({ tokenInfo }));
    } catch (error) {
      console.error(error);

      this.logEvent(
        LogType.ERROR,
        `Error occurred at storeAuthResult.`,
        error
      );
    }
  }

  /**
   * Logs an event to the store
   * @param logType
   * @param desc
   * @param msg
   */
  logEvent = (logType: LogType, desc: string, msg: unknown) => {
    this.store.dispatch(
      SaveLog({
        payload: this.logHelper.createLog(logType, desc, `AuthenticationProvider => ${serialiseLogMessage(msg)}`),
      })
    );
  };

  async expireTokens() {
    const authResult = this.authResult();
    try {
      await AuthConnect.expire(authResult);
    } catch (error) {
      this.logEvent(LogType.ERROR, 'expireTokens error', error);
    }
  }

  /**Clears the entire store but keeps the app version*/
  async clearStore() {
    // Dispatch action to unload the journal
    this.store.dispatch(UnloadJournal());

    // Dispatch action to unload tests
    this.store.dispatch(UnloadTests());

    // Dispatch action to unload app config
    this.store.dispatch(UnloadAppConfig());

    // Dispatch action to load app version
    this.store.dispatch(LoadAppVersion());

    // Dispatch action to unload rekey search data
    this.store.dispatch(RekeySearchClearState());

    // Dispatch action to unload delegated rekey search data
    this.store.dispatch(DelegatedRekeySearchClearState());

    // Dispatch action to unload app information
    this.store.dispatch(UnloadAppInfo());

    // Dispatch action to unload examiner records
    this.store.dispatch(UnloadExaminerRecords());

    // Dispatch action to clear test centres reference data
    this.store.dispatch(ClearTestCentresRefData());

    // Dispatch action to clear test centre journal state
    this.store.dispatch(ResetTestCentreJournal());

    // Dispatch action to clear test centre journal state
    this.store.dispatch(ResetRekeyReason());

    // Dispatch action to clear test report
    this.store.dispatch(ResetFaultMode());

    // Dispatch action to clear logs
    this.store.dispatch(ClearLogs());

    // Dispatch action to clear auth token
    // this.store.dispatch(UserActions.ClearToken());

    // Clear persisted tests from the test persistence provider
    await this.testPersistenceProvider.clearPersistedTests();

    // Clear persisted recall auto popup last displayed time from local storage
    await this.dataStoreProvider.removeItem(LocalStorageKey.JOURNAL_RECALL_AUTO_DISPLAY_TIME);

    // Clear all reminiscent of examiner records from storage
    await this.examinerRecordsProvider.clearExaminerRecordsCache();

    // Clear persisted completed tests from the completed test persistence provider
    await this.completedTestPersistenceProvider.clearPersistedCompletedTests();
  }

  /**
   * Logs out the user
   */
  public async logout(): Promise<void> {
    try {
      this.logEvent(LogType.DEBUG, 'Logout', 'Started auth logout logout flow');
      const authResult = this.authResult();
      if (authResult) {
        await AuthConnect.logout(this.provider, authResult);
      }
    } catch (error) {
      console.error(error);

      this.logEvent(
        LogType.ERROR,
        `Error occurred at logout.`,
        error
      );
    } finally {
      try {
        this.logEvent(LogType.DEBUG, 'Logout', 'Started standard logout flow');

        await this.clearStore();

        this.appConfig.shutDownStoreSubscription();

        this.logEvent(LogType.DEBUG, 'Logout', 'Finished logout flow');
      } catch (err) {
        // this.onLogoutError(err, 'Authentication provider');
        this.logEvent(LogType.ERROR, 'Authentication provider', err);

      }
    }
  }

  /**
   * An extra check has been added here to work around potential issues with Ionic Auth Connect
   * isAuthenticated() being unable to detect token expiry where user is offline and a token refresh
   * is attempted. To guard this, we perform a manual token expiry check via hasValidToken() and
   * manually expire tokens if required, prior to calling isAuthenticated()
   */
  public getAuthenticationToken = (): string => {
    // const hasValidToken: boolean = await this.hasValidToken();
    // if (!hasValidToken) {
    //   await this.expireTokens();
    // }
    // await this.isAuthenticated();
    // return this.getToken(Token.ID);
    // let token: string ='';
    return this.store.selectSignal(UserSelectors.selectIdToken)().toString();
  };

  /**
   * Determines the authentication mode based on network connectivity
   */
  async hasValidToken(): Promise<boolean> {
    try {
      const authResult = this.authResult();
      // if in un-authenticated mode, allow user to continue locally
      if (this.isInUnAuthenticatedMode()) return true;

      // refresh token when required
      await this.reauthenticateIfRequired();

      await this.refreshToken(authResult);

      const token: AzureIDToken = await AuthConnect.decodeToken<AzureIDToken>(TokenType.id, authResult);
      return !!token && token.exp && new Date(token.exp * 1000) > new Date();
    } catch (err) {
      this.logEvent(LogType.ERROR, 'hasValidToken error', err);

      return false;
    }
  }

  /**
   * Checks if the token is expired and refreshes it if necessary
   */
  public isInUnAuthenticatedMode = (): boolean => {
    const unAuthedMode = this.inUnAuthenticatedMode;

    if (unAuthedMode) {
      this.logEvent(LogType.INFO, 'isInUnAuthenticatedMode', 'In un-authenticated mode');
    }

    return unAuthedMode;
  };

  /**
   * Returns the employee ID
   */
  public getEmployeeId = (): string => {
    return this.employeeId || null;
  };

  /**
   * Gets the employee ID from the ID token
   */
  public getEmployeeIdFromIDToken = async () => {
    // rerun logic for setting employee ID
    await this.setEmployeeId();
    // retrieve set employee ID
    return this.getEmployeeId();
  };

  /**
   * Sets the employee ID from the ID token
   */
  public async setEmployeeId() {
    const authResult = this.authResult();
    const idToken = await AuthConnect.getToken(TokenType.id, authResult);
    const employeeId = idToken[idToken];
    const employeeIdClaim = Array.isArray(employeeId) ? employeeId[0] : employeeId;
    const numericEmployeeId = Number.parseInt(employeeIdClaim, 10);
    this.employeeId = numericEmployeeId.toString();
  }

  public loadEmployeeName = async (): Promise<string> => {
    const authResult = this.authResult();
    const idToken = await AuthConnect.decodeToken<AzureIDToken>(TokenType.id, authResult);
    if (idToken) {
      return idToken[this.appConfig.getAppConfig()?.authentication.employeeNameKey];
    }
    return '';
  };

}
