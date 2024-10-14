import { Injectable } from '@angular/core';
import { IonicAuth, IonicAuthOptions } from '@ionic-enterprise/auth';
import { Store } from '@ngrx/store';
import { DelegatedRekeySearchClearState } from '@pages/delegated-rekey-search/delegated-rekey-search.actions';
import { ResetRekeyReason } from '@pages/rekey-reason/rekey-reason.actions';
import { UnloadRekeySearch } from '@pages/rekey-search/rekey-search.actions';
import { ResetFaultMode } from '@pages/test-report/test-report.actions';
import { CompletedTestPersistenceProvider } from '@providers/completed-test-persistence/completed-test-persistence';
import { LogHelper } from '@providers/logs/logs-helper';
import { serialiseLogMessage } from '@shared/helpers/serialise-log-message';
import { LogType } from '@shared/models/log.model';
import { StoreModel } from '@shared/models/store.model';
import { UnloadAppConfig } from '@store/app-config/app-config.actions';
import { UnloadAppInfo } from '@store/app-info/app-info.actions';
import { selectEmployeeId } from '@store/app-info/app-info.selectors';
import { UnloadExaminerRecords } from '@store/examiner-records/examiner-records.actions';
import { UnloadJournal } from '@store/journal/journal.actions';
import { ClearLogs, SaveLog } from '@store/logs/logs.actions';
import { ClearTestCentresRefData } from '@store/reference-data/reference-data.actions';
import { ResetTestCentreJournal } from '@store/test-centre-journal/test-centre-journal.actions';
import { UnloadTests } from '@store/tests/tests.actions';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AppConfigProvider } from '../app-config/app-config';
import { DataStoreProvider } from '../data-store/data-store';
import { ConnectionStatus, NetworkStateProvider } from '../network-state/network-state';
import { TestPersistenceProvider } from '../test-persistence/test-persistence';

export enum Token {
  ID = 'idToken',
  ACCESS = 'accessToken',
  REFRESH = 'refreshToken',
}

@Injectable()
export class AuthenticationProvider {
  private subscription: Subscription;
  private employeeIdKey: string;
  private employeeId: string;
  private inUnAuthenticatedMode: boolean;
  public ionicAuth: IonicAuth;

  constructor(
    private dataStoreProvider: DataStoreProvider,
    private networkState: NetworkStateProvider,
    private appConfig: AppConfigProvider,
    private testPersistenceProvider: TestPersistenceProvider,
    private store$: Store<StoreModel>,
    private logHelper: LogHelper,
    private completedTestPersistenceProvider: CompletedTestPersistenceProvider
  ) {
    this.setStoreSubscription();
  }

  get authConnect() {
    // if the context of `ionicAuth` is lost, the re-initialise
    if (!this.ionicAuth) this.initialiseAuthentication();

    // update value of `inUnAuthenticatedMode` before trying to interact with auth connect methods
    this.determineAuthenticationMode();

    return this.ionicAuth;
  }

  private getAuthOptions = (): IonicAuthOptions => {
    const authSettings = this.appConfig.getAppConfig()?.authentication;
    return {
      logLevel: 'DEBUG',
      authConfig: 'azure',
      platform: 'capacitor',
      clientID: authSettings.clientId,
      discoveryUrl: `${authSettings.context}/v2.0/.well-known/openid-configuration?appid=${authSettings.clientId}`,
      redirectUri: authSettings.redirectUrl,
      scope: 'openid offline_access profile email',
      logoutUrl: authSettings.logoutUrl,
      iosWebView: 'private',
      tokenStorageProvider: {
        getAccessToken: async () => this.getToken(Token.ACCESS),
        setAccessToken: async (token: string) => this.setToken(Token.ACCESS, token),
        getIdToken: async () => this.getToken(Token.ID),
        setIdToken: async (token: string) => this.setToken(Token.ID, token),
        getRefreshToken: async () => this.getToken(Token.REFRESH),
        setRefreshToken: async (token: string) => this.setToken(Token.REFRESH, token),
      },
    };
  };

  public async expireTokens(): Promise<void> {
    try {
      await this.authConnect.expire();
    } catch (error) {
      this.logEvent(LogType.ERROR, 'expireTokens error', error);
    }
  }

  private async getToken(tokenName: Token): Promise<string | null> {
    try {
      return JSON.parse(await this.dataStoreProvider.getItem(tokenName));
    } catch (error) {
      return Promise.resolve(null);
    }
  }

  private async setToken(tokenName: Token, token: string): Promise<void> {
    await this.dataStoreProvider.setItem(tokenName, JSON.stringify(token));
    return Promise.resolve();
  }

  private async clearTokens(): Promise<void> {
    await this.dataStoreProvider.removeItem(Token.ACCESS);
    await this.dataStoreProvider.removeItem(Token.ID);
    await this.dataStoreProvider.removeItem(Token.REFRESH);
  }

  public initialiseAuthentication = (): void => {
    const auth = this.appConfig.getAppConfig()?.authentication;
    this.employeeIdKey = auth.employeeIdKey;
    this.inUnAuthenticatedMode = false;
    this.ionicAuth = new IonicAuth(this.getAuthOptions());
  };

  public isInUnAuthenticatedMode = (): boolean => {
    const unAuthedMode = this.inUnAuthenticatedMode;

    if (unAuthedMode) {
      this.logEvent(LogType.INFO, 'isInUnAuthenticatedMode', 'In un-authenticated mode');
    }

    return unAuthedMode;
  };

