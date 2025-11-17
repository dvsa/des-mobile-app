export class AuthenticationProviderMock {
  init = jasmine.createSpy('init').and.returnValue(Promise.resolve());

  setProviderOptions = jasmine.createSpy('setProviderOptions').and.returnValue(Promise.resolve());

  getEmployeeId = jasmine.createSpy('getEmployeeId').and.returnValue('12345678');

  decodeToken = jasmine.createSpy('decodeToken').and.resolveTo({ name: 'joe blogs', id: '12345678' });

  getAuthenticationToken = jasmine.createSpy('getAuthenticationToken').and.resolveTo('token');

  loadEmployeeDetails = jasmine.createSpy('loadEmployeeDetails').and.returnValue(Promise.resolve());

  refreshEmployeeDetails = jasmine.createSpy('refreshEmployeeDetails').and.returnValue(Promise.resolve());

  storeAuthResult = jasmine.createSpy('storeAuthResult').and.returnValue(Promise.resolve());

  getAuthResult = jasmine.createSpy('getAuthResult').and.returnValue(Promise.resolve());

  getStoredAuthResult = jasmine.createSpy('getStoredAuthResult').and.returnValue(Promise.resolve());

  login = jasmine.createSpy('login').and.returnValue(Promise.resolve());

  isOffline = jasmine.createSpy('isOffline').and.returnValue(false);

  refreshSession = jasmine.createSpy('refreshSession').and.returnValue(Promise.resolve());

  isAuthenticated = jasmine.createSpy('isAuthenticated').and.returnValue(Promise.resolve(true));

  hasTokenExpired = jasmine.createSpy('hasTokenExpired').and.returnValue(Promise.resolve(true));

  clearStore = jasmine.createSpy('clearStore').and.returnValue(Promise.resolve());

  logout = jasmine.createSpy('logout').and.returnValue(Promise.resolve());
}
