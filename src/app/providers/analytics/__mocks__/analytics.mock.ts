import { IAnalyticsProvider } from '../analytics.model';

export class AnalyticsProviderMock implements IAnalyticsProvider {

  googleAnalyticsKey: string = 'UA-12345678';

  setCurrentPage = jasmine.createSpy('setCurrentPage');
  setGACurrentPage = jasmine.createSpy('setGACurrentPage');

  initialiseAnalytics = jasmine.createSpy('initialiseAnalytics').and.returnValue(Promise.resolve());
  initialiseGoogleAnalytics = jasmine.createSpy('initialiseGoogleAnalytics').and.returnValue(Promise.resolve());

  logEvent = () => {};
  logGAEvent = jasmine.createSpy('logGAEvent');

  addCustomDimension = jasmine.createSpy('addCustomDimension');
  addGACustomDimension = jasmine.createSpy('addGACustomDimension');

  logError = jasmine.createSpy('logError');
  logGAError = jasmine.createSpy('logGAError');

  logException = jasmine.createSpy('logException');

  setUserId = jasmine.createSpy('setUserId');
  setGAUserId = jasmine.createSpy('setGAUserId');

  setDeviceId = jasmine.createSpy('setDeviceId');
  setGADeviceId = jasmine.createSpy('setGADeviceId');

  getDescriptiveDate = jasmine.createSpy('getDescriptiveDate').and.returnValue('Tomorrow');

  getDiffDays = jasmine.createSpy('getDiffDays').and.returnValue(4);
}
