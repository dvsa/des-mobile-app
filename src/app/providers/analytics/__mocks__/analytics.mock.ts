export class AnalyticsProviderMock {
  setGACurrentPage = jasmine.createSpy('setGACurrentPage');

  initialiseGoogleAnalytics = jasmine.createSpy('initialiseGoogleAnalytics').and.returnValue(Promise.resolve());

  logGAEvent = jasmine.createSpy('logGAEvent');

  addGACustomDimension = jasmine.createSpy('addGACustomDimension');

  logGAError = jasmine.createSpy('logGAError');

  setGAUserId = jasmine.createSpy('setGAUserId');

  setGADeviceId = jasmine.createSpy('setGADeviceId');

  getDescriptiveDate = jasmine.createSpy('getDescriptiveDate').and.returnValue('Tomorrow');

  getDiffDays = jasmine.createSpy('getDiffDays').and.returnValue(4);
}
