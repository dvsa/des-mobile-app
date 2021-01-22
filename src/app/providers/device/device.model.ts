export interface IDeviceProvider {
  validDeviceType(): boolean;
  getDeviceType(): string;
  getUniqueDeviceId(): string;
}
