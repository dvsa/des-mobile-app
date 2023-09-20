import { TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { LogType } from '@shared/models/log.model';
import { SaveLog } from '@store/logs/logs.actions';
import { Asam } from '@mocks/@capacitor/asam';
import { AppConfig } from '@providers/app-config/app-config.model';
import { StoreModel } from '@shared/models/store.model';
import { DeviceProvider } from '../device';
import { AppConfigProvider } from '../../app-config/app-config';
import { AppConfigProviderMock } from '../../app-config/__mocks__/app-config.mock';
import { LogHelperMock } from '../../logs/__mocks__/logs-helper.mock';
import { LogHelper } from '../../logs/logs-helper';

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
    spyOn(store$, 'dispatch');
  });

  describe('getDeviceType', () => {
    it('should return the device type', async () => {
      const deviceType = await deviceProvider.getDeviceType();
      expect(deviceType)
        .toBe('iPad7,4');
    });
  });

  describe('validDeviceType', () => {
    it('should return true if the device in supported devices list', async () => {
      spyOn(deviceProvider, 'getDeviceType')
        .and
        .returnValue(Promise.resolve('iPad7,4'));
      const deviceValid = await deviceProvider.validDeviceType();
      expect(deviceValid)
        .toEqual(true);
    });
    it('should return false if the device is not in supported devices list', async () => {
      spyOn(deviceProvider, 'getDeviceType')
        .and
        .returnValue(Promise.resolve('nonIpad7,4'));
      const deviceValid = await deviceProvider.validDeviceType();
      expect(deviceValid)
        .toEqual(false);
    });
  });

  describe('getUniqueDeviceId', () => {
    it('should return the unique device id', async () => {
      const deviceId = await deviceProvider.getUniqueDeviceId();
      expect(deviceId)
        .toBe('A1234');
    });
  });

  describe('getDeviceName', () => {
    it('should return device name', async () => {
      expect(await deviceProvider.getDeviceName())
        .toEqual('name');
    });
  });

  describe('getDeviceInfo', () => {
    it('should return device info data', async () => {
      expect(await deviceProvider.getDeviceInfo())
        .toEqual({
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
      expect(await deviceProvider.getBatteryInfo())
        .toEqual({ batteryLevel: 0.9 });
    });
  });

  describe('singleAppMode', () => {
    it('should return true when enabling single app mode', async () => {
      spyOn(deviceProvider, 'setSingleAppMode')
        .and
        .returnValue(Promise.resolve(true));
      const result = await deviceProvider.enableSingleAppMode();
      expect(result)
        .toBe(true);
    });

    it('should retry until the specified limit if calling setSingleAppMode(true) fails', async () => {
      // Simulate the ASAM toggle failing
      spyOn(deviceProvider, 'setSingleAppMode')
        .and
        .returnValue(Promise.resolve(false));
      const asamFailureLog = SaveLog({
        payload: logHelper.createLog(
          LogType.ERROR,
          null,
          'All retries to enable ASAM failed',
        ),
      });

      await deviceProvider.enableSingleAppMode();

      expect(deviceProvider.setSingleAppMode)
        .toHaveBeenCalledTimes(5);
      expect(store$.dispatch)
        .toHaveBeenCalledWith(asamFailureLog);
    });

    it('should return true when disabling single app mode', async () => {
      spyOn(deviceProvider, 'setSingleAppMode')
        .and
        .returnValue(Promise.resolve(true));
      const result = await deviceProvider.disableSingleAppMode();
      expect(result)
        .toBe(true);
    });

    it('should detect examiner role as DLG and resolve with false', async () => {
      spyOn(deviceProvider.appConfig, 'getAppConfig')
        .and
        .returnValue({ role: 'DLG' } as AppConfig);
      const result = await deviceProvider.enableSingleAppMode();
      expect(result)
        .toBe(false);
    });
  });

  describe('isSAMEnabled', () => {
    it('should return true if single app mode enabled', async () => {
      spyOn(Asam, 'isSingleAppModeEnabled')
        .and
        .returnValue(Promise.resolve({ isEnabled: true }));
      const result = await deviceProvider.isSAMEnabled();
      expect(result)
        .toBe(true);
    });

    it('should return false if single app mode not enabled', async () => {
      spyOn(Asam, 'isSingleAppModeEnabled')
        .and
        .returnValue(Promise.resolve({ isEnabled: false }));
      const result = await deviceProvider.isSAMEnabled();
      expect(result)
        .toBe(false);
    });
  });

  describe('setSingleAppMode', () => {
    it('should succeed, return true and not log an event', async () => {
      spyOn(Asam, 'setSingleAppMode')
        .and
        .returnValue(Promise.resolve({ didSucceed: true }));
      const res = await deviceProvider.setSingleAppMode(true);
      expect(res)
        .toEqual(true);
      expect(Asam.setSingleAppMode)
        .toHaveBeenCalledWith({ shouldEnable: true });
      expect(store$.dispatch)
        .not
        .toHaveBeenCalled();
    });
    it('should fail, return false and log an event', async () => {
      spyOn(Asam, 'setSingleAppMode')
        .and
        .returnValue(Promise.resolve({ didSucceed: false }));
      const res = await deviceProvider.setSingleAppMode(false);
      expect(res)
        .toEqual(false);
      expect(Asam.setSingleAppMode)
        .toHaveBeenCalledWith({ shouldEnable: false });
      expect(store$.dispatch)
        .toHaveBeenCalled();
    });
  });

  describe('manuallyDisableSingleAppMode', () => {
    it('should call setSingleAppMode, and not dispatch on didSucceed = true', async () => {
      spyOn(Asam, 'setSingleAppMode')
        .and
        .returnValue(Promise.resolve({ didSucceed: true }));
      await deviceProvider.manuallyDisableSingleAppMode();
      expect(store$.dispatch)
        .not
        .toHaveBeenCalled();
    });
    it('should call setSingleAppMode, and dispatch when didSucceed = false', async () => {
      spyOn(Asam, 'setSingleAppMode')
        .and
        .returnValue(Promise.resolve({ didSucceed: false }));
      await deviceProvider.manuallyDisableSingleAppMode();
      expect(store$.dispatch)
        .toHaveBeenCalled();
    });
  });

});
