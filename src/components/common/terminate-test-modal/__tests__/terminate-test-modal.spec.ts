import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NavController, Platform } from '@ionic/angular';
import { NavControllerMock, PlatformMock } from '@mocks/index.mock';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { DateTimeProviderMock } from '@providers/date-time/__mocks__/date-time.mock';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { DeviceAuthenticationProviderMock } from '@providers/device-authentication/__mocks__/device-authentication.mock';
import { DeviceAuthenticationProvider } from '@providers/device-authentication/device-authentication';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TerminateTestModal } from '../terminate-test-modal';

describe('TerminateTestModal', () => {
  let fixture: ComponentFixture<TerminateTestModal>;
  let component: TerminateTestModal;
  let deviceAuthenticationProvider: DeviceAuthenticationProvider;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TerminateTestModal],
      providers: [
        { provide: NavController, useClass: NavControllerMock },
        { provide: Platform, useClass: PlatformMock },
        { provide: AuthenticationProvider, useClass: AuthenticationProviderMock },
        { provide: DateTimeProvider, useClass: DateTimeProviderMock },
        { provide: DeviceAuthenticationProvider, useClass: DeviceAuthenticationProviderMock },
      ],
    });

    fixture = TestBed.createComponent(TerminateTestModal);
    component = fixture.componentInstance;
    deviceAuthenticationProvider = TestBed.inject(DeviceAuthenticationProvider);
    component.onTerminate = vi.fn();
    component.onCancel = vi.fn();
  });

  describe('DOM', () => {
    it('should call the provided onCancel function when returning to the test', () => {
      const returnButton = fixture.debugElement.query(By.css('.return-button'));
      returnButton.triggerEventHandler('click', null);
      expect(component.onCancel).toHaveBeenCalled();
    });
    it('should call the provided onTerminate function when confirming test termination', () => {
      vi.spyOn(component, 'terminationWrapper').mockReturnValue(undefined);
      const terminateButton = fixture.debugElement.query(By.css('.terminate-button'));
      terminateButton.triggerEventHandler('click', null);
      expect(component.terminationWrapper).toHaveBeenCalled();
    });
  });

  describe('Class', () => {
    describe('terminationWrapper', () => {
      it('should trigger the lock screen', async () => {
        deviceAuthenticationProvider.triggerLockScreen = vi.fn().mockReturnValue(Promise.resolve(true));
        component.shouldAuthenticate = true;
        await component.terminationWrapper();
        expect(deviceAuthenticationProvider.triggerLockScreen).toHaveBeenCalled();
      });
      it('should not call the onTerminate callback when the lock screen returns false', async () => {
        deviceAuthenticationProvider.triggerLockScreen = vi.fn().mockReturnValue(Promise.resolve(false));
        component.shouldAuthenticate = true;
        await component.terminationWrapper();
        expect(component.onTerminate).not.toHaveBeenCalled();
      });
      it('should call the onTerminate callback when the lock screen returns true', async () => {
        deviceAuthenticationProvider.triggerLockScreen = vi.fn().mockReturnValue(Promise.resolve(true));
        component.shouldAuthenticate = true;
        await component.terminationWrapper();
        expect(component.onTerminate).toHaveBeenCalled();
      });
      it('should not trigger the lock screen if shouldAuthenticate equals false', async () => {
        deviceAuthenticationProvider.triggerLockScreen = vi.fn();
        component.shouldAuthenticate = false;
        const result = await component.terminationWrapper();
        expect(result).toEqual(undefined);
        expect(deviceAuthenticationProvider.triggerLockScreen).not.toHaveBeenCalled();
      });
    });
  });
});
