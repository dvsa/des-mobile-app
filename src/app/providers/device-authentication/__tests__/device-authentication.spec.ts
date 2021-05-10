import { TestBed } from '@angular/core/testing';
import { Platform } from '@ionic/angular';
import { configureTestSuite } from 'ng-bullet';
import { PlatformMock } from '@mocks/ionic-mocks/platform-mock';
import { DeviceAuthenticationProvider } from '../device-authentication';
import { AppConfigProvider } from '../../app-config/app-config';
import { AppConfigProviderMock } from '../../app-config/__mocks__/app-config.mock';
import { AppConfig } from '../../app-config/app-config.model';

describe('Device Authentication Provider', () => {

  let deviceAuthenticationProvider: DeviceAuthenticationProvider;

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
  });

  describe('triggerLockScreen', () => {
    it('should return true when successfully authenticated', async () => {
      const result = await deviceAuthenticationProvider.triggerLockScreen();
      expect(result).toBe(true);
    });

    it('should resolve immediately if the examiner role check passes', async () => {
      spyOn(deviceAuthenticationProvider.appConfig, 'getAppConfig').and.returnValue({ role: 'DLG' } as AppConfig);
      const result = await deviceAuthenticationProvider.triggerLockScreen();
      expect(result).toBe(false);
    });
  });

});
