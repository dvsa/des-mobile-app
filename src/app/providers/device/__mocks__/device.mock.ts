import { Injectable } from '@angular/core';
import { IDeviceProvider } from '../device.model';

const supportedDevices: string[] = [
  'iPad7,4',
];

@Injectable()
export class DeviceProviderMock implements IDeviceProvider {

  validDeviceType = (): boolean => {
    const model = this.getDeviceType();
    if (supportedDevices.findIndex((device) => device === model) > -1) {
      return true;
    }
    return false;
  };

  getDeviceType = (): string => {
    return 'iPad7,4';
  };

  getUniqueDeviceId = (): string => {
    return 'A1234';
  };

  getDeviceInfo = jasmine.createSpy('getDeviceInfo')
    .and
    .returnValue(Promise.resolve({
      iOSVersion: 16.6,
      model: 'iPad7,4',
      memUsed: 123,
      realDiskFree: 456,
      realDiskTotal: 1000,
    }));

  getBatteryInfo = jasmine.createSpy('getBatteryInfo')
    .and
    .returnValue(Promise.resolve({
      batteryLevel: 0.9,
    }));

  enableSingleAppMode = jasmine.createSpy('enableSingleAppMode')
    .and
    .returnValue(Promise.resolve(true));

  disableSingleAppMode = jasmine.createSpy('disableSingleAppMode')
    .and
    .returnValue(Promise.resolve(true));

  checkSingleAppMode = jasmine.createSpy('checkSingleAppMode')
    .and
    .returnValue(Promise.resolve(true));

  is8thGenDevice = jasmine.createSpy('is8thGenDevice')
    .and
    .returnValue(true);
}
