export class AuthenticationProviderMock {

  isAuthenticated = jasmine.createSpy('isAuthenticated').and.returnValue(Promise.resolve(true));

  isInUnAuthenticatedMode = jasmine.createSpy('isInUnAuthenticatedMode').and.returnValue(false);

  getAuthenticationToken = jasmine.createSpy('getAuthenticationToken').and.returnValue(Promise.resolve('token'));

  getEmployeeId = jasmine.createSpy('getEmployeeId').and.returnValue('12345678');

  getEmployeeName = jasmine.createSpy('getEmployeeName').and.returnValue('Graham O\'Brien');

  isDelegatedExaminer = jasmine.createSpy('isDelegatedExaminer');

  login = jasmine.createSpy('login').and.returnValue(Promise.resolve());

  logout = jasmine.createSpy('logout').and.returnValue(Promise.resolve());

  initialiseAuthentication = jasmine.createSpy('initialiseAuthentication');
  determineAuthenticationMode = jasmine.createSpy('determineAuthenticationMode');

  logoutEnabled = jasmine.createSpy('logoutEnabled').and.returnValue(true);

  setEmployeeId = jasmine.createSpy('setEmployeeId').and.returnValue(Promise.resolve());

  expireTokens = jasmine.createSpy('expireTokens').and.returnValue(Promise.resolve());

}
