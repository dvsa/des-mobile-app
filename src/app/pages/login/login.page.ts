import { Component, Injector, OnInit } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { AlertController, MenuController } from '@ionic/angular';
import { LoadingOptions } from '@ionic/core';
import { ReportError } from '@pages/login/login-page.actions';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { AppConfigError } from '@providers/app-config/app-config.constants';
import { AuthenticationError } from '@providers/authentication/authentication.constants';
import { DeviceError } from '@providers/device/device.constants';
import { LoadingProvider } from '@providers/loader/loader';
import { NetworkStateProvider } from '@providers/network-state/network-state';
import { LogoutBasePageComponent } from '@shared/classes/logout-base-page/logout-base-page';
import { LogType } from '@shared/models/log.model';
import { LoadAppConfig } from '@store/app-config/app-config.actions';
import { LoadConfigSuccess } from '@store/app-info/app-info.actions';
import { LoadLog, SaveLog, SendLogs, StartSendingLogs } from '@store/logs/logs.actions';
import { GetTestCentresRefData } from '@store/reference-data/reference-data.actions';
import { LoadPersistedTests, StartSendingCompletedTests } from '@store/tests/tests.actions';
import { BehaviorSubject, Subscription } from 'rxjs';
import { DASHBOARD_PAGE } from '../page-names.constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage extends LogoutBasePageComponent implements OnInit {
  appInitError: AuthenticationError | AppConfigError | unknown;
  hasUserLoggedOut = false;
  deviceTypeError: DeviceError;
  queryParamSub: Subscription;
  isLoggedIn = false;
  isLoggingIn = false;

  isOffline$: BehaviorSubject<boolean> = this.networkStateProvider.isOffline$;
  wasOffline = false;

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
    public alertController: AlertController,
    injector: Injector
  ) {
    super(injector);
  }

  /**
   * Monitor the online status of the app and if it comes back online after being offline, automatically attempt to log in
   */
  monitorOnlineStatus() {
    this.isOffline$.subscribe(async (isOffline) => {
      if (isOffline !== this.wasOffline) {
        this.wasOffline = isOffline;
        if (!isOffline && this.isIos() && !this.isLoggedIn) {
          await this.login();
        } else if (isOffline) {
          this.appInitError = AuthenticationError.OFFLINE;
        }
      }
    });
  }

  async ngOnInit() {
    const navState = this.router.getCurrentNavigation()?.extras.state;

    if (navState) {
      this.hasUserLoggedOut = !!navState?.hasLoggedOut;

      if (navState?.invalidToken) {
        this.dispatchLog('Nav state => Invalid token');
      }

      if (this.hasUserLoggedOut) {
        await this.closeSideMenuIfOpen();
      }
    }

    this.networkStateProvider.initialiseNetworkState();

    // Trigger Authentication if ios device
    if (this.isIos()) {
      if (!this.hasUserLoggedOut) {
        await this.login();
      }
      this.monitorOnlineStatus();
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

  login = async (): Promise<void> => {
    try {
      this.isLoggingIn = true;

      await this.platform.ready();

      await this.appConfigProvider.initialiseAppConfig();

      this.store$.dispatch(StartSendingLogs());

      this.appInitializedLog();

      const isAuthenticated = await this.authenticationProvider.isAuthenticated();

      await this.hideSplashscreen();

      if (!isAuthenticated) {
        await this.authenticationProvider.login();
      }

      await this.handleLoadingUI(true);

      this.store$.dispatch(LoadLog());

      await this.appConfigProvider.loadRemoteConfig();

      this.store$.dispatch(LoadConfigSuccess());

      // We need to refresh the employee details now that the remote config has loaded.
      await this.authenticationProvider.refreshEmployeeDetails();

      this.store$.dispatch(LoadPersistedTests());

      this.store$.dispatch(LoadAppConfig({ appConfig: this.appConfigProvider.getAppConfig() }));

      await this.analytics.initialiseGoogleAnalytics();

      this.store$.dispatch(StartSendingCompletedTests());

      this.store$.dispatch(GetTestCentresRefData());

      await this.handleLoadingUI(false);

      const isValidDevice = await this.validateDeviceType();
      if (isValidDevice) {
        await this.router.navigate([DASHBOARD_PAGE], { replaceUrl: true });
      }
      this.isLoggingIn = false;
      this.isLoggedIn = !!(await this.authenticationProvider.getAuthResult());
      this.hasUserLoggedOut = false;
    } catch (error) {
      this.isLoggingIn = false;
      this.isLoggedIn = !!(await this.authenticationProvider.getAuthResult());
      this.hasUserLoggedOut = false;

      const { display, record } = this.rationaliseError(error);

      this.appInitError = display;

      await this.hideSplashscreen();
      this.dispatchLog(record);

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

      //Check if the user is offline as this can cause a number of errors and won't be picked up by the error handling
      //as the login step has been skipped if the user is offline
      if (this.authenticationProvider.isOffline()) {
        this.appInitError = AuthenticationError.OFFLINE;
      }

      this.store$.dispatch(ReportError(this.appInitError.valueOf()));

      await this.handleLoadingUI(false);
    }
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

  dispatchLog = (message: string): void => {
    this.store$.dispatch(
      SaveLog({
        payload: this.logHelper.createLog(LogType.ERROR, 'LoginPage => User login', message),
      })
    );
    this.store$.dispatch(SendLogs());
  };

  appInitializedLog = (): void => {
    this.store$.dispatch(
      SaveLog({
        payload: this.logHelper.createLog(
          LogType.INFO,
          'App has MDM provided config and is ready to proceed with authentication',
          'App has initialised'
        ),
      })
    );
  };

  closeSideMenuIfOpen = async (): Promise<void> => {
    if (await this.menuController.isOpen()) {
      await this.menuController.close();
    }
  };

  isUserNotAuthorised = (): boolean => {
    return !this.hasUserLoggedOut && this.appInitError.valueOf() === AuthenticationError.USER_NOT_AUTHORISED;
  };

  isFailedToStartError = (): boolean => {
    return (
      !this.hasUserLoggedOut &&
      (this.appInitError.valueOf() === AuthenticationError.CREATE_BRIDGE_CONTROLLER ||
        this.appInitError.valueOf() === AuthenticationError.CREATE_CONTEXT)
    );
  };

  isAlreadyLoggedOut = (): boolean => {
    return !this.hasUserLoggedOut && this.appInitError.valueOf() === AuthenticationError.NOTHING_TO_SIGN_OUT_FROM;
  };

  hasDeviceTypeError = (): boolean => {
    return !this.hasUserLoggedOut && this.appInitError.valueOf() === DeviceError.UNSUPPORTED_DEVICE;
  };

  isUnableToLogout = (): boolean => {
    return !this.hasUserLoggedOut && this.appInitError.valueOf() === AuthenticationError.UNABLE_TO_LOGOUT;
  };

  isUnableToObtainTokenError = (): boolean => {
    return !this.hasUserLoggedOut && this.appInitError.valueOf() === AuthenticationError.OBTAIN_ACCESS;
  };

  isInvalidAppVersionError = (): boolean => {
    return !this.hasUserLoggedOut && this.appInitError.valueOf() === AppConfigError.INVALID_APP_VERSION;
  };

  isSetupError = (): boolean => {
    return (
      !this.hasUserLoggedOut &&
      (this.appInitError.valueOf() === AuthenticationError.INVALID_CLIENT_ID ||
        this.appInitError.valueOf() === AuthenticationError.WRONG_AUTHORITY_TYPE)
    );
  };

  isInternetConnectionError = (): boolean => {
    return !this.hasUserLoggedOut && this.appInitError.valueOf() === AuthenticationError.OFFLINE;
  };

  isUnknownError = (): boolean => {
    return (
      !this.hasUserLoggedOut &&
      this.appInitError &&
      !this.isUserNotAuthorised() &&
      !this.isInvalidAppVersionError() &&
      !this.isFailedToStartError() &&
      !this.isAlreadyLoggedOut() &&
      !this.isUnableToLogout() &&
      !this.isUnableToObtainTokenError() &&
      !this.isSetupError() &&
      !this.isInternetConnectionError() &&
      !this.hasDeviceTypeError()
    );
  };

  /**
   * Check app is running on a supported device and navigate to app starting page
   */
  validateDeviceType = async (): Promise<boolean> => {
    const validDevice = await this.deviceProvider.validDeviceType();
    if (!validDevice) {
      throw Error(DeviceError.UNSUPPORTED_DEVICE);
    }
    return validDevice;
  };

  async showErrorDetails() {
    const alert = await this.alertController.create({
      header: 'Error details',
      message: JSON.stringify(this.appInitError),
      buttons: ['OK'],
    });
    await alert.present();
  }

  async logout(): Promise<void> {
    await super.logout();
    this.hasUserLoggedOut = true;
    this.isLoggedIn = !!(await this.authenticationProvider.getAuthResult());
    await this.ngOnInit();
  }

  async handleLoadingUI(isLoading: boolean): Promise<void> {
    await this.loadingProvider.handleUILoading(isLoading, this.loadingOptions);
  }
}
