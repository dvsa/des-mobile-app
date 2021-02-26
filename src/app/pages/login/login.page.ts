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
import { LoadConfigSuccess, LoadEmployeeId, LoadEmployeeName } from '../../../store/app-info/app-info.actions';
import { StoreModel } from '../../shared/models/store.model';
import {
  SaveLog, StartSendingLogs, SendLogs, LoadLog,
} from '../../../store/logs/logs.actions';
import { DASHBOARD_PAGE } from '../page-names.constants';
import { LogoutBasePageComponent } from '../../shared/classes/logout-base-page';
import { LogType } from '../../shared/models/log.model';
import { LogHelper } from '../../providers/logs/logs-helper';
import { AnalyticsProvider } from '../../providers/analytics/analytics';
import { LoadAppConfig } from '../../../store/app-config/app-config.actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage extends LogoutBasePageComponent implements OnInit {

  appInitError: AuthenticationError | AppConfigError;
  hasUserLoggedOut = false;
  hasDeviceTypeError = false;

  constructor(
    platform: Platform,
    authenticationProvider: AuthenticationProvider,
    router: Router,
    private store$: Store<StoreModel>,
    private loadingController: LoadingController,
    protected alertController: AlertController,
    private appConfigProvider: AppConfigProvider,
    private secureStorage: SecureStorage,
    private dataStore: DataStoreProvider,
    private networkStateProvider: NetworkStateProvider,
    private route: ActivatedRoute,
    private menuController: MenuController,
    private logHelper: LogHelper,
    private analytics: AnalyticsProvider,
  ) {
    super(platform, authenticationProvider, alertController, router);
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
      this.store$.dispatch(LoadAppConfig({ appConfig: this.appConfigProvider.getAppConfig() }));
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

      this.appInitializedLog();

      this.store$.dispatch(LoadEmployeeId({ employeeId: this.authenticationProvider.getEmployeeId() }));

      this.store$.dispatch(LoadLog());

      await this.appConfigProvider.loadRemoteConfig();

      this.store$.dispatch(LoadConfigSuccess());

      this.store$.dispatch(LoadEmployeeName());

      this.store$.dispatch(LoadAppConfig({ appConfig: this.appConfigProvider.getAppConfig() }));

      await this.analytics.initialiseAnalytics();

      await this.handleLoadingUI(false);

      await this.validateDeviceType();
    } catch (error) {

      await this.handleLoadingUI(false);

      if (error === AuthenticationError.USER_CANCELLED) {
        this.analytics.logException(error, true);
        this.dispatchLog('user cancelled login');
      }

      if (error === AuthenticationError.USER_NOT_AUTHORISED) {
        const token = await this.authenticationProvider.getAuthenticationToken();
        const examiner = this.authenticationProvider.getEmployeeId() || 'unavailable';
        if (token) {
          this.dispatchLog(`user ${examiner} not authorised: TOKEN ${token}`);
        } else {
          this.dispatchLog(`user ${examiner} not authorised: Could not get token`);
        }
        await this.authenticationProvider.logout();
      }
      this.appInitError = error;
      console.log(error);
    }
    this.hasUserLoggedOut = false;
  };

  initialiseAuthentication = (): void => {
    this.authenticationProvider.initialiseAuthentication();
    this.authenticationProvider.determineAuthenticationMode();
  };

  dispatchLog = (message: string): void => {
    this.store$.dispatch(SaveLog({
      payload: this.logHelper.createLog(LogType.ERROR, 'User login', message),
    }));
    this.store$.dispatch(SendLogs());
  };

  appInitializedLog = (): void => {
    this.store$.dispatch(SaveLog({
      payload: this.logHelper.createLog(
        LogType.INFO,
        'App has MDM provided config and is ready to proceed with authentication',
        'App has initialised',
      ),
    }));
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

}
