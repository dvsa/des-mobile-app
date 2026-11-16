import { Injectable } from '@angular/core';
import { vi } from 'vitest';
import { IDeviceProvider } from '../device.model';

const supportedDevices: string[] = ['iPad7,4'];

@Injectable({
  providedIn: 'root',
})
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

  getDeviceInfo = vi.fn().mockReturnValue(
    Promise.resolve({
      iOSVersion: 16.6,
      model: 'iPad7,4',
      memUsed: 123,
      realDiskFree: 456,
      realDiskTotal: 1000,
    })
  );

  getBatteryInfo = vi.fn().mockReturnValue(
    Promise.resolve({
      batteryLevel: 0.9,
    })
  );

  enableSingleAppMode = vi.fn().mockReturnValue(Promise.resolve(true));

  disableSingleAppMode = vi.fn().mockReturnValue(Promise.resolve(true));

  checkSingleAppMode = vi.fn().mockReturnValue(Promise.resolve(true));

  is8thGenDevice = vi.fn().mockReturnValue(true);

  isSAMEnabled = vi.fn().mockReturnValue(Promise.resolve(true));
}
