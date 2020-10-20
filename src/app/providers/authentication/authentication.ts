import { Injectable } from '@angular/core';
import { AppConfigProvider } from '../app-config/app-config';
import { IonicAuth, IonicAuthOptions } from '@ionic-enterprise/auth';
import { DataStoreProvider } from '../data-store/data-store';

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

}
