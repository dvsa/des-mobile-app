import { Injectable } from '@angular/core';
import { IonicAuth, IonicAuthOptions } from '@ionic-enterprise/auth';
import { Store } from '@ngrx/store';
import { tap } from 'rxjs/operators';
import { StoreModel } from '@shared/models/store.model';
import { selectEmployeeId } from '@store/app-info/app-info.selectors';
import { CompletedTestPersistenceProvider } from '@providers/completed-test-persistence/completed-test-persistence';
import { Subscription } from 'rxjs';
import { UnloadTests } from '@store/tests/tests.actions';
import { UnloadJournal } from '@store/journal/journal.actions';
import { LogHelper } from '@providers/logs/logs-helper';
import { SaveLog } from '@store/logs/logs.actions';
import { LogType } from '@shared/models/log.model';
import { ClearTestCentresRefData } from '@store/reference-data/reference-data.actions';
import { AppConfigProvider } from '../app-config/app-config';
import { ConnectionStatus, NetworkStateProvider } from '../network-state/network-state';
import { TestPersistenceProvider } from '../test-persistence/test-persistence';
import { DataStoreProvider } from '../data-store/data-store';

export enum Token {
  ID = 'idToken',
  ACCESS = 'accessToken',
  REFRESH = 'refreshToken',
}

@Injectable()
export class AuthenticationProvider {

