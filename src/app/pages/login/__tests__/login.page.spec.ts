import {
  ComponentFixture, fakeAsync, flushMicrotasks, TestBed, waitForAsync,
} from '@angular/core/testing';
import {
  AlertController, IonicModule, LoadingController, MenuController, Platform,
} from '@ionic/angular';
import { configureTestSuite } from 'ng-bullet';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { StoreModule } from '@ngrx/store';
import { SplashScreen } from '@capacitor/splash-screen';
import { Capacitor } from '@capacitor/core';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { AppConfigProviderMock } from '@providers/app-config/__mocks__/app-config.mock';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { AuthenticationError } from '@providers/authentication/authentication.constants';
import { AppConfigError } from '@providers/app-config/app-config.constants';
import { LogHelper } from '@providers/logs/logs-helper';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { LogHelperMock } from '@providers/logs/__mocks__/logs-helper.mock';
import { AnalyticsProviderMock } from '@providers/analytics/__mocks__/analytics.mock';
import { DeviceProvider } from '@providers/device/device';
import { DeviceProviderMock } from '@providers/device/__mocks__/device.mock';
import { Log, LogType } from '@shared/models/log.model';
import { SaveLog, SendLogs } from '@store/logs/logs.actions';
import { MenuControllerMock } from '@mocks/ionic-mocks/menu-controller';
import { AlertControllerMock } from '@mocks/ionic-mocks/alert-controller.mock';
import { LoadingControllerMock } from '@mocks/ionic-mocks/loading-controller.mock';
import { PlatformMock } from '@mocks/ionic-mocks/platform-mock';
import { DASHBOARD_PAGE } from '../../page-names.constants';
import { LoginPage } from '../login.page';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl', 'navigate', 'getCurrentNavigation']);
  // eslint-disable-next-line rxjs/finnish
  const mockActivateRoute = { queryParams: of({}) } as ActivatedRoute;
  let authenticationProvider: AuthenticationProvider;
  let appConfigProvider: AppConfigProvider;
  let platform: Platform;
  let store$: MockStore;
  let alertController: AlertController;
  let loadingController: LoadingController;
  let menuController: MenuController;
  let logHelper: LogHelper;
  let analytics: AnalyticsProvider;

  configureTestSuite(() => {
    jasmine.getEnv().allowRespy(true);
    TestBed.configureTestingModule({
      declarations: [LoginPage],
      imports: [
        RouterTestingModule.withRoutes(
          [
            { path: '', component: LoginPage },
          ],
        ),
        IonicModule.forRoot(),
        StoreModule.forRoot({}),
      ],
      providers: [
        { provide: Platform, useClass: PlatformMock },
        { provide: AuthenticationProvider, useClass: AuthenticationProviderMock },
        { provide: Router, useValue: routerSpy },
        { provide: LoadingController, useClass: LoadingControllerMock },
        { provide: AlertController, useClass: AlertControllerMock },
        { provide: AppConfigProvider, useClass: AppConfigProviderMock },
        { provide: ActivatedRoute, useValue: mockActivateRoute },
        { provide: MenuController, useClass: MenuControllerMock },
        { provide: LogHelper, useClass: LogHelperMock },
        { provide: AnalyticsProvider, useClass: AnalyticsProviderMock },
        { provide: DeviceProvider, useClass: DeviceProviderMock },
        provideMockStore({ ...{} }),
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();

    authenticationProvider = TestBed.inject(AuthenticationProvider);
    platform = TestBed.inject(Platform);
    appConfigProvider = TestBed.inject(AppConfigProvider);
    store$ = TestBed.inject(MockStore);
    alertController = TestBed.inject(AlertController);
    loadingController = TestBed.inject(LoadingController);
    menuController = TestBed.inject(MenuController);
    logHelper = TestBed.inject(LogHelper);
    analytics = TestBed.inject(AnalyticsProvider);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spyOn(component, 'isIos').and.returnValue(true);
      spyOn(component, 'login').and.returnValue(Promise.resolve());
      spyOn(component, 'closeSideMenuIfOpen').and.returnValue(Promise.resolve());
    });
    it('should call login function when on ios', fakeAsync(() => {
      spyOn(routerSpy, 'getCurrentNavigation').and.returnValue({ extras: { state: { hasLoggedOut: false } } });
      component.ngOnInit();
      flushMicrotasks();
      expect(component.login).toHaveBeenCalled();
    }));
    it('should not run login on hasLoggedOut', fakeAsync(() => {
      spyOn(routerSpy, 'getCurrentNavigation').and.returnValue({ extras: { state: { hasLoggedOut: true } } });
      component.ngOnInit();
      flushMicrotasks();
      expect(component.closeSideMenuIfOpen).toHaveBeenCalled();
      expect(component.login).not.toHaveBeenCalled();
    }));
  });
  describe('closeSideMenuIfOpen', () => {
    beforeEach(() => {
      spyOn(menuController, 'close');
    });
    it('should call menu close when isOpen', async () => {
      spyOn(menuController, 'isOpen').and.returnValue(Promise.resolve(true));
      await component.closeSideMenuIfOpen();
      expect(menuController.close).toHaveBeenCalled();
    });
    it('should not call menu close when isOpen returns false', async () => {
      spyOn(menuController, 'isOpen').and.returnValue(Promise.resolve(false));
      await component.closeSideMenuIfOpen();
      expect(menuController.close).not.toHaveBeenCalled();
    });
  });
  describe('login', () => {
    beforeEach(() => {
      spyOn(component, 'handleLoadingUI').and.returnValue(Promise.resolve());
      spyOn(component, 'hideSplashscreen').and.returnValue(Promise.resolve());
      spyOn(component, 'validateDeviceType');
      spyOn(appConfigProvider, 'initialiseAppConfig').and.returnValue(Promise.resolve());
      spyOn(appConfigProvider, 'loadRemoteConfig').and.returnValue(Promise.resolve());
      spyOn(authenticationProvider, 'expireTokens').and.returnValue(Promise.resolve());
      spyOn(authenticationProvider, 'isAuthenticated').and.returnValue(Promise.resolve(false));
      spyOn(authenticationProvider, 'setEmployeeId').and.returnValue(Promise.resolve());
      spyOn(authenticationProvider, 'getEmployeeId').and.returnValue('123456');
      spyOn(authenticationProvider, 'login').and.returnValue(Promise.resolve());
      spyOn(authenticationProvider, 'logout').and.returnValue(Promise.resolve());
      spyOn(store$, 'dispatch');
      spyOn(component, 'appInitializedLog');
      spyOn(component, 'dispatchLog');
      spyOn(analytics, 'initialiseAnalytics').and.returnValue(Promise.resolve());
      spyOn(analytics, 'logException');
    });
    describe('Successful login flow', () => {
      it('should run the login flow code', fakeAsync(() => {
        spyOn(platform, 'ready').and.returnValue(Promise.resolve(''));
        component.login();
        flushMicrotasks();
        expect(appConfigProvider.initialiseAppConfig).toHaveBeenCalled();
        expect(component.appInitializedLog).toHaveBeenCalled();
        expect(authenticationProvider.expireTokens).toHaveBeenCalled();
        expect(authenticationProvider.isAuthenticated).toHaveBeenCalled();
        expect(authenticationProvider.setEmployeeId).toHaveBeenCalled();
        expect(appConfigProvider.loadRemoteConfig).toHaveBeenCalled();
        expect(component.handleLoadingUI).toHaveBeenCalled();
        expect(analytics.initialiseAnalytics).toHaveBeenCalled();
        expect(component.validateDeviceType).toHaveBeenCalled();
        expect(store$.dispatch).toHaveBeenCalledTimes(8);
      }));
    });
    describe('Unsuccessful login flow', () => {
      it('should not call any further methods in try when platform.ready() fails', fakeAsync(() => {
        spyOn(platform, 'ready').and.returnValue(Promise.reject(AuthenticationError.USER_NOT_AUTHORISED));
        component.login();
        flushMicrotasks();
        expect(authenticationProvider.logout).toHaveBeenCalled();
        expect(component.validateDeviceType).not.toHaveBeenCalled();
      }));
      it('should log an exception and dispatch log when when rejection due to USER_CANCELLED', fakeAsync(() => {
        spyOn(platform, 'ready').and.returnValue(Promise.reject(AuthenticationError.USER_CANCELLED));
        component.login();
        flushMicrotasks();
        expect(component.validateDeviceType).not.toHaveBeenCalled();
        expect(analytics.logException).toHaveBeenCalledWith(AuthenticationError.USER_CANCELLED, true);
        expect(component.dispatchLog).toHaveBeenCalledWith('user cancelled login');
        expect(component.hasUserLoggedOut).toEqual(false);
      }));
      it('should dispatch log when error is USER_NOT_AUTHORISED and a token is present', fakeAsync(() => {
        spyOn(authenticationProvider, 'getAuthenticationToken').and.returnValue(Promise.resolve('token'));
        spyOn(platform, 'ready').and.returnValue(Promise.reject(AuthenticationError.USER_NOT_AUTHORISED));
        component.login();
        flushMicrotasks();
        expect(authenticationProvider.getAuthenticationToken).toHaveBeenCalled();
        expect(authenticationProvider.getEmployeeId).toHaveBeenCalled();
        expect(component.dispatchLog).toHaveBeenCalledWith('user 123456 not authorised: TOKEN token');
        expect(authenticationProvider.logout).toHaveBeenCalled();
        expect(component.appInitError).toEqual(AuthenticationError.USER_NOT_AUTHORISED);
        expect(component.hasUserLoggedOut).toEqual(false);
      }));
      it('should dispatch log when error is USER_NOT_AUTHORISED and no token is present', fakeAsync(() => {
        spyOn(authenticationProvider, 'getAuthenticationToken').and.returnValue(Promise.resolve(null));
        spyOn(platform, 'ready').and.returnValue(Promise.reject(AuthenticationError.USER_NOT_AUTHORISED));
        component.login();
        flushMicrotasks();
        expect(authenticationProvider.getAuthenticationToken).toHaveBeenCalled();
        expect(authenticationProvider.getEmployeeId).toHaveBeenCalled();
        expect(component.dispatchLog).toHaveBeenCalledWith('user 123456 not authorised: Could not get token');
        expect(authenticationProvider.logout).toHaveBeenCalled();
        expect(component.appInitError).toEqual(AuthenticationError.USER_NOT_AUTHORISED);
        expect(component.hasUserLoggedOut).toEqual(false);
      }));
    });
  });
  describe('dispatchLog', () => {
    it('should dispatch two actions SaveLog/SendLogs with custom param', () => {
      spyOn(store$, 'dispatch');
      spyOn(logHelper, 'createLog').and.returnValue({} as Log);
      component.dispatchLog('msg');
      expect(store$.dispatch).toHaveBeenCalledWith(SaveLog({ payload: {} as Log }));
      expect(store$.dispatch).toHaveBeenCalledWith(SendLogs());
      expect(logHelper.createLog).toHaveBeenCalledWith(LogType.ERROR, 'User login', 'msg');
    });
  });
  describe('appInitializedLog', () => {
    it('should dispatch a SaveLog action indicating app has initialised', () => {
      spyOn(store$, 'dispatch');
      spyOn(logHelper, 'createLog').and.returnValue({} as Log);
      component.appInitializedLog();
      expect(store$.dispatch).toHaveBeenCalledWith(SaveLog({ payload: {} as Log }));
      expect(logHelper.createLog).toHaveBeenCalledWith(
        LogType.INFO,
        'App has MDM provided config and is ready to proceed with authentication',
        'App has initialised',
      );
    });
  });

  describe('initialiseAuthentication', () => {
    it('should call through to initialiseAuthentication and determineAuthenticationMode', () => {
      spyOn(authenticationProvider, 'initialiseAuthentication');
      spyOn(authenticationProvider, 'determineAuthenticationMode');
      component.initialiseAuthentication();
      expect(authenticationProvider.initialiseAuthentication).toHaveBeenCalled();
      expect(authenticationProvider.determineAuthenticationMode).toHaveBeenCalled();
    });
  });

  describe('isInternetConnectionError', () => {
    it('should return false when appInitError is not connection error', () => {
      component.hasUserLoggedOut = false;
      component.appInitError = AuthenticationError.USER_CANCELLED;
      expect(component.isInternetConnectionError()).toEqual(false);
    });
    it('should return true when appInitError is connection error', () => {
      component.hasUserLoggedOut = false;
      component.appInitError = AuthenticationError.NO_INTERNET;
      expect(component.isInternetConnectionError()).toEqual(true);
    });
  });
  describe('isUserCancelledError', () => {
    it('should return false when appInitError is not user cancel error', () => {
      component.hasUserLoggedOut = false;
      component.appInitError = AuthenticationError.NO_INTERNET;
      expect(component.isUserCancelledError()).toEqual(false);
    });
    it('should return true when appInitError is user cancel error', () => {
      component.hasUserLoggedOut = false;
      component.appInitError = AuthenticationError.USER_CANCELLED;
      expect(component.isUserCancelledError()).toEqual(true);
    });
  });
  describe('isUnknownError', () => {
    it('should return true when appInitError is not one of specified', () => {
      component.hasUserLoggedOut = false;
      component.appInitError = AuthenticationError.NO_RESPONSE;
      expect(component.isUnknownError()).toEqual(true);
    });
    it('should return false when use has logged out', () => {
      component.hasUserLoggedOut = true;
      expect(component.isUnknownError()).toEqual(false);
    });
    it('should return false when appInitError is one of specified', () => {
      component.hasUserLoggedOut = false;
      component.appInitError = AuthenticationError.USER_CANCELLED;
      expect(component.isUnknownError()).toEqual(false);
    });
  });
  describe('validateDeviceType', () => {
    beforeEach(() => {
      spyOn(routerSpy, 'navigate');
    });
    it('should navigate to dashboard page', () => {
      spyOn(component.deviceProvider, 'validDeviceType').and.returnValue(true);
      component.validateDeviceType();
      expect(routerSpy.navigate).toHaveBeenCalledWith([DASHBOARD_PAGE]);
    });
  });
  describe('showErrorDetails', () => {
    it('should create the alert controller with params', fakeAsync(() => {
      spyOn(alertController, 'create').and.callThrough();
      component.appInitError = AppConfigError.MDM_ERROR;
      component.showErrorDetails();
      flushMicrotasks();
      expect(alertController.create).toHaveBeenCalledWith({
        header: 'Error details',
        message: '"error getting mobile device management config"',
        buttons: ['OK'],
      });
    }));
  });
  describe('handleLoadingUI', () => {
    beforeEach(() => {
      spyOn(loadingController, 'create').and.callThrough();
      spyOn(loadingController, 'dismiss');
    });
    it('should create spinner and not run dismiss', fakeAsync(() => {
      component.handleLoadingUI(true);
      flushMicrotasks();
      expect(loadingController.create).toHaveBeenCalledWith({
        id: 'app_init_spinner',
        spinner: 'circles',
        message: 'App initialising...',
      });
      expect(loadingController.dismiss).not.toHaveBeenCalled();
    }));
    it('should not create loader and run the dismiss', fakeAsync(() => {
      component.handleLoadingUI(false);
      flushMicrotasks();
      expect(loadingController.create).not.toHaveBeenCalled();
      expect(loadingController.dismiss).toHaveBeenCalled();
    }));
  });
  describe('hideSplashscreen', () => {
    it('should hide splashscreen if plugin is available', async () => {
      spyOn(SplashScreen, 'hide');
      spyOn(Capacitor, 'isPluginAvailable').and.returnValue(true);
      await component.hideSplashscreen();
      expect(SplashScreen.hide).toHaveBeenCalled();
    });
  });
});
