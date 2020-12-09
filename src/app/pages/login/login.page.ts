import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, Platform } from '@ionic/angular';
import { SecureStorage } from '@ionic-native/secure-storage/ngx';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfigProvider } from '../../providers/app-config/app-config';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { DataStoreProvider } from '../../providers/data-store/data-store';
import { NetworkStateProvider } from '../../providers/network-state/network-state';
import { AuthenticationError } from '../../providers/authentication/authentication.constants';
import { AppConfigError } from '../../providers/app-config/app-config.constants';
import { BasePageComponent } from '../../shared/classes/base-page';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage extends BasePageComponent implements OnInit {

  appInitError: AuthenticationError | AppConfigError;
  hasUserLoggedOut = false;
  hasDeviceTypeError = false;

  constructor(
    public loadingController: LoadingController,
    public alertController: AlertController,
    public platform: Platform,
    public appConfigProvider: AppConfigProvider,
    public authenticationProvider: AuthenticationProvider,
    public secureStorage: SecureStorage,
    public dataStore: DataStoreProvider,
    public networkStateProvider: NetworkStateProvider,
    public router: Router,
    public route: ActivatedRoute,
    public alertCtrl: AlertController,
  ) {
    super(platform);
  }

  ngOnInit(): void {

    this.route.queryParams.subscribe(() => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.hasUserLoggedOut = this.router.getCurrentNavigation().extras.state.hasLoggedOut;
      }
    });

    this.networkStateProvider.initialiseNetworkState();

    // Trigger Authentication if ios device
    if (!this.hasUserLoggedOut && this.isIos()) {
      this.login();
    }
  }

  isUserNotAuthorised = (): boolean => {
    return !this.hasUserLoggedOut && this.appInitError === AuthenticationError.USER_NOT_AUTHORISED;
  };

  isInvalidAppVersionError = (): boolean => {
    return !this.hasUserLoggedOut && this.appInitError === AppConfigError.INVALID_APP_VERSION;
  };

  login = async (): Promise<any> => {
    await this.handleLoadingUI(true);

    try {
      await this.platform.ready();
      await this.initialiseAppConfig();
      this.initialiseAuthentication();

      await this.initialisePersistentStorage();

      await this.authenticationProvider.expireTokens();
      await this.authenticationProvider.login();

      await this.handleLoadingUI(false);
      this.validateDeviceType();
    } catch (error) {

      await this.handleLoadingUI(false);

      if (error === AuthenticationError.USER_NOT_AUTHORISED) {
        await this.authenticationProvider.logout();
      }
      this.appInitError = error;
      console.log(error);
    }
  };

  initialiseAppConfig = (): Promise<void> => {
    return this.appConfigProvider.initialiseAppConfig();
  };

  initialiseAuthentication = (): void => {
    this.authenticationProvider.initialiseAuthentication();
    this.authenticationProvider.determineAuthenticationMode();
  };

  async initialisePersistentStorage(): Promise<void> {
    if (this.platform.is('ios')) {
      try {
        const storage = await this.secureStorage.create('DES');
        this.dataStore.setSecureContainer(storage);

        return Promise.resolve();
      } catch (err) {
        return Promise.reject(err);
      }
    }
  }

  isInternetConnectionError = (): boolean => {
    return !this.hasUserLoggedOut && this.appInitError === AuthenticationError.NO_INTERNET;
  };

  isUserCancelledError = (): boolean => {
    return !this.hasUserLoggedOut && this.appInitError === AuthenticationError.USER_CANCELLED;
  };

  isUnknownError = (): boolean => {
    return !this.hasUserLoggedOut
      && this.appInitError
      && this.appInitError.valueOf() !== AuthenticationError.USER_CANCELLED
      && this.appInitError.valueOf() !== AuthenticationError.NO_INTERNET
      && this.appInitError.valueOf() !== AuthenticationError.USER_NOT_AUTHORISED
      && this.appInitError.valueOf() !== AppConfigError.INVALID_APP_VERSION;
  };

  /**
   * Check app is running on a supported device and navigate to app starting page
   */
  validateDeviceType = (): void => {
    this.router.navigate(['home']);
  };

  async showErrorDetails() {
    const alert = await this.alertController.create({
      header: 'Error details',
      message: JSON.stringify(this.appInitError),
      buttons: ['OK'],
    });
    await alert.present();
  }

  async handleLoadingUI(isLoading: boolean): Promise<void> {
    if (isLoading) {
      const loading = await this.loadingController.create({
        spinner: 'circles',
        message: 'App initialising...',
      });
      await loading.present();
      return;
    }
    await this.loadingController.dismiss();
  }

  goToHome() {
    this.router.navigate(['home']);
  }

}
