export class AuthenticationProviderMock {
	isAuthenticated = jasmine.createSpy('isAuthenticated').and.returnValue(Promise.resolve(true));

	isInUnAuthenticatedMode = jasmine.createSpy('isInUnAuthenticatedMode').and.returnValue(false);

	getEmployeeIdFromIDToken = jasmine.createSpy('getEmployeeIdFromIDToken').and.returnValue(Promise.resolve('1234567'));

	getAuthenticationToken = jasmine.createSpy('getAuthenticationToken').and.returnValue(Promise.resolve('token'));

	getEmployeeId = jasmine.createSpy('getEmployeeId').and.returnValue('12345678');

	isDelegatedExaminer = jasmine.createSpy('isDelegatedExaminer');

	login = jasmine.createSpy('login').and.returnValue(Promise.resolve());

	logout = jasmine.createSpy('logout').and.returnValue(Promise.resolve());

	initialiseAuthentication = jasmine.createSpy('initialiseAuthentication');

	determineAuthenticationMode = jasmine.createSpy('determineAuthenticationMode');

	setEmployeeId = jasmine.createSpy('setEmployeeId').and.returnValue(Promise.resolve());

	expireTokens = jasmine.createSpy('expireTokens').and.returnValue(Promise.resolve());

	loadEmployeeName = jasmine.createSpy('loadEmployeeName').and.returnValue(Promise.resolve('joe blogs'));
}
