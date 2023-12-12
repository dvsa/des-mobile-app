import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, flushMicrotasks, TestBed, waitForAsync } from '@angular/core/testing';
import { AlertController, MenuController, Platform } from '@ionic/angular';
import { Store, StoreModule } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ActivatedRouteMock,
  AlertControllerMock,
  MenuControllerMock,
  PlatformMock,
  RouterMock,
} from '@mocks/index.mock';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Capacitor } from '@capacitor/core';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { DataStoreProvider } from '@providers/data-store/data-store';
import { DataStoreProviderMock } from '@providers/data-store/__mocks__/data-store.mock';
import { NetworkStateProvider } from '@providers/network-state/network-state';
import { NetworkStateProviderMock } from '@providers/network-state/__mocks__/network-state.mock';
import { AppResumed, AppSuspended, LoadAppVersion } from '@store/app-info/app-info.actions';
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

import { Storage } from '@ionic/storage-angular';
import { Subscription } from 'rxjs';
import { SideMenuClosed, SideMenuItemSelected, SideMenuOpened } from '@pages/dashboard/dashboard.actions';
import { AccessibilityService } from '@providers/accessibility/accessibility.service';
import { AccessibilityServiceMock } from '@providers/accessibility/__mocks__/accessibility-service.mock';
import { LOGIN_PAGE } from '@pages/page-names.constants';
import { AppComponent } from '../app.component';
import { StorageMock } from '@mocks/ionic-mocks/storage.mock';
import { LogHelper } from '@providers/logs/logs-helper';
import { LogHelperMock } from '@providers/logs/__mocks__/logs-helper.mock';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let router: Router;
  let authenticationProvider: AuthenticationProvider;
  let platform: Platform;
  let menuController: MenuController;
  let store$: Store;
  let dataStore: DataStoreProvider;
  let networkStateProvider: NetworkStateProvider;
  let translate: TranslateService;
  let appConfigProvider: AppConfigProvider;
  let deviceProvider: DeviceProvider;
  let storage: Storage;

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
          provide: MenuController,
          useClass: MenuControllerMock,
        },
        {
          provide: AlertController,
          useClass: AlertControllerMock,
        },
        {
          provide: DataStoreProvider,
          useClass: DataStoreProviderMock,
        },
        {
          provide: NetworkStateProvider,
          useClass: NetworkStateProviderMock,
        },
        {
          provide: TranslateService,
          useValue: translateServiceMock,
        },
        {
          provide: AppInfoProvider,
          useClass: AppInfoProviderMock,
        },
        {
          provide: AppConfigProvider,
          useClass: AppConfigProviderMock,
        },
        {
          provide: DeviceProvider,
          useClass: DeviceProviderMock,
        },
        {
          provide: SlotProvider,
          useClass: SlotProvider,
        },
        {
          provide: DateTimeProvider,
          useClass: DateTimeProviderMock,
        },
        {
          provide: AccessibilityService,
          useClass: AccessibilityServiceMock,
        },
        {
          provide: Storage,
          useClass: StorageMock,
        },
        {
          provide: ActivatedRoute,
          useClass: ActivatedRouteMock,
        },
        {
          provide: LogHelper,
          useClass: LogHelperMock,
        },
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
    networkStateProvider = TestBed.inject(NetworkStateProvider);
    translate = TestBed.inject(TranslateService);
    appConfigProvider = TestBed.inject(AppConfigProvider);
    deviceProvider = TestBed.inject(DeviceProvider);
    router = TestBed.inject(Router);
    storage = TestBed.inject(Storage);
    spyOn(store$, 'dispatch');
  }));

  it('should create the app', () => {
    const app = fixture.debugElement.componentInstance;
    expect(app)
      .toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spyOn(platform, 'ready')
        .and
        .returnValue(Promise.resolve(''));
      spyOn(platform, 'is')
        .and
        .returnValue(true);
      spyOn(store$, 'dispatch');
      spyOn(component, 'configurePlatformSubscriptions');
      spyOn(component, 'initialiseAuthentication');
      spyOn(component, 'configureLocale');
      spyOn(component, 'initialiseSentry')
        .and
        .returnValue(Promise.resolve());
      spyOn(component, 'initialisePersistentStorage')
        .and
        .returnValue(Promise.resolve());
      spyOn(component, 'configureStatusBar')
        .and
        .returnValue(Promise.resolve());
      spyOn(component, 'disableMenuSwipe')
        .and
        .returnValue(Promise.resolve());
      spyOn(appConfigProvider, 'initialiseAppConfig')
        .and
        .returnValue(Promise.resolve());
    });
    it('should run app initialisation code', fakeAsync(() => {
      spyOn(deviceProvider, 'disableSingleAppMode')
        .and
        .returnValue(Promise.resolve(true));
      component.ngOnInit();
      flushMicrotasks();
      expect(storage.create)
        .toHaveBeenCalled();
      expect(deviceProvider.disableSingleAppMode)
        .toHaveBeenCalled();
      expect(appConfigProvider.initialiseAppConfig)
        .toHaveBeenCalled();
      expect(component.initialiseAuthentication)
        .toHaveBeenCalled();
      expect(component.initialisePersistentStorage)
        .toHaveBeenCalled();
      expect(store$.dispatch)
        .toHaveBeenCalledWith(LoadAppVersion());
      expect(component.configureStatusBar)
        .toHaveBeenCalled();
      expect(component.disableMenuSwipe)
        .toHaveBeenCalled();
      expect(component.configureLocale)
        .toHaveBeenCalled();
    }));
    it('should run through catch block if error detected', fakeAsync(() => {
      spyOn(deviceProvider, 'disableSingleAppMode')
        .and
        .returnValue(Promise.reject(new Error('Failed to disable')));
      component.ngOnInit();
      flushMicrotasks();
      expect(router.navigate)
        .toHaveBeenCalledWith([LOGIN_PAGE], { replaceUrl: true });
    }));
  });

  describe('initialiseAuthentication', () => {
    it('should call through to initialiseAuthentication and determineAuthenticationMode', () => {
      spyOn(authenticationProvider, 'initialiseAuthentication');
      spyOn(authenticationProvider, 'determineAuthenticationMode');
      component.initialiseAuthentication();
      expect(authenticationProvider.initialiseAuthentication)
        .toHaveBeenCalled();
      expect(authenticationProvider.determineAuthenticationMode)
        .toHaveBeenCalled();
    });
  });

  describe('initialiseNetworkState', () => {
    it('should call through to initialiseNetworkState', () => {
      spyOn(networkStateProvider, 'initialiseNetworkState');
      component.initialiseNetworkState();
      expect(networkStateProvider.initialiseNetworkState)
        .toHaveBeenCalled();
    });
  });

  describe('initialisePersistentStorage', () => {
    it('should call setSecureContainer when in ios', fakeAsync(() => {
      spyOn(dataStore, 'createContainer')
        .and
        .returnValue(Promise.resolve());
      spyOn(component, 'isIos')
        .and
        .returnValue(true);
      component.initialisePersistentStorage();
      flushMicrotasks();
      expect(dataStore.createContainer)
        .toHaveBeenCalledWith();
      expect(dataStore.migrateAllKeys)
        .toHaveBeenCalled();
    }));
    it('should resolve to error message', () => {
      spyOn(dataStore, 'createContainer')
        .and
        // eslint-disable-next-line prefer-promise-reject-errors
        .returnValue(Promise.reject('Failed to create container'));
      spyOn(component, 'isIos')
        .and
        .returnValue(true);
      component.initialisePersistentStorage()
        .catch((err) => {
          expect(err)
            .toEqual('Failed to create container');
        });
    });
  });

  describe('configureStatusBar', () => {
    it('should set status bar styles when plugin is available', async () => {
      spyOn(StatusBar, 'setStyle');
      spyOn(Capacitor, 'isPluginAvailable')
        .and
        .returnValue(true);
      await component.configureStatusBar();
      expect(StatusBar.setStyle)
        .toHaveBeenCalledWith({ style: Style.Dark });
    });
  });

  describe('disableMenuSwipe', () => {
    it('should call swipeGesture with false to disable side menu swipe', async () => {
      spyOn(menuController, 'swipeGesture');
      await component.disableMenuSwipe();
      expect(menuController.swipeGesture)
        .toHaveBeenCalledWith(false);
    });
  });

  describe('onLogoutClick', () => {
    it('should call through to openLogoutModal', async () => {
      spyOn(component, 'openLogoutModal');
      await component.onLogoutClick();
      expect(component.openLogoutModal)
        .toHaveBeenCalled();
    });
  });

  describe('configureLocale', () => {
    it('should configure the locale to be English by default', () => {
      spyOn(translate, 'setDefaultLang');
      component.configureLocale();
      expect(translate.setDefaultLang)
        .toHaveBeenCalledWith('en');
    });
  });

  describe('closeSideMenu', () => {
    it('should dispatch SideMenuClosed', () => {
      component.closeSideMenu();
      expect(store$.dispatch)
        .toHaveBeenCalledWith(SideMenuClosed());
    });
  });

  describe('openSideMenu', () => {
    it('should dispatch SideMenuOpened', () => {
      component.openSideMenu();
      expect(store$.dispatch)
        .toHaveBeenCalledWith(SideMenuOpened());
    });
  });

  describe('onAppSuspended', () => {
    it('should dispatch AppSuspended', () => {
      component.onAppSuspended();
      expect(store$.dispatch)
        .toHaveBeenCalledWith(AppSuspended());
    });
  });

  describe('onAppResumed', () => {
    it('should dispatch `AppResumed` and call through to accessibility provider', async () => {
      await component.onAppResumed();
      expect(store$.dispatch)
        .toHaveBeenCalledWith(AppResumed());
    });
  });

  describe('configurePlatformSubscriptions', () => {
    it('should check the value of platformSubscription gets set', () => {
      // check platform starts as nullish
      expect(component['platformSubscription'])
        .toEqual(undefined);

      // start sub
      component.configurePlatformSubscriptions();
      expect(component['platformSubscription'])
        .not
        .toEqual(undefined);

      // clean up
      component['platformSubscription'].unsubscribe();
    });
  });

  describe('ionViewWillUnload', () => {
    it('should unsubscribe from subscription if there is one', () => {
      component['platformSubscription'] = new Subscription();
      spyOn(component['platformSubscription'], 'unsubscribe');
      component.ionViewWillUnload();
      expect(component['platformSubscription'].unsubscribe)
        .toHaveBeenCalled();
    });
  });

  describe('navPage', () => {
    it('should call router.navigate with parameter passed', async () => {
      await component.navPage({
        title: 'test',
        descriptor: 'test2',
      });
      expect(router.navigate)
        .toHaveBeenCalledWith(['test']);
    });
    it('should call menuController.close', async () => {
      spyOn(menuController, 'close');
      await component.navPage({
        title: 'test',
        descriptor: 'test2',
      });
      expect(menuController.close)
        .toHaveBeenCalled();
    });
    it('should call store$.dispatch with SideMenuItemSelected', async () => {
      await component.navPage({
        title: 'test',
        descriptor: 'test2',
      });
      expect(store$.dispatch)
        .toHaveBeenCalledWith(SideMenuItemSelected('test2'));
    });
  });

});
