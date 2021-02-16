import {
  async, ComponentFixture, fakeAsync, flushMicrotasks, TestBed,
} from '@angular/core/testing';
import {
  AlertController, IonicModule, LoadingController, MenuController, Platform,
} from '@ionic/angular';
import { configureTestSuite } from 'ng-bullet';
import { SecureStorage, SecureStorageObject } from '@ionic-native/secure-storage/ngx';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { StoreModule } from '@ngrx/store';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { LoginPage } from '../login.page';
import { AppConfigProvider } from '../../../providers/app-config/app-config';
import { AppConfigProviderMock } from '../../../providers/app-config/__mocks__/app-config.mock';
import { AuthenticationProvider } from '../../../providers/authentication/authentication';
import { AuthenticationProviderMock } from '../../../providers/authentication/__mocks__/authentication.mock';
import { DataStoreProvider } from '../../../providers/data-store/data-store';
import { DataStoreProviderMock } from '../../../providers/data-store/__mocks__/data-store.mock';
import { NetworkStateProvider } from '../../../providers/network-state/network-state';
import { NetworkStateProviderMock } from '../../../providers/network-state/__mocks__/network-state.mock';
import { DASHBOARD_PAGE } from '../../page-names.constants';
import { AuthenticationError } from '../../../providers/authentication/authentication.constants';
import { PlatformMock } from '../../../../../mock/ionic-mocks/platform-mock';
import { AppConfigError } from '../../../providers/app-config/app-config.constants';
import { LoadingControllerMock } from '../../../../../mock/ionic-mocks/loading-controller.mock';
import { AlertControllerMock } from '../../../../../mock/ionic-mocks/alert-controller.mock';
import { SecureStorageMock } from '../../../../../mock/ionic-mocks/secure-storage.mock';
import { MenuControllerMock } from '../../../../../mock/ionic-mocks/menu-controller';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl', 'navigate', 'getCurrentNavigation']);
  // eslint-disable-next-line rxjs/finnish
  const mockActivateRoute = { queryParams: of({}) } as ActivatedRoute;
  let authenticationProvider: AuthenticationProvider;
  let appConfigProvider: AppConfigProvider;
  let dataStore: DataStoreProvider;
  let platform: Platform;
  let secureStorage: SecureStorage;
  let store$: MockStore;
  let networkStateProvider: NetworkStateProvider;
  let alertController: AlertController;
  let loadingController: LoadingController;
  let menuController: MenuController;

  configureTestSuite(() => {
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
        { provide: SecureStorage, useClass: SecureStorageMock },
        { provide: DataStoreProvider, useClass: DataStoreProviderMock },
        { provide: NetworkStateProvider, useClass: NetworkStateProviderMock },
        { provide: ActivatedRoute, useValue: mockActivateRoute },
        { provide: MenuController, useClass: MenuControllerMock },
        provideMockStore({ ...{} }),
      ],
    });
  });

  beforeEach(async(() => {
    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();

    authenticationProvider = TestBed.inject(AuthenticationProvider);
    dataStore = TestBed.inject(DataStoreProvider);
    platform = TestBed.inject(Platform);
    secureStorage = TestBed.inject(SecureStorage);
    appConfigProvider = TestBed.inject(AppConfigProvider);
    store$ = TestBed.inject(MockStore);
    networkStateProvider = TestBed.inject(NetworkStateProvider);
    alertController = TestBed.inject(AlertController);
    loadingController = TestBed.inject(LoadingController);
    menuController = TestBed.inject(MenuController);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spyOn(component, 'isIos').and.returnValue(true);
      spyOn(component, 'login').and.returnValue(Promise.resolve());
      spyOn(component, 'closeSideMenuIfOpen').and.returnValue(Promise.resolve());
      spyOn(networkStateProvider, 'initialiseNetworkState');
    });
    it('should initialise network and call login function when on ios', fakeAsync(() => {
      spyOn(routerSpy, 'getCurrentNavigation').and.returnValue({ extras: { state: { hasLoggedOut: false } } });
      component.ngOnInit();
      flushMicrotasks();
      expect(networkStateProvider.initialiseNetworkState).toHaveBeenCalled();
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
      spyOn(component, 'validateDeviceType');
      spyOn(appConfigProvider, 'initialiseAppConfig').and.returnValue(Promise.resolve());
      spyOn(appConfigProvider, 'loadRemoteConfig').and.returnValue(Promise.resolve());
      spyOn(authenticationProvider, 'expireTokens').and.returnValue(Promise.resolve());
      spyOn(authenticationProvider, 'isAuthenticated').and.returnValue(Promise.resolve(false));
      spyOn(authenticationProvider, 'setEmployeeId').and.returnValue(Promise.resolve());
      spyOn(authenticationProvider, 'login').and.returnValue(Promise.resolve());
      spyOn(authenticationProvider, 'logout').and.returnValue(Promise.resolve());
      spyOn(store$, 'dispatch');
      spyOn(component, 'initialiseAuthentication');
      spyOn(component, 'initialisePersistentStorage').and.returnValue(Promise.resolve());
    });
    it('should ', fakeAsync(() => {
      spyOn(platform, 'ready').and.returnValue(Promise.resolve(''));
      component.login();
      flushMicrotasks();
      expect(appConfigProvider.initialiseAppConfig).toHaveBeenCalled();
      expect(component.initialiseAuthentication).toHaveBeenCalled();
      expect(component.initialisePersistentStorage).toHaveBeenCalled();
      expect(authenticationProvider.expireTokens).toHaveBeenCalled();
      expect(authenticationProvider.isAuthenticated).toHaveBeenCalled();
      expect(authenticationProvider.setEmployeeId).toHaveBeenCalled();
      expect(appConfigProvider.loadRemoteConfig).toHaveBeenCalled();
      expect(component.handleLoadingUI).toHaveBeenCalled();
      expect(component.validateDeviceType).toHaveBeenCalled();
    }));
    it('should not call any further methods in try when platform.ready() fails', fakeAsync(() => {
      spyOn(platform, 'ready').and.returnValue(Promise.reject(AuthenticationError.USER_NOT_AUTHORISED));
      component.login();
      flushMicrotasks();
      expect(authenticationProvider.logout).toHaveBeenCalled();
      expect(component.validateDeviceType).not.toHaveBeenCalled();
    }));
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
  describe('initialisePersistentStorage', () => {
    beforeEach(() => {
      spyOn(dataStore, 'setSecureContainer');
    });
    it('should call setSecureContainer when in ios', fakeAsync(() => {
      spyOn(secureStorage, 'create').and.returnValue(Promise.resolve({} as SecureStorageObject));
      spyOn(component, 'isIos').and.returnValue(true);
      component.initialisePersistentStorage();
      flushMicrotasks();
      expect(secureStorage.create).toHaveBeenCalledWith('DES');
      expect(dataStore.setSecureContainer).toHaveBeenCalledWith({} as SecureStorageObject);
    }));
    it('should resolve to error message', () => {
      // eslint-disable-next-line prefer-promise-reject-errors
      spyOn(secureStorage, 'create').and.returnValue(Promise.reject('Failed to create container'));
      spyOn(component, 'isIos').and.returnValue(true);
      component.initialisePersistentStorage().catch((err) => {
        expect(err).toEqual('Failed to create container');
      });
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
  describe('goToDashboard', () => {
    it('should navigate to dashboard page', () => {
      spyOn(routerSpy, 'navigate');
      component.goToDashboard();
      expect(routerSpy.navigate).toHaveBeenCalledWith([DASHBOARD_PAGE]);
    });
  });
});
