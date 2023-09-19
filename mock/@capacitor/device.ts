export const Device = {
  getId: async () => ({
    identifier: 'A1234',
  }),
  getInfo: async () => ({
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
  }),
  getBatteryInfo: async () => ({
    batteryLevel: 0.9,
  }),
};
