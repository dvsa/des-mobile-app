import { Component, OnInit } from '@angular/core';
import { LoadingController, Platform } from '@ionic/angular';
import { AppConfigProvider } from '../providers/app-config/app-config';
import { AuthenticationProvider } from '../providers/authentication/authentication';
import { SecureStorage } from '@ionic-native/secure-storage/ngx';
import { DataStoreProvider } from '../providers/data-store/data-store';
import { NetworkStateProvider } from '../providers/network-state/network-state';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(
    public loadingController: LoadingController,
    public platform: Platform,
    public appConfigProvider: AppConfigProvider,
    public authenticationProvider: AuthenticationProvider,
    public secureStorage: SecureStorage,
    public dataStore: DataStoreProvider,
    public networkStateProvider: NetworkStateProvider,
  ) {
    this.networkStateProvider.initialiseNetworkState();
  }

  ngOnInit() {
  }

  isUserNotAuthorised = (): boolean => {
    return true;
  }

  login = async (): Promise<any> => {
    await this.handleLoadingUI(true);
    console.log('loginClicked');

    try {
      await this.platform.ready();
      await this.initialiseAppConfig();
      this.initialiseAuthentication();

      await this.initialisePersistentStorage();

      await this.authenticationProvider.expireTokens();

      const isAuthenticated = await this.authenticationProvider.isAuthenticated();
      console.log('isAuthenticated', isAuthenticated);

      await this.authenticationProvider.login();

      await this.handleLoadingUI(false);
    } catch (error) {

      await this.handleLoadingUI(false);
    }
  }

  initialiseAppConfig = (): Promise<void> => {
    return this.appConfigProvider.initialiseAppConfig();
  }

  initialiseAuthentication = (): void => {
    this.authenticationProvider.initialiseAuthentication();
    this.authenticationProvider.determineAuthenticationMode();
  }

  async initialisePersistentStorage(): Promise<void> {
    if (this.platform.is('ios')) {
      try {
        const storage = await this.secureStorage.create('DVSAApp');
        this.dataStore.setSecureContainer(storage);

        return Promise.resolve();
      } catch (err) {
        return Promise.reject(err);
      }
    }
  }

  async handleLoadingUI(isLoading: boolean): Promise<void> {
    if (isLoading) {
      await this.loadingController.create({
        spinner: 'circles',
        message: 'App initialising...',
      }).then(result => {
        result.present();
      });
      return;
    }
    await this.loadingController.dismiss();
  }

}
