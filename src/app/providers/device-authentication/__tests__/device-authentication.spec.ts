import { TestBed } from '@angular/core/testing';
import { environment } from '@environments/environment';
import { TestersEnvironmentFile } from '@environments/models/environment.model';
import { Platform } from '@ionic/angular';
import { NativeBiometricMock } from '@mocks/@capacitor/biometrics';
import { PlatformMock } from '@mocks/ionic-mocks/platform-mock';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { DeviceProviderMock } from '@providers/device/__mocks__/device.mock';
import { DeviceProvider } from '@providers/device/device';
import { LoaderProviderMock } from '@providers/loader/__mocks__/loader.mock';
import { LoadingProvider } from '@providers/loader/loader';
import { LogHelperMock } from '@providers/logs/__mocks__/logs-helper.mock';
import { LogHelper } from '@providers/logs/logs-helper';
import { AppConfigProviderMock } from '../../app-config/__mocks__/app-config.mock';
import { AppConfigProvider } from '../../app-config/app-config';
import { AppConfig } from '../../app-config/app-config.model';
import { DeviceAuthenticationProvider } from '../device-authentication';

describe('DeviceAuthenticationProvider', () => {
  let deviceAuthenticationProvider: DeviceAuthenticationProvider;
  let platform: Platform;
  let loadingProvider: LoadingProvider;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DeviceAuthenticationProvider,
        { provide: Store, useClass: MockStore },
        provideMockStore({}),
        {
          provide: LogHelper,
          useClass: LogHelperMock,
        },
        {
          provide: DeviceProvider,
          useClass: DeviceProviderMock,
        },
        {
          provide: Platform,
          useClass: PlatformMock,
        },
        {
          provide: AppConfigProvider,
          useClass: AppConfigProviderMock,
        },
        {
          provide: LoadingProvider,
          useClass: LoaderProviderMock,
        },
      ],
    });

    deviceAuthenticationProvider = TestBed.inject(DeviceAuthenticationProvider);
    platform = TestBed.inject(Platform);
    loadingProvider = TestBed.inject(LoadingProvider);

    spyOn(loadingProvider, 'handleUILoading').and.returnValue(Promise.resolve());
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

    it('should not trigger lock screen if the examiner role check is checked and is a DLG user', async () => {
      spyOn(deviceAuthenticationProvider.appConfig, 'getAppConfig').and.returnValue({ role: 'DLG' } as AppConfig);
      spyOn(NativeBiometricMock, 'verifyIdentity');
      await deviceAuthenticationProvider.triggerLockScreen();
      expect(NativeBiometricMock.verifyIdentity).not.toHaveBeenCalled();
    });

    it('should not trigger lock screen if environment file has isTest set to true', async () => {
      spyOn(deviceAuthenticationProvider.appConfig, 'getAppConfig').and.returnValue({ role: 'DLG' } as AppConfig);
      (environment as unknown as TestersEnvironmentFile).isTest = true;
      spyOn(NativeBiometricMock, 'verifyIdentity');
      await deviceAuthenticationProvider.triggerLockScreen();
      expect(NativeBiometricMock.verifyIdentity).not.toHaveBeenCalled();
    });

    it('should not trigger lock screen if environment file has isTest set to true', async () => {
      spyOn(deviceAuthenticationProvider.appConfig, 'getAppConfig').and.returnValue({ role: 'DLG' } as AppConfig);
      (environment as unknown as TestersEnvironmentFile).isTest = false;
      spyOn(NativeBiometricMock, 'verifyIdentity');
      await deviceAuthenticationProvider.triggerLockScreen();
      expect(NativeBiometricMock.verifyIdentity).not.toHaveBeenCalled();
    });
  });
});
