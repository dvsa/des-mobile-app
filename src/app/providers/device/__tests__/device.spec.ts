import { TestBed } from '@angular/core/testing';
import { Device } from '@ionic-native/device/ngx';
import { DeviceMock } from '@ionic-native-mocks/device';
import { StoreModule, Store } from '@ngrx/store';
import { configureTestSuite } from 'ng-bullet';
import { LogType } from '@shared/models/log.model';
import { SaveLog } from '@store/logs/logs.actions';
import { DeviceProvider } from '../device';
import { AppConfigProvider } from '../../app-config/app-config';
import { AppConfigProviderMock } from '../../app-config/__mocks__/app-config.mock';
import { LogHelperMock } from '../../logs/__mocks__/logs-helper.mock';
import { LogHelper } from '../../logs/logs-helper';

// @TODO MES-7132: reinstate tests
xdescribe('Device Provider', () => {

  let deviceProvider: DeviceProvider;
  let store$: Store<any>;
  let logHelper: LogHelper;

  configureTestSuite(() => {
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
        { provide: AppConfigProvider, useClass: AppConfigProviderMock },
        { provide: Device, useClass: DeviceMock },
        Store,
        { provide: LogHelper, useClass: LogHelperMock },
      ],
    });
  });

  beforeEach(() => {
    store$ = TestBed.inject(Store);
    deviceProvider = TestBed.inject(DeviceProvider);
    logHelper = TestBed.inject(LogHelper);
  });

  describe('getDeviceType', () => {
    it('should return the device type', () => {
      spyOn(deviceProvider, 'getDeviceType').and.returnValue('iPad7,4');
      const deviceType = deviceProvider.getDeviceType();
      expect(deviceType).toBe('iPad7,4');
    });
  });

  describe('validDeviceType', () => {
    it('should return true if the device in supported devices list', () => {
      spyOn(deviceProvider, 'getDeviceType').and.returnValue('iPad7,4');
      const deviceValid = deviceProvider.validDeviceType();
      expect(deviceValid).toEqual(true);
    });
  });

  describe('validDeviceType', () => {
    it('should return false if the device is not in supported devices list', () => {
      spyOn(deviceProvider, 'getDeviceType').and.returnValue('nonIpad7,4');
      const deviceValid = deviceProvider.validDeviceType();
      expect(deviceValid).toEqual(false);
    });
  });

  describe('getUniqueDeviceId', () => {
    it('should return the unique device id', () => {
      spyOn(deviceProvider, 'getUniqueDeviceId').and.returnValue('A1234');
      const deviceId = deviceProvider.getUniqueDeviceId();
      expect(deviceId).toBe('A1234');
    });
  });

  describe('singleAppMode', () => {
    // @TODO MES-7132 reinstate test when device uses new capacitor plugin
    xit('should return true when enabling single app mode', async () => {
      const result = await deviceProvider.enableSingleAppMode();
      expect(result).toBe(true);
    });

    it('should retry uptil the specified limit if calling setSingleAppMode(true) fails', async () => {
      // Simulate the ASAM toggle failing
      spyOn(deviceProvider, 'setSingleAppMode').and.returnValue(Promise.resolve(false));
      spyOn(store$, 'dispatch').and.callThrough();
      const asamFailureLog = SaveLog({
        payload: logHelper.createLog(
          LogType.ERROR,
          null,
          'All retries to enable ASAM failed',
        ),
      });

      await deviceProvider.enableSingleAppMode();

      expect(deviceProvider.setSingleAppMode).toHaveBeenCalledTimes(4);
      expect(store$.dispatch).toHaveBeenCalledWith(asamFailureLog);
    });

    // @TODO MES-7132 reinstate test when device uses new capacitor plugin
    xit('should return true when disabling single app mode', async () => {
      const result = await deviceProvider.disableSingleAppMode();
      expect(result).toBe(true);
    });

    it('should detect examiner role as DLG and resolve with false', async () => {
      spyOn(deviceProvider.appConfig, 'getAppConfig').and.returnValue({
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
        requestTimeout: undefined,
      });
      const result = await deviceProvider.enableSingleAppMode();
      expect(result).toBe(false);
    });
  });

});
