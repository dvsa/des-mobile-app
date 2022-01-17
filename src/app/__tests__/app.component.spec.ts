import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  ComponentFixture, fakeAsync, flushMicrotasks, TestBed, waitForAsync,
} from '@angular/core/testing';
import { AlertController, MenuController, Platform } from '@ionic/angular';
import { configureTestSuite } from 'ng-bullet';
import { Store, StoreModule } from '@ngrx/store';
import { Router } from '@angular/router';
import { SecureStorage, SecureStorageObject } from '@ionic-native/secure-storage/ngx';
import { AlertControllerMock } from 'ionic-mocks';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Capacitor } from '@capacitor/core';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { DataStoreProvider } from '@providers/data-store/data-store';
import { DataStoreProviderMock } from '@providers/data-store/__mocks__/data-store.mock';
import { NetworkStateProvider } from '@providers/network-state/network-state';
import { NetworkStateProviderMock } from '@providers/network-state/__mocks__/network-state.mock';
import { LoadAppVersion } from '@store/app-info/app-info.actions';
import { PlatformMock } from '@mocks/ionic-mocks/platform-mock';
import { MenuControllerMock } from '@mocks/ionic-mocks/menu-controller';
import { SecureStorageMock } from '@mocks/ionic-mocks/secure-storage.mock';
import { translateServiceMock } from '@shared/helpers/__mocks__/translate.mock';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { AppComponent } from '../app.component';

describe('AppComponent', () => {
  jasmine.getEnv().allowRespy(true);
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl', 'navigate']);

  let authenticationProvider: AuthenticationProvider;
  let platform: Platform;
  let menuController: MenuController;
  let store$: Store;
  let secureStorage: SecureStorage;
  let dataStore: DataStoreProvider;
  let networkStateProvider: NetworkStateProvider;
  let translate: TranslateService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        StoreModule.forRoot({}),
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: Platform, useClass: PlatformMock },
        { provide: AuthenticationProvider, useClass: AuthenticationProviderMock },
        { provide: Router, useValue: routerSpy },
        { provide: MenuController, useClass: MenuControllerMock },
        { provide: AlertController, useFactory: () => AlertControllerMock.instance() },
        { provide: SecureStorage, useClass: SecureStorageMock },
        { provide: DataStoreProvider, useClass: DataStoreProviderMock },
        { provide: NetworkStateProvider, useClass: NetworkStateProviderMock },
        { provide: TranslateService, useValue: translateServiceMock },
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    authenticationProvider = TestBed.inject(AuthenticationProvider);
    platform = TestBed.inject(Platform);
    menuController = TestBed.inject(MenuController);
    store$ = TestBed.inject(Store);
    dataStore = TestBed.inject(DataStoreProvider);
    secureStorage = TestBed.inject(SecureStorage);
    networkStateProvider = TestBed.inject(NetworkStateProvider);
    translate = TestBed.inject(TranslateService);
  }));

  it('should create the app', () => {
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spyOn(platform, 'ready').and.returnValue(Promise.resolve(''));
      spyOn(store$, 'dispatch');
      spyOn(component, 'configureAccessibility');
      spyOn(component, 'configurePlatformSubscriptions');
      spyOn(component, 'initialiseAuthentication');
      spyOn(component, 'configureLocale');
      spyOn(component, 'initialisePersistentStorage').and.returnValue(Promise.resolve());
      spyOn(component, 'configureStatusBar').and.returnValue(Promise.resolve());
      spyOn(component, 'disableMenuSwipe').and.returnValue(Promise.resolve());
    });
    it('should run app initialisation code', fakeAsync(() => {
      component.ngOnInit();
      flushMicrotasks();
      expect(component.initialiseAuthentication).toHaveBeenCalled();
      expect(component.initialisePersistentStorage).toHaveBeenCalled();
      expect(store$.dispatch).toHaveBeenCalledWith(LoadAppVersion());
      expect(component.configureStatusBar).toHaveBeenCalled();
      expect(component.disableMenuSwipe).toHaveBeenCalled();
      expect(component.configureLocale).toHaveBeenCalled();
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

  describe('initialiseNetworkState', () => {
    it('should call through to initialiseNetworkState', () => {
      spyOn(networkStateProvider, 'initialiseNetworkState');
      component.initialiseNetworkState();
      expect(networkStateProvider.initialiseNetworkState).toHaveBeenCalled();
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

  describe('getTextZoom', () => {
    it('should return regular when not zoom', () => {
      expect(component.getTextZoom(null)).toEqual('regular');
    });
    it('should return regular when zoom is less than 106', () => {
      expect(component.getTextZoom(100)).toEqual('regular');
    });
    it('should return x-large when zoom is 131 or above', () => {
      expect(component.getTextZoom(132)).toEqual('x-large');
    });
    it('should return large when zoom is 106 or above', () => {
      expect(component.getTextZoom(107)).toEqual('large');
    });
  });

  describe('getTextZoomClass', () => {
    it('should concatenate the value from getTextZoom to a text-zoom string', () => {
      spyOn(component, 'getTextZoom').and.returnValue('regular');
      expect(component.getTextZoomClass()).toEqual('text-zoom-regular');
    });
  });

  describe('configureStatusBar', () => {
    it('should set status bar styles when plugin is available', async () => {
      spyOn(StatusBar, 'setStyle');
      spyOn(Capacitor, 'isPluginAvailable').and.returnValue(true);
      await component.configureStatusBar();
      expect(StatusBar.setStyle).toHaveBeenCalledWith({ style: Style.Dark });
    });
  });

  describe('disableMenuSwipe', () => {
    it('should call swipeGesture with false to disable side menu swipe', async () => {
      spyOn(menuController, 'swipeGesture');
      await component.disableMenuSwipe();
      expect(menuController.swipeGesture).toHaveBeenCalledWith(false);
    });
  });

  describe('onLogoutClick', () => {
    it('should call through to openLogoutModal', async () => {
      spyOn(component, 'openLogoutModal');
      await component.onLogoutClick();
      expect(component.openLogoutModal).toHaveBeenCalled();
    });
  });

  describe('configureLocale', () => {
    it('should configure the locale to be English by default', () => {
      spyOn(translate, 'setDefaultLang');
      component.configureLocale();
      expect(translate.setDefaultLang).toHaveBeenCalledWith('en');
    });
  });

});