  public async isAuthenticated(): Promise<boolean> {
    try {
      // if in un-authenticated mode, allow user to continue locally
      if (this.isInUnAuthenticatedMode()) return true;

      // check to see if there is an access token to interrogate
      const available = await this.authConnect.isAccessTokenAvailable();

      if (available) {
        // determine if the existing token is expired
        const expired = await this.authConnect.isAccessTokenExpired();

        // attempt a token refresh
        if (expired) {
          await this.authConnect.refreshSession();
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

  public setUnAuthenticatedMode = (mode: boolean): void => {
    this.inUnAuthenticatedMode = mode;
  };

  public determineAuthenticationMode = (): void => {
    const mode = this.networkState.getNetworkState() === ConnectionStatus.OFFLINE;
    this.setUnAuthenticatedMode(mode);
  };

  async hasValidToken(): Promise<boolean> {
    try {
      // if in un-authenticated mode, allow user to continue locally
      if (this.isInUnAuthenticatedMode()) return true;

      // refresh token when required
      await this.authConnect.isAuthenticated();

      await this.refreshTokenIfExpired();

      const token = await this.authConnect.getIdToken();
      return !!token && token.exp && new Date(token.exp * 1000) > new Date();
    } catch (err) {
      this.logEvent(LogType.ERROR, 'hasValidToken error', err);
      return false;
    }
  }

  async refreshTokenIfExpired(): Promise<void> {
    try {
      const token = await this.authConnect.getIdToken();
      if (token && this.isTokenExpired(token)) {
        await this.authConnect.refreshSession();
      }
    } catch (error) {
      this.logEvent(LogType.ERROR, 'refreshTokenIfExpired error', error);
      throw error;
    }
  }

  isTokenExpired(token: any): boolean {
    return token.exp && new Date(token.exp * 1000) < new Date();
  }

  /**
   * An extra check has been added here to work around potential issues with Ionic Auth Connect
   * isAuthenticated() being unable to detect token expiry where user is offline and a token refresh
   * is attempted. To guard this, we perform a manual token expiry check via hasValidToken() and
   * manually expire tokens if required, prior to calling isAuthenticated()
   */
  public getAuthenticationToken = async (): Promise<string> => {
    const hasValidToken: boolean = await this.hasValidToken();
    if (!hasValidToken) {
      await this.expireTokens();
    }
    await this.isAuthenticated();
    return this.getToken(Token.ID);
  };

  public getEmployeeId = (): string => {
    return this.employeeId || null;
  };

  private setStoreSubscription = (): void => {
    this.subscription = this.store$
      .select(selectEmployeeId)
      .pipe(
        tap((employeeId: string) => {
          if (employeeId) this.employeeId = employeeId;
        })
      )
      .subscribe();
  };

  public loadEmployeeName = async (): Promise<string> => {
    const idToken = await this.authConnect.getIdToken();
    if (idToken) {
      return idToken[this.appConfig.getAppConfig()?.authentication.employeeNameKey];
    }
    return '';
  };

  public async login(): Promise<void> {
    if (this.isInUnAuthenticatedMode()) {
      return Promise.resolve();
    }
    this.logEvent(LogType.DEBUG, 'Login', 'Started login flow');
    return this.authConnect.login();
  }

  async clearStore() {
    // Clear persisted tests from the test persistence provider
    await this.testPersistenceProvider.clearPersistedTests();

    // Clear persisted completed tests from the completed test persistence provider
    await this.completedTestPersistenceProvider.clearPersistedCompletedTests();

    // Dispatch action to unload the journal
    this.store$.dispatch(UnloadJournal());

    // Dispatch action to unload tests
    this.store$.dispatch(UnloadTests());

    // Dispatch action to unload app config
    this.store$.dispatch(UnloadAppConfig());

    // Dispatch action to unload rekey search data
    this.store$.dispatch(UnloadRekeySearch());

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
  }

  public async logout(): Promise<void> {
    try {
      this.logEvent(LogType.DEBUG, 'Logout', 'Started logout flow');

      await this.clearStore();

      await this.clearTokens();

      this.appConfig.shutDownStoreSubscription();

      this.subscription?.unsubscribe();

      await this.authConnect.logout();

      this.logEvent(LogType.DEBUG, 'Logout', 'Finished logout flow');
    } catch (err) {
      this.onLogoutError(err, 'Authentication provider');
    }
  }

  public getEmployeeIdFromIDToken = async () => {
    // rerun logic for setting employee ID
    await this.setEmployeeId();
    // retrieve set employee ID
    return this.getEmployeeId();
  };

  public async setEmployeeId() {
    const idToken = await this.authConnect.getIdToken();
    const employeeId = idToken[this.employeeIdKey];
    const employeeIdClaim = Array.isArray(employeeId) ? employeeId[0] : employeeId;
    const numericEmployeeId = Number.parseInt(employeeIdClaim, 10);
    this.employeeId = numericEmployeeId.toString();
  }

  private logEvent = (logType: LogType, desc: string, msg: unknown) => {
    this.store$.dispatch(
      SaveLog({
        payload: this.logHelper.createLog(logType, desc, `AuthenticationProvider => ${serialiseLogMessage(msg)}`),
      })
    );
  };

  public onLogoutError = (err: unknown, prefix?: string): void => {
    const basicDesc = 'Logout error';
    const desc = prefix ? `${prefix} - ${basicDesc}` : basicDesc;
    this.logEvent(LogType.ERROR, desc, err);
  };
}
