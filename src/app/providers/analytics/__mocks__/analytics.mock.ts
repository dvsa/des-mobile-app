import { IAnalyticsProvider } from '../analytics.model';

export class AnalyticsProviderMock implements IAnalyticsProvider {

  googleAnalyticsKey: string = 'UA-12345678';

  setCurrentPage = jasmine.createSpy('setCurrentPage');

  initialiseAnalytics = jasmine.createSpy('initialiseAnalytics').and.returnValue(Promise.resolve());

  logEvent = jasmine.createSpy('logEvent');

  addCustomDimension = jasmine.createSpy('addCustomDimension');

  logError = jasmine.createSpy('logError');

  logException = jasmine.createSpy('logException');

  setUserId = jasmine.createSpy('setUserId');

  setDeviceId = jasmine.createSpy('setDeviceId');

  getDescriptiveDate = jasmine.createSpy('getDescriptiveDate').and.returnValue('Tomorrow');

  getDiffDays = jasmine.createSpy('getDiffDays').and.returnValue(4);
}
