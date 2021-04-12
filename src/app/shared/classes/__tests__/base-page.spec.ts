import {
  async, fakeAsync, flushMicrotasks, TestBed,
} from '@angular/core/testing';
import { Platform } from '@ionic/angular';
import { configureTestSuite } from 'ng-bullet';
import { Router } from '@angular/router';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { LOGIN_PAGE } from '@pages/page-names.constants';

import { BasePageComponent } from '../base-page';
import { RouterMock } from '../../../../../mock/angular-mocks/router-mock';
import { PlatformMock } from '../../../../../mock/ionic-mocks/platform-mock';

describe('Base Page', () => {

  let platform: Platform;
  let authenticationProvider: AuthenticationProvider;
  let router: Router;

  let basePageComponent: BasePageComponent;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Platform, useClass: PlatformMock },
        { provide: AuthenticationProvider, useClass: AuthenticationProviderMock },
        { provide: Router, useClass: RouterMock },
      ],
    });
  });

  beforeEach(async(() => {

    platform = TestBed.inject(Platform);
    authenticationProvider = TestBed.inject(AuthenticationProvider);
    router = TestBed.inject(Router);
    router.navigate = jasmine.createSpy().and.returnValue(Promise.resolve(true));

    class BasePageClass extends BasePageComponent {
      constructor(
        plat: Platform,
        auth: AuthenticationProvider,
        rout: Router,
      ) {
        super(plat, auth, rout);
      }
    }

    basePageComponent = new BasePageClass(platform, authenticationProvider, router);
  }));

  describe('ionViewWillEnter()', () => {
    it('should allow user access if authentication is not required', fakeAsync(() => {
      basePageComponent.loginRequired = false;
      basePageComponent.ionViewWillEnter();
      expect(router.navigate).not.toHaveBeenCalled();
      flushMicrotasks();
    }));

    it('should allow user access if authentication is required and device is not ios', fakeAsync(() => {
      basePageComponent.isIos = jasmine.createSpy().and.returnValue(false);
      basePageComponent.ionViewWillEnter();
      expect(router.navigate).not.toHaveBeenCalled();
      flushMicrotasks();
    }));

    it('should allow user access if authenticated , is an ios device and is required', fakeAsync(() => {
      authenticationProvider.hasValidToken = jasmine.createSpy(
        'authenticationProvider.hasValidToken',
      )
        .and.returnValue(Promise.resolve(false));
      basePageComponent.ionViewWillEnter();
      expect(router.navigate).not.toHaveBeenCalled();
      flushMicrotasks();
    }));
    // tslint:disable-next-line:max-line-length
    it('should not allow access if user is not authd, auth is required and is ios', fakeAsync(() => {
      basePageComponent.isIos = jasmine.createSpy().and.returnValue(true);
      authenticationProvider.hasValidToken = jasmine.createSpy('authenticationProvider.hasValidToken')
        .and.returnValue(Promise.resolve(false));
      authenticationProvider.isInUnAuthenticatedMode = jasmine
        .createSpy('authenticationProvider.isInUnAuthenticatedMode')
        .and.returnValue(false);

      basePageComponent.loginRequired = true;
      basePageComponent.ionViewWillEnter();
      flushMicrotasks();
      expect(router.navigate).toHaveBeenCalledWith([LOGIN_PAGE]);
    }));

  });

  describe('isIos()', () => {
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
      authenticationProvider.logout = jasmine.createSpy('authenticationProvider.logout')
        .and.returnValue(Promise.resolve());
      await basePageComponent.logout();
      expect(authenticationProvider.logout).toHaveBeenCalledTimes(1);
      expect(router.navigate).toHaveBeenCalledTimes(1);
      expect(router.navigate).toHaveBeenCalledWith([LOGIN_PAGE], {
        state: {
          hasLoggedOut: true,
        },
      });
    });
    // @TODO fix intermittently failing test
    xit('should not try to logout when platform is not ios', async () => {
      basePageComponent.isIos = jasmine.createSpy().and.returnValue(false);
      await basePageComponent.logout();
      expect(authenticationProvider.logout).toHaveBeenCalledTimes(0);
      expect(router.navigate).toHaveBeenCalledTimes(0);
    });
  });

});
