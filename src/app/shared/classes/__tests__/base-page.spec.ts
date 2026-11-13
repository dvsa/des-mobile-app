import { Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { KeepAwake as Insomnia } from '@capacitor-community/keep-awake';
import { OrientationType, ScreenOrientation } from '@capawesome/capacitor-screen-orientation';
import { ExitSamError } from '@components/common/test-flow-header/exit-sam.actions';
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
import { Subscription } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { unitTestErrorCause } from '../../../../test-setup.vitest';
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
      _routerState: {
        url: '/test',
      },
    } as Data,
  } as ActivatedRoute;

  beforeEach(() => {
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
    router.navigate = vi.fn().mockReturnValue(Promise.resolve(true));

    vi.spyOn(store$, 'dispatch').mockReturnValue(undefined);
    vi.spyOn(logHelper, 'createLog');

    class BasePageClass extends BasePageComponent {
      constructor(public inj: Injector) {
        super(inj);
      }
    }

    basePageComponent = new BasePageClass(injector);
  });

  afterEach(() => {
    basePageComponent.destroyLeaveAppSubscription();
    basePageComponent.destroyReturnToAppSubscription();
  });

  describe('ionViewWillEnter', () => {
    it('should allow user access if authentication is not required', async () => {
      vi.useFakeTimers();
      try {
        basePageComponent.loginRequired = false;
        basePageComponent.ionViewWillEnter();
        await vi.advanceTimersByTimeAsync(0);
        expect(router.navigate).not.toHaveBeenCalled();
      } finally {
        vi.useRealTimers();
      }
    });

    it('should allow user access if authentication is required and device is not ios', async () => {
      vi.useFakeTimers();
      try {
        basePageComponent.isIos = vi.fn().mockReturnValue(false);
        basePageComponent.ionViewWillEnter();
        expect(router.navigate).not.toHaveBeenCalled();
        await vi.advanceTimersByTimeAsync(0);
      } finally {
        vi.useRealTimers();
      }
    });

    it('should allow user access if authenticated , is an ios device and is required', async () => {
      vi.useFakeTimers();
      try {
        vi.spyOn(authenticationProvider, 'isAuthenticated').mockResolvedValue(false);
        basePageComponent.ionViewWillEnter();
        await vi.advanceTimersByTimeAsync(0);

        expect(router.navigate).not.toHaveBeenCalled();
      } finally {
        vi.useRealTimers();
      }
    });
    it('should not allow access if user is not authed, auth is required and is ios', async () => {
      vi.useFakeTimers();
      try {
        basePageComponent.isIos = vi.fn().mockReturnValue(true);

        vi.spyOn(authenticationProvider, 'isAuthenticated').mockResolvedValue(false);
        vi.spyOn(authenticationProvider, 'isOffline').mockReturnValue(false);

        basePageComponent.loginRequired = true;
        basePageComponent.ionViewWillEnter();
        await vi.advanceTimersByTimeAsync(0);
        expect(router.navigate).toHaveBeenCalledWith([LOGIN_PAGE], {
          replaceUrl: true,
          state: {
            hasLoggedOut: false,
            invalidToken: true,
          },
        });
      } finally {
        vi.useRealTimers();
      }
    });
  });

  describe('isIos', () => {
    it('should return true if platform is ios', () => {
      platform.is = vi.fn().mockReturnValue(true);
      expect(basePageComponent.isIos()).toBe(true);
    });
    it('should return false if platform is not ios', () => {
      platform.is = vi.fn().mockReturnValue(false);
      expect(basePageComponent.isIos()).toBe(false);
    });
  });

  describe('ionViewDidLeave', () => {
    it('should set escapeFromSam to false', () => {
      basePageComponent.ionViewDidLeave();
      expect(basePageComponent.isExitSAMBannerActivated).toBe(false);
    });
  });

  describe('logout()', () => {
    it('should try to logout when platform is ios', async () => {
      basePageComponent.isIos = vi.fn().mockReturnValue(true);
      vi.spyOn(authenticationProvider, 'logout');
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
    it('should not try to logout when platform is not ios', async () => {
      basePageComponent.isIos = vi.fn().mockReturnValue(false);
      await basePageComponent.logout();
      expect(authenticationProvider.logout).toHaveBeenCalledTimes(0);
      expect(router.navigate).toHaveBeenCalledTimes(0);
    });
  });

  describe('lockDevice', () => {
    beforeEach(() => {
      vi.spyOn(ScreenOrientation, 'lock').mockReturnValue(Promise.resolve());
      vi.spyOn(Insomnia, 'keepAwake').mockReturnValue(Promise.resolve());
    });

    it('should lock device and keep awake in practice mode, but not single app mode', async () => {
      basePageComponent.isIos = vi.fn().mockReturnValue(true);

      await basePageComponent.lockDevice(true);

      expect(ScreenOrientation.lock).toHaveBeenCalledWith({ type: OrientationType.PORTRAIT_PRIMARY });
      expect(Insomnia.keepAwake).toHaveBeenCalled();
      expect(deviceProvider.enableSingleAppMode).not.toHaveBeenCalled();
    });
    it('should lock device, keep awake and call single app mode when not practice mode', async () => {
      basePageComponent.isIos = vi.fn().mockReturnValue(true);

      vi.spyOn(deviceProvider, 'enableSingleAppMode').mockReturnValue(Promise.resolve(true));

      await basePageComponent.lockDevice(false);

      expect(ScreenOrientation.lock).toHaveBeenCalledWith({ type: OrientationType.PORTRAIT_PRIMARY });
      expect(Insomnia.keepAwake).toHaveBeenCalled();
      expect(deviceProvider.enableSingleAppMode).toHaveBeenCalled();
    });
    it('should capture thrown errors with page name and method', async () => {
      basePageComponent.isIos = vi.fn().mockReturnValue(true);

      vi.spyOn(deviceProvider, 'enableSingleAppMode').mockReturnValue(
        Promise.reject(new Error('Thrown err', { cause: unitTestErrorCause }))
      );

      await basePageComponent.lockDevice(false);

      expect(store$.dispatch).toHaveBeenCalled();
      expect(logHelper.createLog).toHaveBeenCalledWith(
        LogType.ERROR,
        'BasePageComponent => /test => lockDevice',
        expect.stringContaining('Thrown err')
      );
    });

    it('should not run logic for locking when not in iOS', async () => {
      basePageComponent.isIos = vi.fn().mockReturnValue(false);

      await basePageComponent.lockDevice(false);

      expect(ScreenOrientation.lock).not.toHaveBeenCalled();
      expect(Insomnia.keepAwake).not.toHaveBeenCalled();
      expect(deviceProvider.enableSingleAppMode).not.toHaveBeenCalled();
      expect(store$.dispatch).not.toHaveBeenCalled();
    });
  });

  describe('unlockDevice', () => {
    beforeEach(() => {
      vi.spyOn(ScreenOrientation, 'unlock').mockReturnValue(Promise.resolve());
      vi.spyOn(Insomnia, 'allowSleep').mockReturnValue(Promise.resolve());
      vi.spyOn(deviceProvider, 'disableSingleAppMode').mockReturnValue(Promise.resolve(true));
    });

    it('should disable SAM, but if it fails then do not call unlock and sleep again', async () => {
      basePageComponent.isIos = vi.fn().mockReturnValue(true);

      vi.spyOn(deviceProvider, 'isSAMEnabled').mockReturnValue(Promise.resolve(true));

      await basePageComponent.unlockDevice();

      expect(deviceProvider.disableSingleAppMode).toHaveBeenCalled();
      expect(ScreenOrientation.unlock).not.toHaveBeenCalledWith();
      expect(Insomnia.allowSleep).not.toHaveBeenCalled();
    });
    it('should call SAM, when that succeeds then call unlock and allow sleep', async () => {
      basePageComponent.isIos = vi.fn().mockReturnValue(true);

      vi.spyOn(deviceProvider, 'isSAMEnabled').mockReturnValue(Promise.resolve(false));

      await basePageComponent.unlockDevice();

      expect(deviceProvider.disableSingleAppMode).toHaveBeenCalled();
      expect(ScreenOrientation.unlock).toHaveBeenCalledWith();
      expect(Insomnia.allowSleep).toHaveBeenCalled();
    });
    it('should capture thrown errors with page name and method', async () => {
      basePageComponent.isIos = vi.fn().mockReturnValue(true);

      vi.spyOn(deviceProvider, 'disableSingleAppMode').mockReturnValue(
        Promise.reject(new Error('Thrown err', { cause: unitTestErrorCause }))
      );

      await basePageComponent.unlockDevice();

      expect(store$.dispatch).toHaveBeenCalled();
      expect(logHelper.createLog).toHaveBeenCalledWith(
        LogType.ERROR,
        'BasePageComponent => /test => unlockDevice',
        expect.stringContaining('Thrown err')
      );
    });

    it('should not run logic for unlocking when not in iOS', async () => {
      basePageComponent.isIos = vi.fn().mockReturnValue(false);

      await basePageComponent.unlockDevice();

      expect(ScreenOrientation.unlock).not.toHaveBeenCalled();
      expect(Insomnia.allowSleep).not.toHaveBeenCalled();
      expect(deviceProvider.disableSingleAppMode).not.toHaveBeenCalled();
      expect(store$.dispatch).not.toHaveBeenCalled();
    });
  });
  describe('reEnableSingleAppMode', () => {
    it('should dispatch ExitSamError if enabling single app mode fails', async () => {
      vi.spyOn(deviceProvider, 'enableSingleAppMode').mockReturnValue(Promise.resolve(false));
      await basePageComponent.reEnableSingleAppMode();
      expect(store$.dispatch).toHaveBeenCalledWith(ExitSamError('Could not enable single app mode', false));
    });

    it('should dispatch ExitSamError if an error occurs while enabling single app mode', async () => {
      vi.spyOn(deviceProvider, 'enableSingleAppMode').mockReturnValue(Promise.reject('Error'));
      await basePageComponent.reEnableSingleAppMode();
      expect(store$.dispatch).toHaveBeenCalledWith(ExitSamError('Enable single app mode error', 'Error'));
    });
  });

  describe('setupEscapeSAMLeaveSubscription', () => {
    it('should set up a subscription to the platform pause event if there is not already one', () => {
      basePageComponent.leaveAppSubscription = null;
      vi.spyOn(platform.pause, 'subscribe');
      basePageComponent.setupEscapeSAMLeaveSubscription();
      expect(platform.pause.subscribe).toHaveBeenCalled();
      expect(basePageComponent.leaveAppSubscription).not.toBeNull();
    });
    it('should not set up a subscription to the platform pause event if there is already one', () => {
      basePageComponent.leaveAppSubscription = new Subscription();
      vi.spyOn(platform.pause, 'subscribe');
      basePageComponent.setupEscapeSAMLeaveSubscription();
      expect(platform.pause.subscribe).not.toHaveBeenCalled();
    });
  });

  describe('setupEscapeSAMResumeSubscription', () => {
    it('should set up a subscription to the platform resume event if there is not already one', () => {
      basePageComponent.returnToAppSubscription = null;
      vi.spyOn(platform.resume, 'subscribe');
      basePageComponent.setupEscapeSAMResumeSubscription();
      expect(platform.resume.subscribe).toHaveBeenCalled();
    });
    it('should not set up a subscription to the platform resume event if there is already one', () => {
      basePageComponent.returnToAppSubscription = new Subscription();
      vi.spyOn(platform.resume, 'subscribe');
      basePageComponent.setupEscapeSAMLeaveSubscription();
      expect(platform.resume.subscribe).not.toHaveBeenCalled();
    });

    it('returnToAppSubscription should have a value', async () => {
      vi.spyOn(basePageComponent, 'reEnableSingleAppMode').mockReturnValue(Promise.resolve());
      basePageComponent.setupEscapeSAMResumeSubscription();
      expect(basePageComponent.returnToAppSubscription).not.toBeNull();
    });
  });

  describe('destroyReturnToAppSubscription', () => {
    it('should unsubscribe and nullify returnToAppSubscription', () => {
      basePageComponent.returnToAppSubscription = new Subscription();
      basePageComponent.destroyReturnToAppSubscription();
      expect(basePageComponent.returnToAppSubscription).toBeNull();
    });
  });

  describe('destroyLeaveAppSubscription', () => {
    it('should unsubscribe and nullify leaveAppSubscription', () => {
      basePageComponent.leaveAppSubscription = new Subscription();
      basePageComponent.destroyLeaveAppSubscription();
      expect(basePageComponent.leaveAppSubscription).toBeNull();
    });
  });

  describe('ionViewDidLeave', () => {
    it('should re-enable single app mode and destroy leaveAppSubscription if active', async () => {
      basePageComponent.leaveAppSubscription = new Subscription();
      vi.spyOn(basePageComponent, 'reEnableSingleAppMode').mockReturnValue(Promise.resolve());
      vi.spyOn(basePageComponent, 'destroyLeaveAppSubscription').mockReturnValue(undefined);
      basePageComponent.ionViewDidLeave();
      expect(basePageComponent.reEnableSingleAppMode).toHaveBeenCalled();
      expect(basePageComponent.destroyLeaveAppSubscription).toHaveBeenCalled();
    });

    it('should set isExitSAMBannerActivated to false', () => {
      basePageComponent.ionViewDidLeave();
      expect(basePageComponent.isExitSAMBannerActivated).toBe(false);
    });
  });
});
