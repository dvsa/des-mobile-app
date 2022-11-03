import { TestBed } from '@angular/core/testing';
import { Platform } from '@ionic/angular';
import { configureTestSuite } from 'ng-bullet';
import { PlatformMock } from '@mocks/ionic-mocks/platform-mock';
import { TestersEnvironmentFile } from '@environments/models/environment.model';
import { environment } from '@environments/environment';
import { NativeBiometricMock } from '@mocks/@capacitor/biometrics';
import { DeviceAuthenticationProvider } from '../device-authentication';
import { AppConfigProvider } from '../../app-config/app-config';
import { AppConfigProviderMock } from '../../app-config/__mocks__/app-config.mock';
import { AppConfig } from '../../app-config/app-config.model';

describe('DeviceAuthenticationProvider', () => {
  let deviceAuthenticationProvider: DeviceAuthenticationProvider;
  let platform: Platform;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        DeviceAuthenticationProvider,
        { provide: Platform, useClass: PlatformMock },
        { provide: AppConfigProvider, useClass: AppConfigProviderMock },
      ],
    });
  });

  beforeEach(() => {
    deviceAuthenticationProvider = TestBed.inject(DeviceAuthenticationProvider);
    platform = TestBed.inject(Platform);

    spyOn(platform, 'ready').and.returnValue(Promise.resolve(''));
    spyOn(platform, 'is').and.returnValue(true);
    spyOn(deviceAuthenticationProvider.appConfig, 'getAppConfig').and.returnValue({ role: 'DE' } as AppConfig);
    (environment as unknown as TestersEnvironmentFile).isTest = false;

    spyOn(NativeBiometricMock, 'isAvailable');

    (NativeBiometricMock.isAvailable as any)
      .withArgs({ key: 'useFallback' })
      .and.returnValue(Promise.resolve({ value: { available: true } }));
  });

  describe('triggerLockScreen', () => {
    it('should call through to verifyIdentity when available', async () => {
      try {
        await deviceAuthenticationProvider.triggerLockScreen();
        expect(NativeBiometricMock.isAvailable).toHaveBeenCalledWith({ useFallback: true });
        expect(NativeBiometricMock.verifyIdentity).toHaveBeenCalled();
      } catch (err) {
        console.error(err);
      }
    });

    it('should resolve to false if the examiner role check is checked and is a DLG user', async () => {
      spyOn(deviceAuthenticationProvider.appConfig, 'getAppConfig').and.returnValue({ role: 'DLG' } as AppConfig);
      const result = await deviceAuthenticationProvider.triggerLockScreen();
      expect(result).toBe(false);
    });

    it('should resolve to false if environment file has isTest set to true', async () => {
      spyOn(deviceAuthenticationProvider.appConfig, 'getAppConfig').and.returnValue({ role: 'DLG' } as AppConfig);
      (environment as unknown as TestersEnvironmentFile).isTest = true;
      const result = await deviceAuthenticationProvider.triggerLockScreen();
      expect(result).toEqual(false);
    });

    it('should resolve to false if environment file has isTest set to true', async () => {
      spyOn(deviceAuthenticationProvider.appConfig, 'getAppConfig').and.returnValue({ role: 'DLG' } as AppConfig);
      (environment as unknown as TestersEnvironmentFile).isTest = false;
      const result = await deviceAuthenticationProvider.triggerLockScreen();
      expect(result).toEqual(false);
    });
  });

});
