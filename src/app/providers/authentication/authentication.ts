import { Injectable } from '@angular/core';
import { AppConfigProvider } from '../app-config/app-config';
import { IonicAuth, IonicAuthOptions } from '@ionic-enterprise/auth';
import { DataStoreProvider } from '../data-store/data-store';
import { ConnectionStatus, NetworkStateProvider } from '../network-state/network-state';

export enum Token {
  ID = 'idToken',
  ACCESS = 'accessToken',
  REFRESH = 'refreshToken',
}

@Injectable()
export class AuthenticationProvider {

  public authenticationSettings: any;
  private employeeIdKey: string;
  private inUnAuthenticatedMode: boolean;
  public ionicAuth: IonicAuth;

  constructor(
    private appConfig: AppConfigProvider,
    private dataStoreProvider: DataStoreProvider,
    private networkState: NetworkStateProvider,
  ) {

  }

  private getAuthOptions =  (): IonicAuthOptions => {
    const authSettings = this.appConfig.getAppConfig().authentication;
    console.log('authSettings', authSettings);
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
        getAccessToken: async () => await this.getToken(Token.ACCESS),
        setAccessToken: async (token: string) => await this.setToken(Token.ACCESS, token),
        getIdToken: async () => await this.getToken(Token.ID),
        setIdToken: async (token: string) => await this.setToken(Token.ID, token),
        getRefreshToken: async () => await this.getToken(Token.REFRESH),
        setRefreshToken: async (token: string) => await this.setToken(Token.REFRESH, token),
      },
    };
  }

  public async expireTokens(): Promise<void> {
    await this.ionicAuth.expire();
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

  public initialiseAuthentication = (): void => {
    this.authenticationSettings = this.appConfig.getAppConfig().authentication;
    this.employeeIdKey = this.appConfig.getAppConfig().authentication.employeeIdKey;
    this.inUnAuthenticatedMode = false;
    this.ionicAuth = new IonicAuth(this.getAuthOptions());
  }

  public isInUnAuthenticatedMode = (): boolean => {
    console.log('this.inUnAuthenticatedMode', this.inUnAuthenticatedMode);
    return this.inUnAuthenticatedMode;
  }

  public async isAuthenticated(): Promise<boolean> {
    if (this.isInUnAuthenticatedMode()) {
      return Promise.resolve(true);
    }
    return await this.ionicAuth.isAuthenticated();
  }

  public setUnAuthenticatedMode = (mode: boolean): void => {
    this.inUnAuthenticatedMode = mode;
  }

  public determineAuthenticationMode = (): void => {
    console.log('networkState', this.networkState.getNetworkState());
    const mode = this.networkState.getNetworkState() === ConnectionStatus.OFFLINE;
    this.setUnAuthenticatedMode(mode);
  }

  public getAuthenticationToken = async (): Promise<string> => {
    await this.isAuthenticated();
    return this.getToken(Token.ID);
  }

  private async clearTokens(): Promise<void> {
    await this.dataStoreProvider.removeItem(Token.ACCESS);
    await this.dataStoreProvider.removeItem(Token.ID);
    await this.dataStoreProvider.removeItem(Token.REFRESH);

    console.log('tokenid', );
  }

  public async login(): Promise<void> {
    if (this.isInUnAuthenticatedMode()) {
      return Promise.resolve();
    }
    return await this.ionicAuth.login();
  }

  public async logout(): Promise<void> {
    // TODO add call to function to clear out state

    await this.clearTokens();
    await this.ionicAuth.logout();
  }

}