  public authenticationSettings: any;
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
    private completedTestPersistenceProvider: CompletedTestPersistenceProvider,
  ) {
    this.setStoreSubscription();
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
      iosWebView: 'shared',
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
      await this.ionicAuth.expire();
    } catch (error) {
      this.store$.dispatch(SaveLog({
        payload: this.logHelper.createLog(LogType.ERROR, 'expireTokens error', error),
      }));
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
    this.authenticationSettings = this.appConfig.getAppConfig()?.authentication;
    this.employeeIdKey = this.appConfig.getAppConfig()?.authentication.employeeIdKey;
    this.inUnAuthenticatedMode = false;
    this.ionicAuth = new IonicAuth(this.getAuthOptions());
  };

  public isInUnAuthenticatedMode = (): boolean => {
    return this.inUnAuthenticatedMode;
  };

  public async isAuthenticated(): Promise<boolean> {
    if (this.isInUnAuthenticatedMode()) {
      return Promise.resolve(true);
    }

    try {
      if (await this.ionicAuth.isAccessTokenAvailable() && await this.ionicAuth.isAccessTokenExpired()) {
        await this.ionicAuth.refreshSession();
        return true;
      }
      return false;
    } catch (err) {
      this.store$.dispatch(SaveLog({
        payload: this.logHelper.createLog(LogType.ERROR, 'isAuthenticated error', err),
      }));
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
    if (this.isInUnAuthenticatedMode()) {
      return Promise.resolve(true);
    }
    // refresh token if required
    try {
      await this.ionicAuth.isAuthenticated();
      await this.refreshTokenIfExpired();
      const token = await this.ionicAuth.getIdToken();
      return !!token && token.exp && new Date(token.exp * 1000) > new Date();
    } catch (err) {
      this.store$.dispatch(SaveLog({
        payload: this.logHelper.createLog(LogType.ERROR, 'hasValidToken error', err),
      }));
      return false;
    }
  }

  async refreshTokenIfExpired(): Promise<void> {
    try {
      const token = await this.ionicAuth.getIdToken();
      if (token && this.isTokenExpired(token)) {
        await this.ionicAuth.refreshSession();
      }
    } catch (error) {
      this.store$.dispatch(SaveLog({
        payload: this.logHelper.createLog(LogType.ERROR, 'refreshTokenIfExpired error', error),
      }));
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
    // eslint-disable-next-line max-len
    // return 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ii1LSTNROW5OUjdiUm9meG1lWm9YcWJIWkdldyJ9.eyJhdWQiOiI5MjNiMDdkNC04MGVlLTQ1MjQtOGYzOC1jMTIzMGFlZmUxNTEiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vNmM0NDhkOTAtNGNhMS00Y2FmLWFiNTktMGEyYWE2N2Q3ODAxL3YyLjAiLCJpYXQiOjE2ODg5ODcxMjEsIm5iZiI6MTY4ODk4NzEyMSwiZXhwIjoxNjg4OTg4NjIxLCJhaW8iOiJBVVFBdS84VEFBQUFYbzRGV2JhZElLeTlQR0Y3SDhYa3ZDWkU2RGNaZ2Z2OXlmQ2xKVEErQmJPRU1uUHhyeVBIMGFsaTFNUEJxWDAvUzFMY0w0YnhwRWJJQU5iZnRvL0ZRUT09IiwibmFtZSI6Ik1FU0JldGEgVXNlciAxIiwib2lkIjoiZDQ4NDEyZTgtMWU5ZS00Zjc3LTliYzYtZWVkOGZlM2I1MWVmIiwicHJlZmVycmVkX3VzZXJuYW1lIjoibW9iZXhhbWluZXIxQGR2c2F0ZXN0LWNsb3VkLnVrIiwicmgiOiIwLkFVZ0FrSTFFYktGTXIweXJXUW9xcG4xNEFkUUhPNUx1Z0NSRmp6akJJd3J2NFZGSUFDUS4iLCJzdWIiOiJpandGUGFDRk9RcjVlTXg1NC1MMkhaZ1FiOEctZHJvRkJGV1ZrUEI0SVdjIiwidGlkIjoiNmM0NDhkOTAtNGNhMS00Y2FmLWFiNTktMGEyYWE2N2Q3ODAxIiwidXRpIjoid3JZYjU3UzBWMENsRDh3VVpWMVdBQSIsInZlciI6IjIuMCIsImVtcGxveWVlaWQiOiIxMjM0NTY3In0.gyytxxYQ3DKEpmLzJxIAR95D1dHbffurUvBhvq1dkceVgmD2irsQkiJBKaY_YUIfv7G_4p-uG4tl4K_U9ewzahG1oprRJzqs0G7U9a1optuZxbH-KZ8_Fye5tMilWydaTaTvXAAKyl9E-zBqVFbC2Q5Pk9SA5K4rrLVRkMb2dTV_zjEH7W4MSHVf8RALhYe8kaa4dY9NdrBOyyWPS88Pxj6B3QUj0WTA3X96UtYdB_GXGHwM9ZuZfwAGVxz-glwTaIhX3qiRoFb7cMuqdB1hUmT7Q6DKz_Mk41LRAoimPad2AtXRRW2n5JQId_tw1fnAk_34BgzW1CE4aIdkwm-GRQ';
  };

  public getEmployeeId = (): string => {
    return this.employeeId || null;
  };

  private setStoreSubscription = (): void => {
    this.subscription = this.store$.select(selectEmployeeId)
      .pipe(
        tap((employeeId: string) => {
          if (employeeId) this.employeeId = employeeId;
        }),
      )
      .subscribe();
  };

  public loadEmployeeName = async (): Promise<string> => {
    const idToken = await this.ionicAuth.getIdToken();
    if (idToken) {
      return idToken[this.appConfig.getAppConfig()?.authentication.employeeNameKey];
    }
    return '';
  };

  public async login(): Promise<void> {
    if (this.isInUnAuthenticatedMode()) {
      return Promise.resolve();
    }
    return this.ionicAuth.login();
  }

  public async logout(): Promise<void> {
    try {
      if (this.appConfig.getAppConfig()?.logoutClearsTestPersistence) {
        await this.testPersistenceProvider.clearPersistedTests();
        await this.completedTestPersistenceProvider.clearPersistedCompletedTests();
      }

      this.store$.dispatch(UnloadJournal());
      this.store$.dispatch(UnloadTests());
      this.store$.dispatch(ClearTestCentresRefData());

      await this.clearTokens();
      this.appConfig.shutDownStoreSubscription();
      this.subscription?.unsubscribe();
      await this.ionicAuth.logout();
    } catch (err) {
      this.onLogoutError(err, 'Authentication provider');
    }
  }

  public onLogoutError = (err: any, prefix?: string): void => {
    const basicDesc = 'Logout error';
    const desc = prefix ? `${prefix} - ${basicDesc}` : basicDesc;
    this.store$.dispatch(SaveLog({
      payload: this.logHelper.createLog(LogType.ERROR, desc, err),
    }));
  };

  public async setEmployeeId() {
    const idToken = await this.ionicAuth.getIdToken();
    const employeeId = idToken[this.employeeIdKey];
    const employeeIdClaim = Array.isArray(employeeId) ? employeeId[0] : employeeId;
    const numericEmployeeId = Number.parseInt(employeeIdClaim, 10);
    this.employeeId = numericEmployeeId.toString();
  }

}
