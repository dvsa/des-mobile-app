import { TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { LogType } from '@shared/models/log.model';
import { SaveLog } from '@store/logs/logs.actions';
import { Asam } from '@mocks/@capacitor/asam';
import { AppConfig } from '@providers/app-config/app-config.model';
import { DeviceProvider } from '../device';
import { AppConfigProvider } from '../../app-config/app-config';
import { AppConfigProviderMock } from '../../app-config/__mocks__/app-config.mock';
import { LogHelperMock } from '../../logs/__mocks__/logs-helper.mock';
import { LogHelper } from '../../logs/logs-helper';

enum FriendlyDeviceModel {
  iPAD_AIR_3RD_GEN = 'iPad Air (3rd generation)',
  iPAD_8TH_GEN = 'iPad (8th generation)',
  iPAD_9TH_GEN = 'iPad (9th generation)',
  iPAD_PRO_10_5_INCH = 'iPad Pro (10.5-inch)',
}

describe('DeviceProvider', () => {
  let deviceProvider: DeviceProvider;
  let store$: Store<any>;
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

  describe('getDeviceType', () => {
    it('should return model', async () => {
      expect(await deviceProvider.getDeviceType())
        .toBe('test');
    });
  });

  describe('getDescriptiveDeviceName', () => {
    ['iPad7,3', 'iPad7,4'].forEach((val) => {
      it(`should return FriendlyDeviceModel.iPAD_PRO_10_5_INCH if deviceModel is ${val}`, async () => {
        spyOn(deviceProvider, 'getDeviceType')
          .and
          .returnValue(Promise.resolve(val));
        expect(await deviceProvider.getDescriptiveDeviceName())
          .toEqual(FriendlyDeviceModel.iPAD_PRO_10_5_INCH);
      });
    });
    ['iPad11,6', 'iPad11,7'].forEach((val) => {
      it(`should return FriendlyDeviceModel.iPAD_8TH_GEN if deviceModel is ${val}`, async () => {
        spyOn(deviceProvider, 'getDeviceType')
          .and
          .returnValue(Promise.resolve(val));
        expect(await deviceProvider.getDescriptiveDeviceName())
          .toEqual(FriendlyDeviceModel.iPAD_8TH_GEN);
      });
    });
    it('should return FriendlyDeviceModel.iPAD_AIR_3RD_GEN if deviceModel is iPad11,4', async () => {
      spyOn(deviceProvider, 'getDeviceType')
        .and
        .returnValue(Promise.resolve('iPad11,4'));
      expect(await deviceProvider.getDescriptiveDeviceName())
        .toEqual(FriendlyDeviceModel.iPAD_AIR_3RD_GEN);
    });
    it('should return FriendlyDeviceModel.iPAD_9TH_GEN if deviceModel is iPad12,2', async () => {
      spyOn(deviceProvider, 'getDeviceType')
        .and
        .returnValue(Promise.resolve('iPad12,2'));
      expect(await deviceProvider.getDescriptiveDeviceName())
        .toEqual(FriendlyDeviceModel.iPAD_9TH_GEN);
    });
    it('should return switch value if the switch defaults', async () => {
      spyOn(deviceProvider, 'getDeviceType')
        .and
        .returnValue(Promise.resolve('test'));
      expect(await deviceProvider.getDescriptiveDeviceName())
        .toEqual('test');
    });
  });

  describe('getUniqueDeviceId', () => {
    it('should return uuid', async () => {
      expect(await deviceProvider.getUniqueDeviceId())
        .toBe('test');
    });
  });

  describe('is8thGenDevice', () => {
    ['iPad11,6', 'iPad11,7'].forEach((val) => {
      it(`should return true if deviceType is ${val}`, () => {
        expect(deviceProvider.is8thGenDevice(val))
          .toBe(true);
      });
    });
    it('should return false if deviceType does not fit the requirements', () => {
      expect(deviceProvider.is8thGenDevice('test'))
        .toBe(false);
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
      spyOn(store$, 'dispatch')
        .and
        .callThrough();
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

});
