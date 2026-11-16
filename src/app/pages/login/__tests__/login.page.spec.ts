import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Navigation, NavigationExtras, Router, RouterModule } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { AlertController, LoadingController, MenuController, ModalController, Platform } from '@ionic/angular';
import {
  AlertControllerMock,
  LoadingControllerMock,
  MenuControllerMock,
  ModalControllerMock,
  PlatformMock,
  RouterMock,
} from '@mocks/index.mock';
import { StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AccessibilityServiceMock } from '@providers/accessibility/__mocks__/accessibility-service.mock';
import { AccessibilityService } from '@providers/accessibility/accessibility.service';
import { AnalyticsProviderMock } from '@providers/analytics/__mocks__/analytics.mock';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AppConfigProviderMock } from '@providers/app-config/__mocks__/app-config.mock';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { AppConfigError } from '@providers/app-config/app-config.constants';
import { AppInfoProviderMock } from '@providers/app-info/__mocks__/app-info.mock';
import { AppInfoProvider } from '@providers/app-info/app-info';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { AuthenticationError } from '@providers/authentication/authentication.constants';
import { DeviceProviderMock } from '@providers/device/__mocks__/device.mock';
import { DeviceProvider } from '@providers/device/device';
import { DeviceError } from '@providers/device/device.constants';
import { LoaderProviderMock } from '@providers/loader/__mocks__/loader.mock';
import { LoadingProvider } from '@providers/loader/loader';
import { LogHelperMock } from '@providers/logs/__mocks__/logs-helper.mock';
import { LogHelper } from '@providers/logs/logs-helper';
import { NetworkStateProviderMock } from '@providers/network-state/__mocks__/network-state.mock';
import { NetworkStateProvider } from '@providers/network-state/network-state';
import { Log, LogType } from '@shared/models/log.model';
import { SaveLog, SendLogs } from '@store/logs/logs.actions';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LoginPage } from '../login.page';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let authenticationProvider: AuthenticationProvider;
  let appConfigProvider: AppConfigProvider;
  let platform: Platform;
  let store$: MockStore;
  let alertController: AlertController;
  let loadingProvider: LoadingProvider;
  let menuController: MenuController;
  let logHelper: LogHelper;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([
          {
            path: '',
            component: LoginPage,
          },
        ]),
        StoreModule.forRoot({}),
        LoginPage,
      ],
      providers: [
        {
          provide: Platform,
          useClass: PlatformMock,
        },
        {
          provide: AuthenticationProvider,
          useClass: AuthenticationProviderMock,
        },
        {
          provide: Router,
          useClass: RouterMock,
        },
        {
          provide: LoadingController,
          useClass: LoadingControllerMock,
        },
        {
          provide: AlertController,
          useClass: AlertControllerMock,
        },
        {
          provide: AppConfigProvider,
          useClass: AppConfigProviderMock,
        },
        {
          provide: AppInfoProvider,
          useClass: AppInfoProviderMock,
        },
        {
          provide: MenuController,
          useClass: MenuControllerMock,
        },
        {
          provide: ModalController,
          useClass: ModalControllerMock,
        },
        {
          provide: LogHelper,
          useClass: LogHelperMock,
        },
        {
          provide: AccessibilityService,
          useClass: AccessibilityServiceMock,
        },
        {
          provide: AnalyticsProvider,
          useClass: AnalyticsProviderMock,
        },
        {
          provide: DeviceProvider,
          useClass: DeviceProviderMock,
        },
        {
          provide: NetworkStateProvider,
          useClass: NetworkStateProviderMock,
        },
        {
          provide: LoadingProvider,
          useClass: LoaderProviderMock,
        },
        provideMockStore({ ...{} }),
      ],
    });

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();

    authenticationProvider = TestBed.inject(AuthenticationProvider);
    platform = TestBed.inject(Platform);
    appConfigProvider = TestBed.inject(AppConfigProvider);
    store$ = TestBed.inject(MockStore);
    alertController = TestBed.inject(AlertController);
    loadingProvider = TestBed.inject(LoadingProvider);
    menuController = TestBed.inject(MenuController);
    logHelper = TestBed.inject(LogHelper);
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      vi.spyOn(component, 'isIos').mockReturnValue(true);
      vi.spyOn(component, 'login').mockReturnValue(Promise.resolve());
      vi.spyOn(component, 'closeSideMenuIfOpen').mockReturnValue(Promise.resolve());
    });
    it('should call login function when on ios', async () => {
      vi.useFakeTimers();
      try {
        vi.spyOn(router, 'getCurrentNavigation').mockReturnValue({
          extras: { state: { hasLoggedOut: false } } as NavigationExtras,
        } as Navigation);
        component.ngOnInit();
        await vi.advanceTimersByTimeAsync(0);
        expect(component.login).toHaveBeenCalled();
      } finally {
        vi.useRealTimers();
      }
    });
    it('should not run login on hasLoggedOut', async () => {
      vi.useFakeTimers();
      try {
        vi.spyOn(router, 'getCurrentNavigation').mockReturnValue({
          extras: { state: { hasLoggedOut: true } } as NavigationExtras,
        } as Navigation);
        component.ngOnInit();
        await vi.advanceTimersByTimeAsync(0);
        expect(component.closeSideMenuIfOpen).toHaveBeenCalled();
        expect(component.login).not.toHaveBeenCalled();
      } finally {
        vi.useRealTimers();
      }
    });
  });
  describe('closeSideMenuIfOpen', () => {
    beforeEach(() => {
      vi.spyOn(menuController, 'close').mockReturnValue(undefined);
    });
    it('should call menu close when isOpen', async () => {
      vi.spyOn(menuController, 'isOpen').mockReturnValue(Promise.resolve(true));
      await component.closeSideMenuIfOpen();
      expect(menuController.close).toHaveBeenCalled();
    });
    it('should not call menu close when isOpen returns false', async () => {
      vi.spyOn(menuController, 'isOpen').mockReturnValue(Promise.resolve(false));
      await component.closeSideMenuIfOpen();
      expect(menuController.close).not.toHaveBeenCalled();
    });
  });
  describe('login', () => {
    beforeEach(() => {
      vi.spyOn(component, 'handleLoadingUI').mockReturnValue(Promise.resolve());
      vi.spyOn(component, 'hideSplashscreen').mockReturnValue(Promise.resolve());
      vi.spyOn(appConfigProvider, 'initialiseAppConfig').mockReturnValue(Promise.resolve());
      vi.spyOn(appConfigProvider, 'loadRemoteConfig').mockReturnValue(Promise.resolve());
      vi.spyOn(authenticationProvider, 'isAuthenticated').mockResolvedValue(false);
      vi.spyOn(authenticationProvider, 'getEmployeeId').mockReturnValue('123456');
      vi.spyOn(authenticationProvider, 'login').mockReturnValue(Promise.resolve());
      vi.spyOn(authenticationProvider, 'logout').mockReturnValue(Promise.resolve());
      vi.spyOn(authenticationProvider, 'refreshEmployeeDetails').mockReturnValue(Promise.resolve());
      vi.spyOn(store$, 'dispatch').mockReturnValue(undefined);
      vi.spyOn(component, 'appInitializedLog').mockReturnValue(undefined);
      vi.spyOn(component, 'dispatchLog').mockReturnValue(undefined);
    });
    describe('Successful login flow', () => {
      it('should run the login flow code', async () => {
        vi.useFakeTimers();
        try {
          vi.spyOn(platform, 'ready').mockReturnValue(Promise.resolve(''));
          component.login();
          await vi.advanceTimersByTimeAsync(0);
          expect(appConfigProvider.initialiseAppConfig).toHaveBeenCalled();
          expect(component.appInitializedLog).toHaveBeenCalled();
          expect(authenticationProvider.isAuthenticated).toHaveBeenCalled();
          expect(appConfigProvider.loadRemoteConfig).toHaveBeenCalled();
          expect(component.handleLoadingUI).toHaveBeenCalled();
        } finally {
          vi.useRealTimers();
        }
      });
    });
    describe('Unsuccessful login flow', () => {
      it('should log an exception and dispatch log when when rejection due to UNABLE_TO_LOGOUT', async () => {
        vi.useFakeTimers();
        try {
          vi.spyOn(platform, 'ready').mockReturnValue(Promise.reject(AuthenticationError.UNABLE_TO_LOGOUT));
          component.login();
          await vi.advanceTimersByTimeAsync(0);
          expect(component.dispatchLog).toHaveBeenCalledWith(`"${AuthenticationError.UNABLE_TO_LOGOUT}"`);
          expect(component.hasUserLoggedOut).toEqual(false);
        } finally {
          vi.useRealTimers();
        }
      });
      it('should dispatch log when error is USER_NOT_AUTHORISED and a token is present', async () => {
        vi.useFakeTimers();
        try {
          vi.spyOn(authenticationProvider, 'getAuthenticationToken').mockReturnValue(Promise.resolve('token'));
          vi.spyOn(platform, 'ready').mockReturnValue(Promise.reject(AuthenticationError.USER_NOT_AUTHORISED));
          component.login();
          await vi.advanceTimersByTimeAsync(0);
          expect(authenticationProvider.getAuthenticationToken).toHaveBeenCalled();
          expect(authenticationProvider.getEmployeeId).toHaveBeenCalled();
          expect(component.dispatchLog).toHaveBeenCalledWith('user 123456 not authorised: TOKEN token');
          expect(component.appInitError).toEqual(AuthenticationError.USER_NOT_AUTHORISED);
          expect(component.hasUserLoggedOut).toEqual(false);
        } finally {
          vi.useRealTimers();
        }
      });
      it('should dispatch log when error is USER_NOT_AUTHORISED and no token is present', async () => {
        vi.useFakeTimers();
        try {
          vi.spyOn(authenticationProvider, 'getAuthenticationToken').mockReturnValue(Promise.resolve(null));
          vi.spyOn(platform, 'ready').mockReturnValue(Promise.reject(AuthenticationError.USER_NOT_AUTHORISED));
          component.login();
          await vi.advanceTimersByTimeAsync(0);
          expect(authenticationProvider.getAuthenticationToken).toHaveBeenCalled();
          expect(authenticationProvider.getEmployeeId).toHaveBeenCalled();
          expect(component.dispatchLog).toHaveBeenCalledWith('user 123456 not authorised: Could not get token');
          expect(component.appInitError).toEqual(AuthenticationError.USER_NOT_AUTHORISED);
          expect(component.hasUserLoggedOut).toEqual(false);
        } finally {
          vi.useRealTimers();
        }
      });
    });
  });
  describe('dispatchLog', () => {
    it('should dispatch two actions SaveLog/SendLogs with custom param', () => {
      vi.spyOn(store$, 'dispatch').mockReturnValue(undefined);
      vi.spyOn(logHelper, 'createLog').mockReturnValue({} as Log);
      component.dispatchLog('msg');
      expect(store$.dispatch).toHaveBeenCalledWith(SaveLog({ payload: {} as Log }));
      expect(store$.dispatch).toHaveBeenCalledWith(SendLogs());
      expect(logHelper.createLog).toHaveBeenCalledWith(LogType.ERROR, 'LoginPage => User login', 'msg');
    });
  });
  describe('appInitializedLog', () => {
    it('should dispatch a SaveLog action indicating app has initialised', () => {
      vi.spyOn(store$, 'dispatch').mockReturnValue(undefined);
      vi.spyOn(logHelper, 'createLog').mockReturnValue({} as Log);
      component.appInitializedLog();
      expect(store$.dispatch).toHaveBeenCalledWith(SaveLog({ payload: {} as Log }));
      expect(logHelper.createLog).toHaveBeenCalledWith(
        LogType.INFO,
        'App has MDM provided config and is ready to proceed with authentication',
        'App has initialised'
      );
    });
  });

  describe('isUserNotAuthorised', () => {
    it('should return false when error is not USER_NOT_AUTHORISED', () => {
      component.hasUserLoggedOut = false;
      component.appInitError = AuthenticationError.WRONG_AUTHORITY_TYPE;
      expect(component.isUserNotAuthorised()).toEqual(false);
    });

    it('should return true when error is USER_NOT_AUTHORISED', () => {
      component.hasUserLoggedOut = false;
      component.appInitError = AuthenticationError.USER_NOT_AUTHORISED;
      expect(component.isUserNotAuthorised()).toEqual(true);
    });
  });

  describe('isFailedToStartError', () => {
    it('should return false when error is not a startup error', () => {
      component.hasUserLoggedOut = false;
      component.appInitError = AuthenticationError.WRONG_AUTHORITY_TYPE;
      expect(component.isFailedToStartError()).toEqual(false);
    });

    it('should return true when error is CREATE_BRIDGE_CONTROLLER', () => {
      component.hasUserLoggedOut = false;
      component.appInitError = AuthenticationError.CREATE_BRIDGE_CONTROLLER;
      expect(component.isFailedToStartError()).toEqual(true);
    });

    it('should return true when error is CREATE_CONTEXT', () => {
      component.hasUserLoggedOut = false;
      component.appInitError = AuthenticationError.CREATE_CONTEXT;
      expect(component.isFailedToStartError()).toEqual(true);
    });
  });

  describe('isAlreadyLoggedOut', () => {
    it('should return false when error is not NOTHING_TO_SIGN_OUT_FROM', () => {
      component.hasUserLoggedOut = false;
      component.appInitError = AuthenticationError.WRONG_AUTHORITY_TYPE;
      expect(component.isAlreadyLoggedOut()).toEqual(false);
    });

    it('should return true when error is NOTHING_TO_SIGN_OUT_FROM', () => {
      component.hasUserLoggedOut = false;
      component.appInitError = AuthenticationError.NOTHING_TO_SIGN_OUT_FROM;
      expect(component.isAlreadyLoggedOut()).toEqual(true);
    });
  });

  describe('isUnableToLogout', () => {
    it('should return false when error is not UNABLE_TO_LOGOUT', () => {
      component.hasUserLoggedOut = false;
      component.appInitError = AuthenticationError.WRONG_AUTHORITY_TYPE;
      expect(component.isUnableToLogout()).toEqual(false);
    });

    it('should return true when error is UNABLE_TO_LOGOUT', () => {
      component.hasUserLoggedOut = false;
      component.appInitError = AuthenticationError.UNABLE_TO_LOGOUT;
      expect(component.isUnableToLogout()).toEqual(true);
    });
  });

  describe('hasDeviceTypeError', () => {
    it('should return false when error is not UNSUPPORTED_DEVICE', () => {
      component.hasUserLoggedOut = false;
      component.appInitError = AuthenticationError.WRONG_AUTHORITY_TYPE;
      expect(component.hasDeviceTypeError()).toEqual(false);
    });

    it('should return true when error is UNSUPPORTED_DEVICE', () => {
      component.hasUserLoggedOut = false;
      component.appInitError = DeviceError.UNSUPPORTED_DEVICE;
      expect(component.hasDeviceTypeError()).toEqual(true);
    });
  });

  describe('isUnableToObtainTokenError', () => {
    it('should return false when error is not OBTAIN_ACCESS', () => {
      component.hasUserLoggedOut = false;
      component.appInitError = AuthenticationError.WRONG_AUTHORITY_TYPE;
      expect(component.isUnableToObtainTokenError()).toEqual(false);
    });

    it('should return true when error is OBTAIN_ACCESS', () => {
      component.hasUserLoggedOut = false;
      component.appInitError = AuthenticationError.OBTAIN_ACCESS;
      expect(component.isUnableToObtainTokenError()).toEqual(true);
    });
  });

  describe('isInvalidAppVersionError', () => {
    it('should return false when error is not INVALID_APP_VERSION', () => {
      component.hasUserLoggedOut = false;
      component.appInitError = AuthenticationError.WRONG_AUTHORITY_TYPE;
      expect(component.isInvalidAppVersionError()).toEqual(false);
    });

    it('should return true when error is INVALID_APP_VERSION', () => {
      component.hasUserLoggedOut = false;
      component.appInitError = AppConfigError.INVALID_APP_VERSION;
      expect(component.isInvalidAppVersionError()).toEqual(true);
    });
  });

  describe('isSetupError', () => {
    it('should return false when error is not a setup error', () => {
      component.hasUserLoggedOut = false;
      component.appInitError = AuthenticationError.CREATE_CONTEXT;
      expect(component.isSetupError()).toEqual(false);
    });

    it('should return true when error is INVALID_CLIENT_ID', () => {
      component.hasUserLoggedOut = false;
      component.appInitError = AuthenticationError.INVALID_CLIENT_ID;
      expect(component.isSetupError()).toEqual(true);
    });

    it('should return true when error is WRONG_AUTHORITY_TYPE', () => {
      component.hasUserLoggedOut = false;
      component.appInitError = AuthenticationError.WRONG_AUTHORITY_TYPE;
      expect(component.isSetupError()).toEqual(true);
    });
  });

  describe('isInternetConnectionError', () => {
    it('should return false when error is not OFFLINE', () => {
      component.hasUserLoggedOut = false;
      component.appInitError = AuthenticationError.WRONG_AUTHORITY_TYPE;
      expect(component.isInternetConnectionError()).toEqual(false);
    });

    it('should return true when error is OFFLINE', () => {
      component.hasUserLoggedOut = false;
      component.appInitError = AuthenticationError.OFFLINE;
      expect(component.isInternetConnectionError()).toEqual(true);
    });
  });

  describe('isUnknownError', () => {
    it('should return true when appInitError is not one of specified', () => {
      component.hasUserLoggedOut = false;
      component.appInitError = 'A';
      expect(component.isUnknownError()).toEqual(true);
    });
    it('should return false when use has logged out', () => {
      component.hasUserLoggedOut = true;
      expect(component.isUnknownError()).toEqual(false);
    });
    it('should return false when appInitError is one of specified', () => {
      component.hasUserLoggedOut = false;
      component.appInitError = AuthenticationError.UNABLE_TO_LOGOUT;
      expect(component.isUnknownError()).toEqual(false);
    });
  });
  describe('showErrorDetails', () => {
    it('should create the alert controller with params', async () => {
      vi.useFakeTimers();
      try {
        vi.spyOn(alertController, 'create');
        component.appInitError = AppConfigError.MDM_ERROR;
        component.showErrorDetails();
        await vi.advanceTimersByTimeAsync(0);
        expect(alertController.create).toHaveBeenCalledWith({
          header: 'Error details',
          message: '"error getting mobile device management config"',
          buttons: ['OK'],
        });
      } finally {
        vi.useRealTimers();
      }
    });
  });
  describe('handleLoadingUI', () => {
    beforeEach(() => {
      vi.spyOn(loadingProvider, 'handleUILoading').mockReturnValue(undefined);
    });
    it('should call through to provider with loading status of true', async () => {
      vi.useFakeTimers();
      try {
        component.handleLoadingUI(true);
        await vi.advanceTimersByTimeAsync(0);
        expect(loadingProvider.handleUILoading).toHaveBeenCalledWith(true, component.loadingOptions);
      } finally {
        vi.useRealTimers();
      }
    });
    it('should call through to provider with loading status of false', async () => {
      vi.useFakeTimers();
      try {
        component.handleLoadingUI(false);
        await vi.advanceTimersByTimeAsync(0);
        expect(loadingProvider.handleUILoading).toHaveBeenCalledWith(false, component.loadingOptions);
      } finally {
        vi.useRealTimers();
      }
    });
  });
  describe('hideSplashscreen', () => {
    it('should hide splashscreen if plugin is available', async () => {
      vi.spyOn(SplashScreen, 'hide').mockReturnValue(undefined);
      vi.spyOn(Capacitor, 'isPluginAvailable').mockReturnValue(true);
      await component.hideSplashscreen();
      expect(SplashScreen.hide).toHaveBeenCalled();
    });
  });
});
