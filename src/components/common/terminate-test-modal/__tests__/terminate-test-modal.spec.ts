import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {
  Config, IonicModule, NavController, NavParams, Platform,
} from '@ionic/angular';
import {
  ConfigMock, NavControllerMock, NavParamsMock, PlatformMock,
} from 'ionic-mocks';
import { configureTestSuite } from 'ng-bullet';
import { By } from '@angular/platform-browser';

import { AuthenticationProvider } from '@providers/authentication/authentication';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { DateTimeProviderMock } from '@providers/date-time/__mocks__/date-time.mock';
import { DeviceAuthenticationProvider } from '@providers/device-authentication/device-authentication';
import {
  DeviceAuthenticationProviderMock,
} from '@providers/device-authentication/__mocks__/device-authentication.mock';
import { AppModule } from '@app/app.module';
import { TerminateTestModal } from '../terminate-test-modal';

describe('TerminateTestModal', () => {
  let fixture: ComponentFixture<TerminateTestModal>;
  let component: TerminateTestModal;
  let deviceAuthenticationProvider: DeviceAuthenticationProvider;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [TerminateTestModal],
      imports: [IonicModule, AppModule],
      providers: [
        { provide: NavController, useFactory: () => NavControllerMock.instance() },
        { provide: NavParams, useFactory: () => NavParamsMock.instance() },
        { provide: Config, useFactory: () => ConfigMock.instance() },
        { provide: Platform, useFactory: () => PlatformMock.instance() },
        { provide: AuthenticationProvider, useClass: AuthenticationProviderMock },
        { provide: DateTimeProvider, useClass: DateTimeProviderMock },
        { provide: DeviceAuthenticationProvider, useClass: DeviceAuthenticationProviderMock },
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(TerminateTestModal);
    component = fixture.componentInstance;
    deviceAuthenticationProvider = TestBed.inject(DeviceAuthenticationProvider);
    component.onTerminate = jasmine.createSpy('onTerminate');
    component.onCancel = jasmine.createSpy('onCancel');
  }));

  describe('DOM', () => {
    it('should call the provided onCancel function when returning to the test', () => {
      const returnButton = fixture.debugElement.query(By.css('.return-button'));
      returnButton.triggerEventHandler('click', null);
      expect(component.onCancel)
        .toHaveBeenCalled();
    });
    it('should call the provided onTerminate function when confirming test termination', () => {
      spyOn(component, 'terminationWrapper');
      const terminateButton = fixture.debugElement.query(By.css('.terminate-button'));
      terminateButton.triggerEventHandler('click', null);
      expect(component.terminationWrapper)
        .toHaveBeenCalled();
    });
  });

  describe('Class', () => {
    describe('terminationWrapper', () => {
      it('should trigger the lock screen', async () => {
        spyOn(deviceAuthenticationProvider, 'triggerLockScreen').and.returnValue(Promise.resolve(true));
        component.shouldAuthenticate = true;
        await component.terminationWrapper();
        expect(deviceAuthenticationProvider.triggerLockScreen).toHaveBeenCalled();
      });
      it('should not call the onTerminate callback when the lock screen Promise rejects', async () => {
        component.shouldAuthenticate = true;
        deviceAuthenticationProvider.triggerLockScreen = jasmine.createSpy('triggerLockScreen')
          .and
          .callFake(() => Promise.reject(new Error('err')));
        await component.terminationWrapper();
        expect(component.onTerminate).not.toHaveBeenCalled();
      });
      it('should call the onTerminate callback when the lock screen Promise resolves', async () => {
        component.shouldAuthenticate = true;
        deviceAuthenticationProvider.triggerLockScreen = jasmine.createSpy('triggerLockScreen')
          .and
          .returnValue(Promise.resolve('y'));
        await component.terminationWrapper();
        expect(component.onTerminate).toHaveBeenCalled();
      });
      it('should not trigger the lock screen if shouldAuthenticate equals false', async () => {
        component.shouldAuthenticate = false;
        deviceAuthenticationProvider.triggerLockScreen = jasmine.createSpy('triggerLockScreen');
        const result = await component.terminationWrapper();
        expect(result).toEqual(undefined);
        expect(deviceAuthenticationProvider.triggerLockScreen).not.toHaveBeenCalled();
      });
    });
  });
});
