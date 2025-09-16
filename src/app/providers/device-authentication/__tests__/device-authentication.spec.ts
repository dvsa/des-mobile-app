import { TestBed } from '@angular/core/testing';
import { Platform } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { ExaminerRole } from '@providers/app-config/constants/examiner-role.constants';
import { DeviceProvider } from '@providers/device/device';
import { LoadingProvider } from '@providers/loader/loader';
import { LogHelper } from '@providers/logs/logs-helper';
import { LogType } from '@shared/models/log.model';
import { SaveLog } from '@store/logs/logs.actions';
import { NativeBiometric } from 'capacitor-native-biometric';
import { DeviceAuthenticationProvider } from '../device-authentication';

describe('DeviceAuthenticationProvider', () => {
  let deviceAuthenticationProvider: DeviceAuthenticationProvider;
  let platform: Platform;
  let store: MockStore;
  let logHelper: LogHelper;
  let deviceProvider: DeviceProvider;
  let loadingProvider: LoadingProvider;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DeviceAuthenticationProvider,
        provideMockStore(),
        { provide: Platform, useValue: { ready: jasmine.createSpy(), is: jasmine.createSpy() } },
        { provide: AppConfigProvider, useValue: { getAppConfig: jasmine.createSpy() } },
        {
          provide: DeviceProvider,
          useValue: { disableSingleAppMode: jasmine.createSpy(), enableSingleAppMode: jasmine.createSpy() },
        },
        { provide: LoadingProvider, useValue: { handleUILoading: jasmine.createSpy() } },
        { provide: LogHelper, useValue: { createLog: jasmine.createSpy() } },
      ],
    });

    deviceAuthenticationProvider = TestBed.inject(DeviceAuthenticationProvider);
    platform = TestBed.inject(Platform);
    store = TestBed.inject(Store) as MockStore;
    logHelper = TestBed.inject(LogHelper);
    deviceProvider = TestBed.inject(DeviceProvider);
    loadingProvider = TestBed.inject(LoadingProvider);

    spyOn(store, 'dispatch');
  });

  describe('triggerLockScreen', () => {
    it('should bypass device authentication if platform is not cordova', async () => {
      (platform.is as jasmine.Spy).and.returnValue(false);
      await deviceAuthenticationProvider.triggerLockScreen();
      expect(platform.is).toHaveBeenCalledWith('cordova');
    });

    it('should bypass device authentication if role is DLG', async () => {
      (platform.is as jasmine.Spy).and.returnValue(true);
      (deviceAuthenticationProvider.appConfig.getAppConfig as jasmine.Spy).and.returnValue({ role: ExaminerRole.DLG });
      await deviceAuthenticationProvider.triggerLockScreen();
      expect(deviceAuthenticationProvider.appConfig.getAppConfig).toHaveBeenCalled();
    });

    it('should call performBiometricVerification if conditions are met', async () => {
      spyOn(deviceAuthenticationProvider as any, 'performBiometricVerification').and.returnValue(Promise.resolve());
      (platform.is as jasmine.Spy).and.returnValue(true);
      (deviceAuthenticationProvider.appConfig.getAppConfig as jasmine.Spy).and.returnValue({ role: 'DE' });
      await deviceAuthenticationProvider.triggerLockScreen();
      expect(deviceAuthenticationProvider.performBiometricVerification).toHaveBeenCalled();
    });

    it('should log an error if an exception occurs', async () => {
      const error = new Error('Test error');
      spyOn(deviceAuthenticationProvider as any, 'performBiometricVerification').and.throwError(error);
      spyOn(deviceAuthenticationProvider, 'logEvent');
      try {
        await deviceAuthenticationProvider.triggerLockScreen();
      } catch (err) {
        expect(deviceAuthenticationProvider.logEvent).toHaveBeenCalledWith(error);
      }
    });
  });

  describe('performBiometricVerification', () => {
    it('should disable single app mode and enable it again if not in practice mode', async () => {
      spyOn(deviceProvider, 'disableSingleAppMode').and.returnValue(Promise.resolve(true));
      spyOn(deviceProvider, 'enableSingleAppMode').and.returnValue(Promise.resolve(true));
      spyOn(loadingProvider, 'handleUILoading').and.returnValue(Promise.resolve());
      spyOn(NativeBiometric, 'verifyIdentity').and.returnValue(Promise.resolve());

      await deviceAuthenticationProvider.performBiometricVerification(false);

      expect(deviceProvider.disableSingleAppMode).toHaveBeenCalled();
      expect(NativeBiometric.verifyIdentity).toHaveBeenCalledWith({
        reason: 'Please authenticate',
        useFallback: true,
      });
      expect(loadingProvider.handleUILoading).toHaveBeenCalledWith(true);
      expect(deviceProvider.enableSingleAppMode).toHaveBeenCalled();
      expect(loadingProvider.handleUILoading).toHaveBeenCalledWith(false);
    });

    it('should not enable single app mode if in practice mode', async () => {
      spyOn(deviceProvider, 'disableSingleAppMode').and.returnValue(Promise.resolve(true));
      spyOn(deviceProvider, 'enableSingleAppMode').and.returnValue(Promise.resolve(true));
      spyOn(loadingProvider, 'handleUILoading').and.returnValue(Promise.resolve());
      spyOn(NativeBiometric, 'verifyIdentity').and.returnValue(Promise.resolve());

      await deviceAuthenticationProvider.performBiometricVerification(true);

      expect(deviceProvider.disableSingleAppMode).toHaveBeenCalled();
      expect(NativeBiometric.verifyIdentity).toHaveBeenCalledWith({
        reason: 'Please authenticate',
        useFallback: true,
      });
      expect(deviceProvider.enableSingleAppMode).not.toHaveBeenCalled();
    });
  });

  describe('logEvent', () => {
    it('should dispatch a SaveLog action with the correct payload', () => {
      const error = new Error('Test error');
      const mockTimestamp = Date.now(); // Generate a valid number for the timestamp
      (logHelper.createLog as jasmine.Spy).and.returnValue({
        type: LogType.ERROR,
        message: 'Test error',
        timestamp: mockTimestamp, // Use a valid number here
        drivingExaminerId: '12345',
      });

      deviceAuthenticationProvider.logEvent(error);

      expect(logHelper.createLog).toHaveBeenCalledWith(LogType.ERROR, 'Device auth', error);
      expect(store.dispatch).toHaveBeenCalledWith(
        SaveLog({
          payload: {
            type: LogType.ERROR,
            message: 'Test error',
            timestamp: mockTimestamp, // Use the matcher here for assertions
            drivingExaminerId: '12345',
          },
        })
      );
    });
  });
});
