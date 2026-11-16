import { vi } from 'vitest';
export class AnalyticsProviderMock {
  setGACurrentPage = vi.fn();

  initialiseGoogleAnalytics = vi.fn().mockReturnValue(Promise.resolve());

  logGAEvent = vi.fn();

  addGACustomDimension = vi.fn();

  logGAError = vi.fn();

  setGAUserId = vi.fn();

  setGADeviceId = vi.fn();

  getDescriptiveDate = vi.fn().mockReturnValue('Tomorrow');

  getDiffDays = vi.fn().mockReturnValue(4);
}
