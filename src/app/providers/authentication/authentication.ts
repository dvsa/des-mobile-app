import { Injectable, NgZone } from '@angular/core';
import {
  AuthConnect, AuthConnectConfig, AzureProvider, ProviderOptions, TokenType,
} from '@ionic-enterprise/auth';
import { Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { CompletedTestPersistenceProvider } from '@providers/completed-test-persistence/completed-test-persistence';
import { LogHelper } from '@providers/logs/logs-helper';
import { VaultProvider } from '@providers/vault/vault.provider';
import { SaveLog } from '@store/logs/logs.actions';
import { LogType } from '@shared/models/log.model';
import { UnloadJournal } from '@store/journal/journal.actions';
import { UnloadTests } from '@store/tests/tests.actions';
import { UnloadRefData } from '@store/reference-data/reference-data.actions';
import { AppConfigProvider } from '../app-config/app-config';
import { ConnectionStatus, NetworkStateProvider } from '../network-state/network-state';
import { TestPersistenceProvider } from '../test-persistence/test-persistence';

// Public methods only
interface AuthProvider {
  determineAuthenticationMode: () => void;
  expireTokens: () => Promise<void>;
  hasValidToken: () => Promise<boolean>;
  init: () => Promise<void>;
  isAuthenticated: () => Promise<boolean>;
  isInUnAuthenticatedMode: () => boolean;
  getAuthenticationToken: () => Promise<string>;
  getEmployeeName: () => Promise<string>;
  getEmployeeId: () => string;
  geIdToken: () => Promise<string>;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  onLogoutError: (msg: string) => void;
  setEmployeeId: () => Promise<void>;
}

@Injectable({ providedIn: 'root' })
export class AuthenticationProvider implements AuthProvider {
  private employeeId: string;
  private inUnAuthenticatedMode: boolean;
  private static PROVIDER: AzureProvider = new AzureProvider();
  private static CONFIG: AuthConnectConfig = {
    platform: 'capacitor',
    logLevel: 'DEBUG',
    ios: { webView: 'shared' },
  };

  private get options(): ProviderOptions {
    const authSettings = this.appConfig.getAppConfig()?.authentication;
    return {
      clientId: authSettings.clientId,
      audience: authSettings.context,
      scope: 'openid offline_access profile email',
      discoveryUrl: `${authSettings.context}/v2.0/.well-known/openid-configuration?appid=${authSettings.clientId}`,
      redirectUri: authSettings.redirectUrl,
      logoutUrl: authSettings.redirectUrl,
    };
  }

  constructor(
    private networkState: NetworkStateProvider,
    private appConfig: AppConfigProvider,
    private testPersistenceProvider: TestPersistenceProvider,
    private store$: Store<StoreModel>,
    private logHelper: LogHelper,
    private completedTestPersistenceProvider: CompletedTestPersistenceProvider,
    private ngZone: NgZone,
    private vault: VaultProvider,
  ) {
  }

  public async init(): Promise<void> {
    try {
      await AuthConnect.setup(AuthenticationProvider.CONFIG);
    } catch (err) {
      this.authLogger(LogType.ERROR, 'init', err);
      throw err;
    }
  }

  public async login(): Promise<void> {
    try {
      const authResult = await AuthConnect.login(AuthenticationProvider.PROVIDER, this.options);
      await this.vault.setAuthResult(authResult);
    } catch (err) {
      this.authLogger(LogType.ERROR, 'login', err);
      throw err;
    }
  }

  public async logout(): Promise<void> {
    try {
      // Clear dataStore
      if (this.appConfig.getAppConfig()?.logoutClearsTestPersistence) {
        await this.testPersistenceProvider.clearPersistedTests();
        await this.completedTestPersistenceProvider.clearPersistedCompletedTests();
      }

      // Clear state
      this.store$.dispatch(UnloadJournal());
      this.store$.dispatch(UnloadTests());
      this.store$.dispatch(UnloadRefData());

      // Clear vault
      // - Must obtain the current value of authResult before clearing vault as we need to pass it to logout
      const authResult = await this.vault.getAuthResult();

      // Due to a quirk with Azure not closing down webview automatically, we must complete logout steps
      // before calling through to AuthConnect.logout as the promise for logout never completes successfully
      await AuthConnect.logout(AuthenticationProvider.PROVIDER, authResult!);
    } catch (err) {
      this.authLogger(LogType.ERROR, 'logout', err);
    } finally {
      await this.vault.setAuthResult(null);
      await this.vault.clear();
    }
  }

  public async setEmployeeId(): Promise<void> {
    try {
      const idToken = await this.decodeToken(TokenType.id);
      if (!idToken) return;

      const { employeeIdKey } = this.appConfig.getAppConfig()?.authentication;

      this.employeeId = this.getEmployeeIDFromToken(idToken, employeeIdKey);
    } catch (err) {
      this.authLogger(LogType.ERROR, 'setEmployeeId', err);
      throw err;
    }
  }

  public getEmployeeName = async (): Promise<string> => {
    try {
      const idToken = await this.decodeToken(TokenType.id);
      if (!idToken) return '';

      const { employeeNameKey } = this.appConfig.getAppConfig()?.authentication;

      return idToken[employeeNameKey];
    } catch (err) {
      this.authLogger(LogType.ERROR, 'getEmployeeName', err);
      throw err;
    }
  };

  public async isAuthenticated(): Promise<boolean> {
    if (this.isInUnAuthenticatedMode()) return true;

    try {
      const authResult = await this.vault.getAuthResult();
      if (!authResult) return false;

      if (await AuthConnect.isAccessTokenAvailable(authResult) && await AuthConnect.isAccessTokenExpired(authResult)) {
        await AuthConnect.refreshSession(AuthenticationProvider.PROVIDER, authResult);
        return true;
      }
      return false;
    } catch (err) {
      this.authLogger(LogType.ERROR, 'isAuthenticated', err, 'catch');
      return false;
    }
  }

  public getAuthenticationToken = async (): Promise<string> => {
    const hasValidToken: boolean = await this.hasValidToken();
    if (!hasValidToken) {
      await this.expireTokens();
    }
    await this.isAuthenticated();
    return this.geIdToken();
  };

  public async expireTokens(): Promise<void> {
    try {
      const authResult = await this.vault.getAuthResult();
      if (!authResult) return;

      await AuthConnect.expire(authResult);
    } catch (err) {
      this.authLogger(LogType.ERROR, 'expireTokens', err);
    }
  }

  public async hasValidToken(): Promise<boolean> {
    try {
      if (this.isInUnAuthenticatedMode()) return true;

      await this.isAuthenticated();

      await this.refreshTokenIfExpired();

      const token = await this.decodeToken(TokenType.id);
      return !this.isTokenExpired(token);
    } catch (err) {
      this.authLogger(LogType.ERROR, 'hasValidToken', err);
      return false;
    }
  }

  public determineAuthenticationMode = (): void => {
    this.inUnAuthenticatedMode = false;
    const mode = this.networkState.getNetworkState() === ConnectionStatus.OFFLINE;
    this.setUnAuthenticatedMode(mode);
  };

  public async geIdToken(): Promise<string> {
    return this.getToken(TokenType.id);
  }

  public getEmployeeId = (): string => {
    return this.employeeId || null;
  };

  public onLogoutError(msg: string) {
    return this.authLogger(LogType.ERROR, 'logout - external', msg);
  }

  public isInUnAuthenticatedMode = (): boolean => {
    return this.inUnAuthenticatedMode;
  };

  private setUnAuthenticatedMode = (mode: boolean): void => {
    this.inUnAuthenticatedMode = mode;
  };

  private async refreshTokenIfExpired(): Promise<void> {
    try {
      const authResult = await this.vault.getAuthResult();
      if (!authResult) return;

      // Not using common `decodeToken` method as need authResult for refreshSession;
      const token = await AuthConnect.decodeToken(TokenType.id, authResult);

      if (token && this.isTokenExpired(token)) {
        await AuthConnect.refreshSession(AuthenticationProvider.PROVIDER, authResult);
      }
    } catch (err) {
      this.authLogger(LogType.ERROR, 'refreshTokenIfExpired', err);
    }
  }

  private async getToken(tokenType: TokenType): Promise<string | undefined> {
    try {
      const authResult = await this.vault.getAuthResult();
      if (!authResult) return undefined;

      await this.isAuthenticated();
      return await AuthConnect.getToken(tokenType, authResult);
    } catch (err) {
      this.authLogger(LogType.ERROR, 'getToken', err, tokenType);
      throw err;
    }
  }

  private async decodeToken(tokenType: TokenType) {
    try {
      const authResult = await this.vault.getAuthResult();
      if (!authResult) return undefined;

      return await AuthConnect.decodeToken(tokenType, authResult!);
    } catch (err) {
      this.authLogger(LogType.ERROR, 'decodeToken', err, tokenType);
      throw err;
    }
  }

  private authLogger(logType: LogType, method: string, msg: string, context: string = ''): void {
    this.store$.dispatch(SaveLog({
      payload: this.logHelper.createLog(logType, `${method} error ${context}`, msg),
    }));
  }

  private getEmployeeIDFromToken = (token: any, employeeIdKey: string): string => {
    const employeeId = token[employeeIdKey];
    const employeeIdClaim = Array.isArray(employeeId) ? employeeId[0] : employeeId;
    const numericEmployeeId = Number.parseInt(employeeIdClaim, 10);
    return numericEmployeeId.toString();
  };

  private isTokenExpired = <T extends { exp?: number; }>(token: T): boolean => {
    if (!token) {
      return true;
    }
    return token.exp && new Date(token.exp * 1000) < new Date();
  };

}
