import { TestBed } from '@angular/core/testing';
import { Device } from '@awesome-cordova-plugins/device/ngx';
import { Store, StoreModule } from '@ngrx/store';
import { LogType } from '@shared/models/log.model';
import { SaveLog } from '@store/logs/logs.actions';
import { DeviceMock } from '@mocks/ionic-mocks/device.mock';
import { Asam } from '@mocks/@capacitor/asam';
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

xdescribe('DeviceProvider', () => {
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
          provide: Device,
          useClass: DeviceMock,
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

  xdescribe('getDeviceType', () => {
    it('should return the device type', () => {
      spyOn(deviceProvider, 'getDeviceType')
        .and
        .returnValue('iPad7,4');
      const deviceType = deviceProvider.getDeviceType();
      expect(deviceType)
        .toBe('iPad7,4');
    });
  });

  xdescribe('validDeviceType', () => {
    it('should return true if the device in supported devices list', () => {
      spyOn(deviceProvider, 'getDeviceType')
        .and
        .returnValue('iPad7,4');
      const deviceValid = deviceProvider.validDeviceType();
      expect(deviceValid)
        .toEqual(true);
    });
  });

  xdescribe('validDeviceType', () => {
    it('should return false if the device is not in supported devices list', () => {
      spyOn(deviceProvider, 'getDeviceType')
        .and
        .returnValue('nonIpad7,4');
      const deviceValid = deviceProvider.validDeviceType();
      expect(deviceValid)
        .toEqual(false);
    });
  });

  xdescribe('getUniqueDeviceId', () => {
    it('should return the unique device id', () => {
      spyOn(deviceProvider, 'getUniqueDeviceId')
        .and
        .returnValue('A1234');
      const deviceId = deviceProvider.getUniqueDeviceId();
      expect(deviceId)
        .toBe('A1234');
    });
  });

  xdescribe('singleAppMode', () => {
    it('should return true when enabling single app mode', async () => {
      spyOn(deviceProvider, 'setSingleAppMode')
        .and
        .returnValue(Promise.resolve(true));
      const result = await deviceProvider.enableSingleAppMode();
      expect(result)
        .toBe(true);
    });

    xdescribe('getDeviceType', () => {
      it('should return model', async () => {
        deviceProvider['device'].model = 'test';
        expect(deviceProvider.getDeviceType())
          .toBe('test');
      });
    });

    xdescribe('getDescriptiveDeviceName', () => {
      ['iPad7,3', 'iPad7,4'].forEach((val) => {
        it(`should return FriendlyDeviceModel.iPAD_PRO_10_5_INCH if deviceModel is ${val}`, () => {
          spyOn(deviceProvider, 'getDeviceType')
            .and
            .returnValue(val);
          expect(deviceProvider.getDescriptiveDeviceName())
            .toBe(FriendlyDeviceModel.iPAD_PRO_10_5_INCH);
        });
      });
      ['iPad11,6', 'iPad11,7'].forEach((val) => {
        it(`should return FriendlyDeviceModel.iPAD_8TH_GEN if deviceModel is ${val}`, () => {
          spyOn(deviceProvider, 'getDeviceType')
            .and
            .returnValue(val);
          expect(deviceProvider.getDescriptiveDeviceName())
            .toBe(FriendlyDeviceModel.iPAD_8TH_GEN);
        });
      });
      it('should return FriendlyDeviceModel.iPAD_AIR_3RD_GEN if deviceModel is iPad11,4', () => {
        spyOn(deviceProvider, 'getDeviceType')
          .and
          .returnValue('iPad11,4');
        expect(deviceProvider.getDescriptiveDeviceName())
          .toBe(FriendlyDeviceModel.iPAD_AIR_3RD_GEN);
      });
      it('should return FriendlyDeviceModel.iPAD_9TH_GEN if deviceModel is iPad12,2', () => {
        spyOn(deviceProvider, 'getDeviceType')
          .and
          .returnValue('iPad12,2');
        expect(deviceProvider.getDescriptiveDeviceName())
          .toBe(FriendlyDeviceModel.iPAD_9TH_GEN);
      });
      it('should return switch value if the switch defaults', () => {
        spyOn(deviceProvider, 'getDeviceType')
          .and
          .returnValue('test');
        expect(deviceProvider.getDescriptiveDeviceName())
          .toBe('test');
      });
    });

    xdescribe('getUniqueDeviceId', () => {
      it('should return uuid', async () => {
        deviceProvider['device'].uuid = 'test';
        expect(deviceProvider.getUniqueDeviceId())
          .toBe('test');
      });
    });

    xdescribe('is8thGenDevice', () => {
      ['iPad11,6', 'iPad11,7'].forEach((val) => {
        it(`should return true if deviceType is ${val}`, () => {
          expect(deviceProvider.is8thGenDevice(val))
            .toBe(true);
        });
      });
      it('should return fakse if deviceType does not fit the requirements', () => {
        expect(deviceProvider.is8thGenDevice('test'))
          .toBe(false);
      });
    });

    it('should retry uptil the specified limit if calling setSingleAppMode(true) fails', async () => {
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
        .returnValue({
          liveAppVersion: '',
          configUrl: '',
          googleAnalyticsId: '',
          daysToCacheLogs: 1,
          logsApiUrl: '',
          logsAutoSendInterval: 1,
          logsPostApiKey: '',
          authentication: undefined,
          approvedDeviceIdentifiers: [],
          role: 'DLG',
          journal: undefined,
          tests: undefined,
          user: undefined,
          driver: undefined,
          requestTimeout: undefined,
          taxMotApiKey: '',
          vehicle: null,
          refData: null,
        });
      const result = await deviceProvider.enableSingleAppMode();
      expect(result)
        .toBe(false);
    });
  });

  xdescribe('isSAMEnabled', () => {
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
