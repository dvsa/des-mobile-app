import { Injector } from '@angular/core';
import { TestBed, fakeAsync, flushMicrotasks, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { KeepAwake as Insomnia } from '@capacitor-community/keep-awake';
import { OrientationType, ScreenOrientation } from '@capawesome/capacitor-screen-orientation';
import { Platform } from '@ionic/angular';
import { RouterMock } from '@mocks/angular-mocks/router-mock';
import { PlatformMock } from '@mocks/ionic-mocks/platform-mock';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { LOGIN_PAGE } from '@pages/page-names.constants';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { DeviceProviderMock } from '@providers/device/__mocks__/device.mock';
import { DeviceProvider } from '@providers/device/device';
import { LogHelperMock } from '@providers/logs/__mocks__/logs-helper.mock';
import { LogHelper } from '@providers/logs/logs-helper';
import { LogType } from '@shared/models/log.model';
import { StoreModel } from '@shared/models/store.model';
import { BasePageComponent } from '../base-page';

describe('BasePageComponent', () => {
  let platform: Platform;
  let authenticationProvider: AuthenticationProvider;
  let injector: Injector;
  let router: Router;
  let deviceProvider: DeviceProvider;
  let logHelper: LogHelper;
  let store$: Store<StoreModel>;
  let basePageComponent: BasePageComponent;
  const activatedRouteMock = {
    snapshot: {
      ['_routerState']: {
        url: '/test',
      },
    } as Data,
  } as ActivatedRoute;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
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
          provide: DeviceProvider,
          useClass: DeviceProviderMock,
        },
        {
          provide: LogHelper,
          useClass: LogHelperMock,
        },
        {
          provide: ActivatedRoute,
          useValue: activatedRouteMock,
        },
        provideMockStore({}),
      ],
    });

    platform = TestBed.inject(Platform);
    injector = TestBed.inject(Injector);
    authenticationProvider = TestBed.inject(AuthenticationProvider);
    router = TestBed.inject(Router);
    deviceProvider = TestBed.inject(DeviceProvider);
    store$ = TestBed.inject(Store);
    logHelper = TestBed.inject(LogHelper);
    router.navigate = jasmine.createSpy().and.returnValue(Promise.resolve(true));

    spyOn(store$, 'dispatch');
    spyOn(logHelper, 'createLog');

    class BasePageClass extends BasePageComponent {
      constructor(public inj: Injector) {
        super(inj);
      }
    }

    basePageComponent = new BasePageClass(injector);
  }));

  describe('ionViewWillEnter()', () => {
    it('should allow user access if authentication is not required', fakeAsync(() => {
      basePageComponent.loginRequired = false;
      basePageComponent.ionViewWillEnter();
      flushMicrotasks();
      expect(router.navigate).not.toHaveBeenCalled();
    }));

    it('should allow user access if authentication is required and device is not ios', fakeAsync(() => {
      basePageComponent.isIos = jasmine.createSpy().and.returnValue(false);
      basePageComponent.ionViewWillEnter();
      expect(router.navigate).not.toHaveBeenCalled();
      flushMicrotasks();
    }));

    it('should allow user access if authenticated , is an ios device and is required', fakeAsync(() => {
      authenticationProvider.hasValidToken = jasmine
        .createSpy('authenticationProvider.hasValidToken')
        .and.returnValue(Promise.resolve(false));
      basePageComponent.ionViewWillEnter();
      flushMicrotasks();

      expect(router.navigate).not.toHaveBeenCalled();
    }));
    it('should not allow access if user is not authed, auth is required and is ios', fakeAsync(() => {
      basePageComponent.isIos = jasmine.createSpy().and.returnValue(true);
      authenticationProvider.hasValidToken = jasmine
        .createSpy('authenticationProvider.hasValidToken')
        .and.returnValue(Promise.resolve(false));
      authenticationProvider.isInUnAuthenticatedMode = jasmine
        .createSpy('authenticationProvider.isInUnAuthenticatedMode')
        .and.returnValue(false);

      basePageComponent.loginRequired = true;
      basePageComponent.ionViewWillEnter();
      flushMicrotasks();
      expect(router.navigate).toHaveBeenCalledWith([LOGIN_PAGE], {
        replaceUrl: true,
        state: {
          hasLoggedOut: false,
          invalidToken: true,
        },
      });
    }));
  });

  describe('isIos', () => {
    it('should return true if platform is ios', () => {
      platform.is = jasmine.createSpy('platform.is').and.returnValue(true);
      expect(basePageComponent.isIos()).toBe(true);
    });
    it('should return false if platform is not ios', () => {
      platform.is = jasmine.createSpy('platform.is').and.returnValue(false);
      expect(basePageComponent.isIos()).toBe(false);
    });
  });

  describe('logout()', () => {
    it('should try to logout when platform is ios', async () => {
      basePageComponent.isIos = jasmine.createSpy().and.returnValue(true);
      authenticationProvider.logout = jasmine
        .createSpy('authenticationProvider.logout')
        .and.returnValue(Promise.resolve());
      await basePageComponent.logout();
      expect(authenticationProvider.logout).toHaveBeenCalledTimes(1);
      expect(router.navigate).toHaveBeenCalledTimes(1);
      expect(router.navigate).toHaveBeenCalledWith([LOGIN_PAGE], {
        replaceUrl: true,
        state: {
          hasLoggedOut: true,
        },
      });
    });
    // @TODO MES-7133 fix intermittently failing test
    xit('should not try to logout when platform is not ios', async () => {
      basePageComponent.isIos = jasmine.createSpy().and.returnValue(false);
      await basePageComponent.logout();
      expect(authenticationProvider.logout).toHaveBeenCalledTimes(0);
      expect(router.navigate).toHaveBeenCalledTimes(0);
    });
  });

  describe('lockDevice', () => {
    beforeEach(() => {
      spyOn(ScreenOrientation, 'lock').and.returnValue(Promise.resolve());
      spyOn(Insomnia, 'keepAwake').and.returnValue(Promise.resolve());
    });

    it('should lock device and keep awake in practice mode, but not single app mode', async () => {
      basePageComponent.isIos = jasmine.createSpy().and.returnValue(true);

      await basePageComponent.lockDevice(true);

      expect(ScreenOrientation.lock).toHaveBeenCalledWith({ type: OrientationType.PORTRAIT_PRIMARY });
      expect(Insomnia.keepAwake).toHaveBeenCalled();
      expect(deviceProvider.enableSingleAppMode).not.toHaveBeenCalled();
    });
    it('should lock device, keep awake and call single app mode when not practice mode', async () => {
      basePageComponent.isIos = jasmine.createSpy().and.returnValue(true);

      spyOn(deviceProvider, 'enableSingleAppMode').and.returnValue(Promise.resolve(true));

      await basePageComponent.lockDevice(false);

      expect(ScreenOrientation.lock).toHaveBeenCalledWith({ type: OrientationType.PORTRAIT_PRIMARY });
      expect(Insomnia.keepAwake).toHaveBeenCalled();
      expect(deviceProvider.enableSingleAppMode).toHaveBeenCalled();
    });
    it('should capture thrown errors with page name and method', async () => {
      basePageComponent.isIos = jasmine.createSpy().and.returnValue(true);

      spyOn(deviceProvider, 'enableSingleAppMode').and.returnValue(Promise.reject(new Error('Thrown err')));

      await basePageComponent.lockDevice(false);

      expect(store$.dispatch).toHaveBeenCalled();
      expect(logHelper.createLog).toHaveBeenCalledWith(
        LogType.ERROR,
        'BasePageComponent => /test => lockDevice',
        jasmine.stringContaining('Thrown err')
      );
    });

    it('should not run logic for locking when not in iOS', async () => {
      basePageComponent.isIos = jasmine.createSpy().and.returnValue(false);

      await basePageComponent.lockDevice(false);

      expect(ScreenOrientation.lock).not.toHaveBeenCalled();
      expect(Insomnia.keepAwake).not.toHaveBeenCalled();
      expect(deviceProvider.enableSingleAppMode).not.toHaveBeenCalled();
      expect(store$.dispatch).not.toHaveBeenCalled();
    });
  });

  describe('unlockDevice', () => {
    beforeEach(() => {
      spyOn(ScreenOrientation, 'unlock').and.returnValue(Promise.resolve());
      spyOn(Insomnia, 'allowSleep').and.returnValue(Promise.resolve());
      spyOn(deviceProvider, 'disableSingleAppMode').and.returnValue(Promise.resolve(true));
    });

    it('should disable SAM, but if it fails then do not call unlock and sleep again', async () => {
      basePageComponent.isIos = jasmine.createSpy().and.returnValue(true);

      spyOn(deviceProvider, 'isSAMEnabled').and.returnValue(Promise.resolve(true));

      await basePageComponent.unlockDevice();

      expect(deviceProvider.disableSingleAppMode).toHaveBeenCalled();
      expect(ScreenOrientation.unlock).not.toHaveBeenCalledWith();
      expect(Insomnia.allowSleep).not.toHaveBeenCalled();
    });
    it('should call SAM, when that succeeds then call unlock and allow sleep', async () => {
      basePageComponent.isIos = jasmine.createSpy().and.returnValue(true);

      spyOn(deviceProvider, 'isSAMEnabled').and.returnValue(Promise.resolve(false));

      await basePageComponent.unlockDevice();

      expect(deviceProvider.disableSingleAppMode).toHaveBeenCalled();
      expect(ScreenOrientation.unlock).toHaveBeenCalledWith();
      expect(Insomnia.allowSleep).toHaveBeenCalled();
    });
    it('should capture thrown errors with page name and method', async () => {
      basePageComponent.isIos = jasmine.createSpy().and.returnValue(true);

      spyOn(deviceProvider, 'disableSingleAppMode').and.returnValue(Promise.reject(new Error('Thrown err')));

      await basePageComponent.unlockDevice();

      expect(store$.dispatch).toHaveBeenCalled();
      expect(logHelper.createLog).toHaveBeenCalledWith(
        LogType.ERROR,
        'BasePageComponent => /test => unlockDevice',
        jasmine.stringContaining('Thrown err')
      );
    });

    it('should not run logic for unlocking when not in iOS', async () => {
      basePageComponent.isIos = jasmine.createSpy().and.returnValue(false);

      await basePageComponent.unlockDevice();

      expect(ScreenOrientation.unlock).not.toHaveBeenCalled();
      expect(Insomnia.allowSleep).not.toHaveBeenCalled();
      expect(deviceProvider.disableSingleAppMode).not.toHaveBeenCalled();
      expect(store$.dispatch).not.toHaveBeenCalled();
    });
  });
});
