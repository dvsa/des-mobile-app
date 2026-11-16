import { TestBed } from '@angular/core/testing';
import { Asam } from '@mocks/@capacitor/asam';
import { Store, StoreModule } from '@ngrx/store';
import { AppConfig } from '@providers/app-config/app-config.model';
import { LogType } from '@shared/models/log.model';
import { StoreModel } from '@shared/models/store.model';
import { SaveLog } from '@store/logs/logs.actions';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AppConfigProviderMock } from '../../app-config/__mocks__/app-config.mock';
import { AppConfigProvider } from '../../app-config/app-config';
import { LogHelperMock } from '../../logs/__mocks__/logs-helper.mock';
import { LogHelper } from '../../logs/logs-helper';
import { DeviceProvider } from '../device';

describe('DeviceProvider', () => {
  let deviceProvider: DeviceProvider;
  let store$: Store<StoreModel>;
  let logHelper: LogHelper;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          appInfo: () => ({
            versionNumber: '5',
          }),
        }),
      ],
      providers: [
        DeviceProvider,
        {
          provide: AppConfigProvider,
          useClass: AppConfigProviderMock,
        },
        {
          provide: LogHelper,
          useClass: LogHelperMock,
        },
        Store,
      ],
    });

    store$ = TestBed.inject(Store);
    deviceProvider = TestBed.inject(DeviceProvider);
    logHelper = TestBed.inject(LogHelper);
    vi.spyOn(store$, 'dispatch').mockReturnValue(undefined);
  });

  describe('getDeviceType', () => {
    it('should return the device type', async () => {
      const deviceType = await deviceProvider.getDeviceType();
      expect(deviceType).toBe('iPad7,4');
    });
  });

  describe('validDeviceType', () => {
    it('should return true if the device in supported devices list', async () => {
      vi.spyOn(deviceProvider, 'getDeviceType').mockReturnValue(Promise.resolve('iPad7,4'));
      const deviceValid = await deviceProvider.validDeviceType();
      expect(deviceValid).toEqual(true);
    });
    it('should return false if the device is not in supported devices list', async () => {
      vi.spyOn(deviceProvider, 'getDeviceType').mockReturnValue(Promise.resolve('nonIpad7,4'));
      const deviceValid = await deviceProvider.validDeviceType();
      expect(deviceValid).toEqual(false);
    });
  });

  describe('getUniqueDeviceId', () => {
    it('should return the unique device id', async () => {
      const deviceId = await deviceProvider.getUniqueDeviceId();
      expect(deviceId).toBe('A1234');
    });
  });

  describe('getDeviceName', () => {
    it('should return device name', async () => {
      expect(await deviceProvider.getDeviceName()).toEqual('name');
    });
  });

  describe('getDeviceInfo', () => {
    it('should return device info data', async () => {
      expect(await deviceProvider.getDeviceInfo()).toEqual({
        osVersion: '16.6',
        model: 'iPad7,4',
        name: 'name',
        memUsed: 123,
        realDiskFree: 456,
        realDiskTotal: 1000,
        isVirtual: true,
        platform: 'ios',
        webViewVersion: '1',
        operatingSystem: 'ios',
        manufacturer: 'Apple',
      });
    });
  });

  describe('getBatteryInfo', () => {
    it('should return battery info data', async () => {
      expect(await deviceProvider.getBatteryInfo()).toEqual({ batteryLevel: 0.9 });
    });
  });

  describe('singleAppMode', () => {
    it('should return true when enabling single app mode', async () => {
      vi.spyOn(deviceProvider, 'setSingleAppMode').mockReturnValue(Promise.resolve(true));
      const result = await deviceProvider.enableSingleAppMode();
      expect(result).toBe(true);
    });

    it('should retry until the specified limit if calling setSingleAppMode(true) fails', async () => {
      // Simulate the ASAM toggle failing
      vi.spyOn(deviceProvider, 'setSingleAppMode').mockReturnValue(Promise.resolve(false));
      const asamFailureLog = SaveLog({
        payload: logHelper.createLog(LogType.ERROR, null, 'All retries to enable ASAM failed'),
      });

      await deviceProvider.enableSingleAppMode();

      expect(deviceProvider.setSingleAppMode).toHaveBeenCalledTimes(5);
      expect(store$.dispatch).toHaveBeenCalledWith(asamFailureLog);
    });

    it('should return true when disabling single app mode', async () => {
      vi.spyOn(deviceProvider, 'setSingleAppMode').mockReturnValue(Promise.resolve(true));
      const result = await deviceProvider.disableSingleAppMode();
      expect(result).toBe(true);
    });

    it('should detect examiner role as DLG and resolve with false', async () => {
      vi.spyOn(deviceProvider.appConfig, 'getAppConfig').mockReturnValue({ role: 'DLG' } as AppConfig);
      const result = await deviceProvider.enableSingleAppMode();
      expect(result).toBe(false);
    });
  });

  describe('isSAMEnabled', () => {
    it('should return true if single app mode enabled', async () => {
      vi.spyOn(Asam, 'isSingleAppModeEnabled').mockReturnValue(Promise.resolve({ isEnabled: true }));
      const result = await deviceProvider.isSAMEnabled();
      expect(result).toBe(true);
    });

    it('should return false if single app mode not enabled', async () => {
      vi.spyOn(Asam, 'isSingleAppModeEnabled').mockReturnValue(Promise.resolve({ isEnabled: false }));
      const result = await deviceProvider.isSAMEnabled();
      expect(result).toBe(false);
    });
  });

  describe('setSingleAppMode', () => {
    it('should succeed, return true and not log an event', async () => {
      vi.spyOn(Asam, 'setSingleAppMode').mockReturnValue(Promise.resolve({ didSucceed: true }));
      const res = await deviceProvider.setSingleAppMode(true);
      expect(res).toEqual(true);
      expect(Asam.setSingleAppMode).toHaveBeenCalledWith({ shouldEnable: true });
      expect(store$.dispatch).not.toHaveBeenCalled();
    });
    it('should fail, return false and log an event', async () => {
      vi.spyOn(Asam, 'setSingleAppMode').mockReturnValue(Promise.resolve({ didSucceed: false }));
      const res = await deviceProvider.setSingleAppMode(false);
      expect(res).toEqual(false);
      expect(Asam.setSingleAppMode).toHaveBeenCalledWith({ shouldEnable: false });
      expect(store$.dispatch).toHaveBeenCalled();
    });
  });

  describe('manuallyDisableSingleAppMode', () => {
    it('should call setSingleAppMode, and not dispatch on didSucceed = true', async () => {
      vi.spyOn(Asam, 'setSingleAppMode').mockReturnValue(Promise.resolve({ didSucceed: true }));
      await deviceProvider.manuallyDisableSingleAppMode();
      expect(store$.dispatch).not.toHaveBeenCalled();
    });
    it('should call setSingleAppMode, and dispatch when didSucceed = false', async () => {
      vi.spyOn(Asam, 'setSingleAppMode').mockReturnValue(Promise.resolve({ didSucceed: false }));
      await deviceProvider.manuallyDisableSingleAppMode();
      expect(store$.dispatch).toHaveBeenCalled();
    });
  });
});
