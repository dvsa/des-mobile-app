import { fakeAsync, flushMicrotasks, TestBed, waitForAsync } from '@angular/core/testing';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { RouterMock } from '@mocks/angular-mocks/router-mock';
import { PlatformMock } from '@mocks/ionic-mocks/platform-mock';
import { BasePageComponent } from '../base-page';
import { Injector } from '@angular/core';
import { LOGIN_PAGE } from '@pages/page-names.constants';

describe('BasePageComponent', () => {
  let platform: Platform;
  let authenticationProvider: AuthenticationProvider;
  let injector: Injector;
  let router: Router;
  let basePageComponent: BasePageComponent;

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
      ],
    });

    platform = TestBed.inject(Platform);
    injector = TestBed.inject(Injector);
    authenticationProvider = TestBed.inject(AuthenticationProvider);
    router = TestBed.inject(Router);
    router.navigate = jasmine.createSpy()
      .and
      .returnValue(Promise.resolve(true));

    class BasePageClass extends BasePageComponent {
      constructor(inj: Injector) {
        super(inj);
      }
    }

    basePageComponent = new BasePageClass(injector);
  }));

  describe('ionViewWillEnter()', () => {
    it('should allow user access if authentication is not required', fakeAsync(() => {
      basePageComponent.loginRequired = false;
      basePageComponent.ionViewWillEnter();
      expect(router.navigate)
        .not
        .toHaveBeenCalled();
      flushMicrotasks();
    }));

    it('should allow user access if authentication is required and device is not ios', fakeAsync(() => {
      basePageComponent.isIos = jasmine.createSpy()
        .and
        .returnValue(false);
      basePageComponent.ionViewWillEnter();
      expect(router.navigate)
        .not
        .toHaveBeenCalled();
      flushMicrotasks();
    }));

    it('should allow user access if authenticated , is an ios device and is required', fakeAsync(() => {
      authenticationProvider.hasValidToken = jasmine.createSpy(
        'authenticationProvider.hasValidToken',
      )
        .and
        .returnValue(Promise.resolve(false));
      basePageComponent.ionViewWillEnter();
      expect(router.navigate)
        .not
        .toHaveBeenCalled();
      flushMicrotasks();
    }));
    it('should not allow access if user is not authd, auth is required and is ios', fakeAsync(() => {
      basePageComponent.isIos = jasmine.createSpy()
        .and
        .returnValue(true);
      authenticationProvider.hasValidToken = jasmine.createSpy('authenticationProvider.hasValidToken')
        .and
        .returnValue(Promise.resolve(false));
      authenticationProvider.isInUnAuthenticatedMode = jasmine
        .createSpy('authenticationProvider.isInUnAuthenticatedMode')
        .and
        .returnValue(false);

      basePageComponent.loginRequired = true;
      basePageComponent.ionViewWillEnter();
      flushMicrotasks();
      expect(router.navigate)
        .toHaveBeenCalledWith([LOGIN_PAGE], { replaceUrl: true });
    }));

  });

  describe('isIos', () => {
    it('should return true if platform is ios', () => {
      platform.is = jasmine.createSpy('platform.is')
        .and
        .returnValue(true);
      expect(basePageComponent.isIos())
        .toBe(true);
    });
    it('should return false if platform is not ios', () => {
      platform.is = jasmine.createSpy('platform.is')
        .and
        .returnValue(false);
      expect(basePageComponent.isIos())
        .toBe(false);
    });
  });

  describe('logout()', () => {
    it('should try to logout when platform is ios', async () => {
      basePageComponent.isIos = jasmine.createSpy()
        .and
        .returnValue(true);
      authenticationProvider.logout = jasmine.createSpy('authenticationProvider.logout')
        .and
        .returnValue(Promise.resolve());
      await basePageComponent.logout();
      expect(authenticationProvider.logout)
        .toHaveBeenCalledTimes(1);
      expect(router.navigate)
        .toHaveBeenCalledTimes(1);
      expect(router.navigate)
        .toHaveBeenCalledWith([LOGIN_PAGE], {
          replaceUrl: true,
          state: {
            hasLoggedOut: true,
          },
        });
    });
    // @TODO MES-7133 fix intermittently failing test
    xit('should not try to logout when platform is not ios', async () => {
      basePageComponent.isIos = jasmine.createSpy()
        .and
        .returnValue(false);
      await basePageComponent.logout();
      expect(authenticationProvider.logout)
        .toHaveBeenCalledTimes(0);
      expect(router.navigate)
        .toHaveBeenCalledTimes(0);
    });
  });

});
