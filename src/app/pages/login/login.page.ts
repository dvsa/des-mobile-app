import { Component, Injector, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { AuthenticationError } from '@providers/authentication/authentication.constants';
import { AppConfigError } from '@providers/app-config/app-config.constants';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { DeviceError } from '@providers/device/device.constants';
import { LogoutBasePageComponent } from '@shared/classes/logout-base-page';
import { LogType } from '@shared/models/log.model';
import { LoadConfigSuccess, LoadEmployeeId, LoadEmployeeName } from '@store/app-info/app-info.actions';
import { LoadLog, SaveLog, SendLogs, StartSendingLogs } from '@store/logs/logs.actions';
import { LoadAppConfig } from '@store/app-config/app-config.actions';
import { LoadPersistedTests, StartSendingCompletedTests } from '@store/tests/tests.actions';
import { Capacitor } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { Subscription } from 'rxjs';
import { NetworkStateProvider } from '@providers/network-state/network-state';
import { GetTestCentresRefData } from '@store/reference-data/reference-data.actions';
import { DASHBOARD_PAGE } from '../page-names.constants';
import { LoadingProvider } from '@providers/loader/loader';
import { LoadingOptions } from '@ionic/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage extends LogoutBasePageComponent implements OnInit {

  appInitError: AuthenticationError | AppConfigError | unknown;
  hasUserLoggedOut = false;
  hasDeviceTypeError = false;
  deviceTypeError: DeviceError;
  queryParamSub: Subscription;

  get loadingOptions(): LoadingOptions {
    return {
      id: 'app_init_spinner',
      spinner: 'circles',
      message: 'App initialising...',
    };
  }

  constructor(
    private loadingProvider: LoadingProvider,
    private appConfigProvider: AppConfigProvider,
    private menuController: MenuController,
    private analytics: AnalyticsProvider,
    public networkStateProvider: NetworkStateProvider,
    injector: Injector,
  ) {
    super(injector);
  }

  async ngOnInit() {
    const navState = this.router.getCurrentNavigation()?.extras.state;

    if (!!navState) {
      this.hasUserLoggedOut = !!(navState?.hasLoggedOut);

      if (!!(navState?.invalidToken)) {
        this.dispatchLog('Nav state => Invalid token');
      }

      if (this.hasUserLoggedOut) {
        await this.closeSideMenuIfOpen();
      }
    }

    this.networkStateProvider.initialiseNetworkState();

    // Trigger Authentication if ios device
    if (!this.hasUserLoggedOut && this.isIos()) {
      await this.login();
    }

    if (!this.isIos()) {
      await this.appConfigProvider.initialiseAppConfig();
      this.store$.dispatch(LoadConfigSuccess());
      this.store$.dispatch(LoadAppConfig({ appConfig: this.appConfigProvider.getAppConfig() }));
      this.store$.dispatch(GetTestCentresRefData());
      await this.router.navigate([DASHBOARD_PAGE], { replaceUrl: true });
    }
  }

  async ionViewDidEnter(): Promise<void> {
    if (this.isIos()) {
      await this.deviceProvider.disableSingleAppMode();
    }
  }

  ionViewDidLeave(): void {
    this.queryParamSub?.unsubscribe();
  }

  login = async (): Promise<any> => {
    try {
      await this.handleLoadingUI(true);

      await this.platform.ready();

      await this.appConfigProvider.initialiseAppConfig();

      this.store$.dispatch(StartSendingLogs());

      this.appInitializedLog();

      this.initialiseAuthentication();

      await this.authenticationProvider.expireTokens();

      const isAuthenticated = await this.authenticationProvider.isAuthenticated();

      await this.hideSplashscreen();

      if (!isAuthenticated) {
        await this.authenticationProvider.login();
      }

      await this.authenticationProvider.setEmployeeId();

      this.store$.dispatch(LoadEmployeeId({ employeeId: this.authenticationProvider.getEmployeeId() }));

      this.store$.dispatch(LoadLog());

      await this.appConfigProvider.loadRemoteConfig();

      this.store$.dispatch(LoadConfigSuccess());

      this.store$.dispatch(LoadPersistedTests());

      this.store$.dispatch(LoadEmployeeName());

      this.store$.dispatch(LoadAppConfig({ appConfig: this.appConfigProvider.getAppConfig() }));

      await this.analytics.initialiseAnalytics();
      await this.analytics.initialiseGoogleAnalytics();

      this.store$.dispatch(StartSendingCompletedTests());

      this.store$.dispatch(GetTestCentresRefData());

      await this.handleLoadingUI(false);

      await this.validateDeviceType();
    } catch (error) {
      await this.hideSplashscreen();

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

      const {
        display,
        record,
      } = this.rationaliseError(error);

      this.appInitError = display;

      this.dispatchLog(record);
    }
    this.hasUserLoggedOut = false;
  };

  private rationaliseError = (error: unknown) => {
    if (error instanceof Error) {
      return {
        // message to display to EU
        display: error.message,
        // details to record in logs
        record: JSON.stringify(error, Object.getOwnPropertyNames(error)),
      };
    }
    return {
      display: error,
      record: JSON.stringify(error),
    };
  };

  hideSplashscreen = async (): Promise<void> => {
    if (Capacitor.isPluginAvailable('SplashScreen')) {
      await SplashScreen.hide();
    }
  };

  initialiseAuthentication = (): void => {
    this.authenticationProvider.initialiseAuthentication();
    this.authenticationProvider.determineAuthenticationMode();
  };

  dispatchLog = (message: string): void => {
    this.store$.dispatch(SaveLog({
      payload: this.logHelper.createLog(LogType.ERROR, 'LoginPage => User login', message),
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
    const validDevice = await this.deviceProvider.validDeviceType();
    if (!validDevice) {
      this.deviceTypeError = DeviceError.UNSUPPORTED_DEVICE;
      this.hasDeviceTypeError = true;
      const deviceType = await this.deviceProvider.getDeviceType();
      this.analytics.logException(`${this.deviceTypeError}-${deviceType}`, true);
    } else {
      await this.router.navigate([DASHBOARD_PAGE], { replaceUrl: true });
    }
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
    await this.loadingProvider.handleUILoading(isLoading, this.loadingOptions);
  }

}
