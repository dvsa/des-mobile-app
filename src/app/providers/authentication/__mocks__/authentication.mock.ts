export class AuthenticationProviderMock {
  getAppConfigData = jasmine.createSpy('getAppConfigData').and.returnValue(Promise.resolve());

  getEmployeeId = jasmine.createSpy('getEmployeeId').and.returnValue('12345678');

  getAuthenticationToken = jasmine.createSpy('getAuthenticationToken').and.resolveTo('token');

  loadEmployeeDetails = jasmine.createSpy('loadEmployeeDetails').and.returnValue(Promise.resolve());

  refreshEmployeeDetails = jasmine.createSpy('refreshEmployeeDetails').and.returnValue(Promise.resolve());

  storeAuthResult = jasmine.createSpy('storeAuthResult').and.returnValue(Promise.resolve());

  login = jasmine.createSpy('login').and.returnValue(Promise.resolve());

  isOffline = jasmine.createSpy('isOffline').and.returnValue(false);

  refreshSession = jasmine.createSpy('refreshSession').and.returnValue(Promise.resolve());

  isAuthenticated = jasmine.createSpy('isAuthenticated').and.returnValue(Promise.resolve(true));

  hasTokenExpired = jasmine.createSpy('hasTokenExpired').and.returnValue(Promise.resolve(true));

  clearStore = jasmine.createSpy('clearStore').and.returnValue(Promise.resolve());

  logout = jasmine.createSpy('logout').and.returnValue(Promise.resolve());

  loadEmployeeName = jasmine.createSpy('loadEmployeeName').and.returnValue(Promise.resolve('joe blogs'));
}
