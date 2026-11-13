import { TestBed } from '@angular/core/testing';
import { NativeBiometric } from '@capgo/capacitor-native-biometric';
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
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { unitTestErrorCause } from '../../../../test-setup.vitest';
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
        { provide: Platform, useValue: { ready: vi.fn(), is: vi.fn() } },
        { provide: AppConfigProvider, useValue: { getAppConfig: vi.fn() } },
        {
          provide: DeviceProvider,
          useValue: { disableSingleAppMode: vi.fn(), enableSingleAppMode: vi.fn() },
        },
        { provide: LoadingProvider, useValue: { handleUILoading: vi.fn() } },
        { provide: LogHelper, useValue: { createLog: vi.fn() } },
      ],
    });

    deviceAuthenticationProvider = TestBed.inject(DeviceAuthenticationProvider);
    platform = TestBed.inject(Platform);
    store = TestBed.inject(Store) as MockStore;
    logHelper = TestBed.inject(LogHelper);
    deviceProvider = TestBed.inject(DeviceProvider);
    loadingProvider = TestBed.inject(LoadingProvider);

    vi.spyOn(store, 'dispatch').mockReturnValue(undefined);
  });

  describe('triggerLockScreen', () => {
    it('should bypass device authentication if platform is not cordova', async () => {
      (platform.is as Mock).mockReturnValue(false);
      await deviceAuthenticationProvider.triggerLockScreen();
      expect(platform.is).toHaveBeenCalledWith('cordova');
    });

    it('should bypass device authentication if role is DLG', async () => {
      (platform.is as Mock).mockReturnValue(true);
      (deviceAuthenticationProvider.appConfig.getAppConfig as Mock).mockReturnValue({ role: ExaminerRole.DLG });
      await deviceAuthenticationProvider.triggerLockScreen();
      expect(deviceAuthenticationProvider.appConfig.getAppConfig).toHaveBeenCalled();
    });

    it('should call performBiometricVerification if conditions are met', async () => {
      vi.spyOn(deviceAuthenticationProvider as any, 'performBiometricVerification').mockReturnValue(Promise.resolve());
      (platform.is as Mock).mockReturnValue(true);
      (deviceAuthenticationProvider.appConfig.getAppConfig as Mock).mockReturnValue({ role: 'DE' });
      await deviceAuthenticationProvider.triggerLockScreen();
      expect(deviceAuthenticationProvider.performBiometricVerification).toHaveBeenCalled();
    });

    it('should log an error if an exception occurs', async () => {
      const error = new Error('Test error', { cause: unitTestErrorCause });
      vi.spyOn(deviceAuthenticationProvider as any, 'performBiometricVerification').mockImplementation(() => {
        throw error;
      });
      vi.spyOn(deviceAuthenticationProvider, 'logEvent').mockReturnValue(undefined);
      try {
        await deviceAuthenticationProvider.triggerLockScreen();
      } catch (err) {
        expect(deviceAuthenticationProvider.logEvent).toHaveBeenCalledWith(error);
      }
    });
  });

  describe('performBiometricVerification', () => {
    it('should disable single app mode and enable it again if not in practice mode', async () => {
      vi.spyOn(deviceProvider, 'disableSingleAppMode').mockReturnValue(Promise.resolve(true));
      vi.spyOn(deviceProvider, 'enableSingleAppMode').mockReturnValue(Promise.resolve(true));
      vi.spyOn(loadingProvider, 'handleUILoading').mockReturnValue(Promise.resolve());
      vi.spyOn(NativeBiometric, 'verifyIdentity').mockReturnValue(Promise.resolve());

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
      vi.spyOn(deviceProvider, 'disableSingleAppMode').mockReturnValue(Promise.resolve(true));
      vi.spyOn(deviceProvider, 'enableSingleAppMode').mockReturnValue(Promise.resolve(true));
      vi.spyOn(loadingProvider, 'handleUILoading').mockReturnValue(Promise.resolve());
      vi.spyOn(NativeBiometric, 'verifyIdentity').mockReturnValue(Promise.resolve());

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
      const error = new Error('Test error', { cause: unitTestErrorCause });
      const mockTimestamp = Date.now(); // Generate a valid number for the timestamp
      (logHelper.createLog as Mock).mockReturnValue({
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
