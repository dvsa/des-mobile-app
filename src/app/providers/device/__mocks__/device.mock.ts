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

  enableSingleAppMode = jasmine.createSpy('enableSingleAppMode').and.returnValue(Promise.resolve(true));

  disableSingleAppMode = jasmine.createSpy('disableSingleAppMode').and.returnValue(Promise.resolve(true));

  checkSingleAppMode = jasmine.createSpy('checkSingleAppMode').and.returnValue(Promise.resolve(true));

  is8thGenDevice = jasmine.createSpy('is8thGenDevice').and.returnValue(true);
}
