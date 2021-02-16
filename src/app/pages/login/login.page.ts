import { Component, OnInit } from '@angular/core';
import {
  AlertController, LoadingController, MenuController, Platform,
} from '@ionic/angular';
import { SecureStorage } from '@ionic-native/secure-storage/ngx';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { AppConfigProvider } from '../../providers/app-config/app-config';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { DataStoreProvider } from '../../providers/data-store/data-store';
import { NetworkStateProvider } from '../../providers/network-state/network-state';
import { AuthenticationError } from '../../providers/authentication/authentication.constants';
import { AppConfigError } from '../../providers/app-config/app-config.constants';
import { BasePageComponent } from '../../shared/classes/base-page';
import { LoadConfigSuccess, LoadEmployeeName } from '../../../store/app-info/app-info.actions';
import { StoreModel } from '../../shared/models/store.model';
import { StartSendingLogs } from '../../../store/logs/logs.actions';
import { DASHBOARD_PAGE } from '../page-names.constants';

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
    platform: Platform,
    authenticationProvider: AuthenticationProvider,
    router: Router,
    private store$: Store<StoreModel>,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private appConfigProvider: AppConfigProvider,
    private secureStorage: SecureStorage,
    private dataStore: DataStoreProvider,
    private networkStateProvider: NetworkStateProvider,
    private route: ActivatedRoute,
    private menuController: MenuController,
  ) {
    super(platform, authenticationProvider, router);
  }

  async ngOnInit() {
    this.route.queryParams.subscribe(async () => {
      if (this.router.getCurrentNavigation()?.extras.state) {
        this.hasUserLoggedOut = this.router.getCurrentNavigation().extras.state.hasLoggedOut;

        if (this.hasUserLoggedOut) {
          await this.closeSideMenuIfOpen();
        }
      }
    });

    this.networkStateProvider.initialiseNetworkState();

    // Trigger Authentication if ios device
    if (!this.hasUserLoggedOut && this.isIos()) {
      await this.login();
    }

    if (!this.isIos()) {
      await this.appConfigProvider.initialiseAppConfig();
      await this.router.navigate([DASHBOARD_PAGE]);
      // @TODO: Add hide function when splash screen is implemented
      // this.splashScreen.hide();
    }
  }

  closeSideMenuIfOpen = async (): Promise<void> => {
    if (await this.menuController.isOpen()) {
      await this.menuController.close();
    }
  };

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
      await this.appConfigProvider.initialiseAppConfig();

      this.store$.dispatch(StartSendingLogs());

      this.initialiseAuthentication();

      await this.initialisePersistentStorage();

      await this.authenticationProvider.expireTokens();

      const isAuthenticated = await this.authenticationProvider.isAuthenticated();

      if (!isAuthenticated) {
        await this.authenticationProvider.login();
      }

      await this.authenticationProvider.setEmployeeId();

      this.store$.dispatch(LoadEmployeeName());

      await this.appConfigProvider.loadRemoteConfig();
      this.store$.dispatch(LoadConfigSuccess());

      await this.handleLoadingUI(false);
      await this.validateDeviceType();
    } catch (error) {

      await this.handleLoadingUI(false);

      if (error === AuthenticationError.USER_NOT_AUTHORISED) {
        await this.authenticationProvider.logout();
      }
      this.appInitError = error;

      // TODO: Send error through the logging service
    }
  };

  initialiseAuthentication = (): void => {
    this.authenticationProvider.initialiseAuthentication();
    this.authenticationProvider.determineAuthenticationMode();
  };

  async initialisePersistentStorage(): Promise<void> {
    if (this.isIos()) {
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
  validateDeviceType = async (): Promise<void> => {
    // @TODO: Update old implementation
    // const validDevice = this.deviceProvider.validDeviceType();
    // if (!validDevice) {
    //   this.deviceTypeError = DeviceError.UNSUPPORTED_DEVICE;
    //   this.hasDeviceTypeError = true;
    //   this.analytics.logException(`${this.deviceTypeError}-${this.deviceProvider.getDeviceType()}`, true);
    // } else {
    //   this.navController.setRoot(DASHBOARD_PAGE);
    // }
    await this.router.navigate([DASHBOARD_PAGE]);
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

  async goToDashboard() {
    await this.router.navigate([DASHBOARD_PAGE]);
  }

}
