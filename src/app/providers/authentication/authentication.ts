import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {DelegatedRekeySearchClearState} from '@pages/delegated-rekey-search/delegated-rekey-search.actions';
import {ResetRekeyReason} from '@pages/rekey-reason/rekey-reason.actions';
import {RekeySearchClearState} from '@pages/rekey-search/rekey-search.actions';
import {ResetFaultMode} from '@pages/test-report/test-report.actions';
import {CompletedTestPersistenceProvider} from '@providers/completed-test-persistence/completed-test-persistence';
import {ExaminerRecordsProvider} from '@providers/examiner-records/examiner-records';
import {LogHelper} from '@providers/logs/logs-helper';
import {serialiseLogMessage} from '@shared/helpers/serialise-log-message';
import {LogType} from '@shared/models/log.model';
import {StoreModel} from '@shared/models/store.model';
import {UnloadAppConfig} from '@store/app-config/app-config.actions';
import {LoadAppVersion, LoadEmployeeName, UnloadAppInfo} from '@store/app-info/app-info.actions';
import {UnloadExaminerRecords} from '@store/examiner-records/examiner-records.actions';
import {UnloadJournal} from '@store/journal/journal.actions';
import {ClearLogs, SaveLog} from '@store/logs/logs.actions';
import {ClearTestCentresRefData} from '@store/reference-data/reference-data.actions';
import {ResetTestCentreJournal} from '@store/test-centre-journal/test-centre-journal.actions';
import {UnloadTests} from '@store/tests/tests.actions';
import {AppConfigProvider} from '../app-config/app-config';
import {DataStoreProvider, LocalStorageKey} from '../data-store/data-store';
import {ConnectionStatus, NetworkStateProvider} from '../network-state/network-state';
import {TestPersistenceProvider} from '../test-persistence/test-persistence';
import {
  Auth0Provider,
  AuthConnect,
  AuthResult,
  AzureProvider,
  ProviderOptions,
  TokenType
} from '@ionic-enterprise/auth';
import {Capacitor} from '@capacitor/core';
import {UnloadUserInfo, UpdateAuthResult} from '@store/user-info/user-info.actions';
import {getAuthResult} from '@store/user-info/user-info.selectors';
import {AzureIDToken} from '@providers/authentication/authentication.constants';

export enum Token {
  ID = 'idToken',
  ACCESS = 'accessToken',
  REFRESH = 'refreshToken',
}

@Injectable()
export class AuthenticationProvider {

  provider: Auth0Provider
  providerOptions: ProviderOptions
  authResult = this.store$.selectSignal(getAuthResult);

  constructor(
    private dataStoreProvider: DataStoreProvider,
    public appConfig: AppConfigProvider,
    private testPersistenceProvider: TestPersistenceProvider,
    private store$: Store<StoreModel>,
    private logHelper: LogHelper,
    private completedTestPersistenceProvider: CompletedTestPersistenceProvider,
    private examinerRecordsProvider: ExaminerRecordsProvider,
    private networkState: NetworkStateProvider
  ) {
    this.provider = new AzureProvider();
    const authSettings = this.appConfig.getAppConfig()?.authentication;
    const isNative = Capacitor.isNativePlatform();

    this.providerOptions = {
      audience: '',
      clientId: authSettings.clientId,
      discoveryUrl: `${authSettings.context}/v2.0/.well-known/openid-configuration?appid=${authSettings.clientId}`,
      logoutUrl: isNative ? authSettings.logoutUrl : 'http://localhost:8100',
      redirectUri: isNative ? authSettings.redirectUrl : 'http://localhost:8100',
      scope: 'openid offline_access profile email',
    };
    AuthConnect.setup({
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

  getEmployeeId(): string {
    return '1'
  }

  public getAuthenticationToken = async (): Promise<string> => {
    const hasValidToken: boolean = await (await this.isAuthenticated() && this.hasTokenExpired(this.authResult()));
    if (!hasValidToken) {
      await this.refreshSession();
    }
    await this.isAuthenticated();
    try {
      return JSON.parse(this.authResult().idToken);
    } catch (error) {
      return Promise.resolve(null);
    }
  };

  private storeAuthResult = (authResult: AuthResult) => {
    console.log('Storing auth result in the store:', authResult);
    this.store$.dispatch(UpdateAuthResult(authResult));
    console.log('loading employee name from auth result',authResult.idToken, (Buffer.from(authResult.idToken, 'base64').toString('binary')), this.appConfig.getAppConfig()?.authentication.employeeNameKey);
    if (authResult.idToken) {
      const decode = JSON.parse(Buffer.from(authResult.idToken, 'base64').toString());
      this.store$.dispatch(LoadEmployeeName(decode[this.appConfig.getAppConfig()?.authentication.employeeNameKey]));
    }
  }

  async login() {
    try {
      console.log('Calling AuthConnect.logsain with provider options:', this.providerOptions);
      // Initiate the login process and update the store with the auth result
      const authResult = await AuthConnect.login(this.provider, this.providerOptions);
      console.log('AuthConnect.login successful, authResult:', authResult);
      // Dispatch action to update the auth result in the store
      this.storeAuthResult(authResult);
      console.log('Auth result stored in the store');
    } catch (error) {
      console.log('AuthConnect.login error:', error);
      this.logEvent(LogType.ERROR, 'Authentication provider - Login error', error);
    }
  }

  public isOffline(): boolean {
    // Return true if the app is offline
    return this.networkState.getNetworkState() === ConnectionStatus.OFFLINE
  }

  public async refreshSession() {
    console.log('Refreshing session');
    //Refresh the session and update the store with the new auth result
    this.storeAuthResult(await AuthConnect.refreshSession(this.provider, this.authResult()));
  }

  public async isAuthenticated(): Promise<boolean> {
    try {
      // if offline, allow user to continue locally
      if (this.isOffline()) return true;

      // check to see if there is an access token to interrogate
      const available = await AuthConnect.isAccessTokenAvailable(this.authResult());

      if (available) {
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

  private async hasTokenExpired(result: AuthResult): Promise<boolean> {
    const azureIDToken = await AuthConnect.decodeToken<AzureIDToken>(TokenType.id, result);
    return !!azureIDToken && azureIDToken.exp && new Date(azureIDToken.exp * 1000) > new Date();
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

    // Dispatch action to unload user information
    this.store$.dispatch(UnloadUserInfo());

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

    // Clear persisted recall auto popup last displayed time from local storage
    await this.dataStoreProvider.removeItem(LocalStorageKey.JOURNAL_RECALL_AUTO_DISPLAY_TIME);

    // Clear all reminiscent of examiner records from storage
    await this.examinerRecordsProvider.clearExaminerRecordsCache();

    // Clear persisted completed tests from the completed test persistence provider
    await this.completedTestPersistenceProvider.clearPersistedCompletedTests();
  }

  public async logout(): Promise<void> {
    try {
      this.logEvent(LogType.DEBUG, 'Logout', 'Started logout flow');

      await this.clearStore();

      this.appConfig.shutDownStoreSubscription();

      await AuthConnect.logout(this.provider, this.authResult());

      this.logEvent(LogType.DEBUG, 'Logout', 'Finished logout flow');
    } catch (err) {
      this.logEvent(LogType.ERROR, 'Authentication provider - Logout error', err);
    }
  }

  logEvent = (logType: LogType, desc: string, msg: unknown) => {
    this.store$.dispatch(
      SaveLog({
        payload: this.logHelper.createLog(logType, desc, `AuthenticationProvider => ${serialiseLogMessage(msg)}`),
      })
    );
  };

}
