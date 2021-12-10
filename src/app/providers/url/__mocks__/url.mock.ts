export const LOGS_SERVICE_URL = 'https://www.example.com/api/v1/logs';
export const TEST_RESULT_SERVICE_URL = 'https://www.example.com/api/v1/test-result';

export class UrlProviderMock {

  getPersonalJournalUrl = jasmine.createSpy('getPersonalJournalUrl')
    .and.returnValue('https://www.example.com/api/v1/journals/12345678/personal');

  getLogsServiceUrl = jasmine.createSpy('getLogsServiceUrl')
    .and.returnValue(LOGS_SERVICE_URL);

  getTestResultServiceUrl = jasmine.createSpy('getTestResultServiceUrl')
    .and.returnValue(TEST_RESULT_SERVICE_URL);

  getRekeySearchUrl = jasmine.createSpy('getRekeySearchUrl')
    .and.returnValue('https://www.example.com/api/v1/journals/654321/search');

  getRekeyFindUserUrl = jasmine.createSpy('getRekeyFindUserUrl')
    .and.returnValue('https://www.example.com/api/v1/users/search/1234567');

  getTestCentreJournalUrl = jasmine.createSpy('getTestCentreJournalUrl')
    .and.returnValue('https://www.example.com/api/v1/journals/testcentre');
}
