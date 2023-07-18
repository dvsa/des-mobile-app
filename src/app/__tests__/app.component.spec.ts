import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  ComponentFixture, fakeAsync, flushMicrotasks, TestBed, waitForAsync,
} from '@angular/core/testing';
import { AlertController, MenuController, Platform } from '@ionic/angular';
import { Store, StoreModule } from '@ngrx/store';
import { Router } from '@angular/router';
import { SecureStorage, SecureStorageObject } from '@awesome-cordova-plugins/secure-storage/ngx';
import {
  AlertControllerMock, PlatformMock, MenuControllerMock, SecureStorageMock,
} from '@mocks/index.mock';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Capacitor } from '@capacitor/core';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { DataStoreProvider } from '@providers/data-store/data-store';
import { DataStoreProviderMock } from '@providers/data-store/__mocks__/data-store.mock';
import { NetworkStateProvider } from '@providers/network-state/network-state';
import { NetworkStateProviderMock } from '@providers/network-state/__mocks__/network-state.mock';
import { AppSuspended, LoadAppVersion } from '@store/app-info/app-info.actions';
import { translateServiceMock } from '@shared/helpers/__mocks__/translate.mock';
import { StatusBar, Style } from '@capacitor/status-bar';
import { AppInfoProvider } from '@providers/app-info/app-info';
import { AppInfoProviderMock } from '@providers/app-info/__mocks__/app-info.mock';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { AppConfigProviderMock } from '@providers/app-config/__mocks__/app-config.mock';
import { DeviceProvider } from '@providers/device/device';
import { DeviceProviderMock } from '@providers/device/__mocks__/device.mock';
import { PipesModule } from '@shared/pipes/pipes.module';
import { SlotProvider } from '@providers/slot/slot';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { DateTimeProviderMock } from '@providers/date-time/__mocks__/date-time.mock';

import { Subscription } from 'rxjs';
import { SideMenuClosed, SideMenuItemSelected, SideMenuOpened } from '@pages/dashboard/dashboard.actions';
import { AccessibilityService } from '@providers/accessibility/accessibility.service';
import { AccessibilityServiceMock } from '@providers/accessibility/__mocks__/accessibility-service.mock';
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
  let appConfigProvider: AppConfigProvider;
  let deviceProvider: DeviceProvider;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        StoreModule.forRoot({}),
        TranslateModule.forRoot(),
        PipesModule,
      ],
      providers: [
        { provide: Platform, useClass: PlatformMock },
        { provide: AuthenticationProvider, useClass: AuthenticationProviderMock },
        { provide: Router, useValue: routerSpy },
        { provide: MenuController, useClass: MenuControllerMock },
        { provide: AlertController, useClass: AlertControllerMock },
        { provide: SecureStorage, useClass: SecureStorageMock },
        { provide: DataStoreProvider, useClass: DataStoreProviderMock },
        { provide: NetworkStateProvider, useClass: NetworkStateProviderMock },
        { provide: TranslateService, useValue: translateServiceMock },
        { provide: AppInfoProvider, useClass: AppInfoProviderMock },
        { provide: AppConfigProvider, useClass: AppConfigProviderMock },
        { provide: DeviceProvider, useClass: DeviceProviderMock },
        { provide: SlotProvider, useClass: SlotProvider },
        { provide: DateTimeProvider, useClass: DateTimeProviderMock },
        { provide: AccessibilityService, useClass: AccessibilityServiceMock },
      ],
    });

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
    appConfigProvider = TestBed.inject(AppConfigProvider);
    deviceProvider = TestBed.inject(DeviceProvider);
    spyOn(store$, 'dispatch');
  }));

  it('should create the app', () => {
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spyOn(platform, 'ready').and.returnValue(Promise.resolve(''));
      spyOn(store$, 'dispatch');
      spyOn(component, 'configurePlatformSubscriptions');
      spyOn(component, 'initialiseAuthentication');
      spyOn(component, 'configureLocale');
      spyOn(component, 'initialisePersistentStorage').and.returnValue(Promise.resolve());
      spyOn(component, 'configureStatusBar').and.returnValue(Promise.resolve());
      spyOn(component, 'disableMenuSwipe').and.returnValue(Promise.resolve());
      spyOn(appConfigProvider, 'initialiseAppConfig').and.returnValue(Promise.resolve());
      spyOn(deviceProvider, 'disableSingleAppMode');
    });
    it('should run app initialisation code', fakeAsync(() => {
      component.ngOnInit();
      flushMicrotasks();
      expect(appConfigProvider.initialiseAppConfig).toHaveBeenCalled();
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

  describe('closeSideMenu', () => {
    it('should dispatch SideMenuClosed', () => {
      component.closeSideMenu();
      expect(store$.dispatch).toHaveBeenCalledWith(SideMenuClosed());
    });
  });

  describe('openSideMenu', () => {
    it('should dispatch SideMenuOpened', () => {
      component.openSideMenu();
      expect(store$.dispatch).toHaveBeenCalledWith(SideMenuOpened());
    });
  });

  describe('onAppSuspended', () => {
    it('should dispatch AppSuspended', () => {
      component.onAppSuspended();
      expect(store$.dispatch).toHaveBeenCalledWith(AppSuspended());
    });
  });

  describe('ionViewWillUnload', () => {
    it('should unsubscribe from subscription if there is one', () => {
      component['platformSubscription'] = new Subscription();
      spyOn(component['platformSubscription'], 'unsubscribe');
      component.ionViewWillUnload();
      expect(component['platformSubscription'].unsubscribe).toHaveBeenCalled();
    });
  });

  describe('navPage', () => {
    it('should call router.navigate with parameter passed', async () => {
      spyOn(component['router'], 'navigate');
      await component.navPage({ title: 'test', descriptor: 'test2' });
      expect(component['router'].navigate).toHaveBeenCalledWith(['test']);
    });
    it('should call menuController.close', async () => {
      spyOn(menuController, 'close');
      await component.navPage({ title: 'test', descriptor: 'test2' });
      expect(menuController.close).toHaveBeenCalled();
    });
    it('should call store$.dispatch with SideMenuItemSelected', async () => {
      await component.navPage({ title: 'test', descriptor: 'test2' });
      expect(store$.dispatch).toHaveBeenCalledWith(SideMenuItemSelected('test2'));
    });
  });

});
