// eslint-disable-next-line import/no-cycle
import { APP_VERSION_NUMBER } from '../__tests__/app-info.spec';

export class AppVersionMock {
  getAppName = jasmine.createSpy('getAppName').and.returnValue(Promise.resolve('app name'));
  getPackageName = jasmine.createSpy('getPackageName').and.returnValue(Promise.resolve('package name'));
  getVersionCode = jasmine.createSpy('getVersionCode').and.returnValue(Promise.resolve('version code'));
  getVersionNumber = jasmine.createSpy('getVersionNumber').and.returnValue(Promise.resolve(APP_VERSION_NUMBER));
}
