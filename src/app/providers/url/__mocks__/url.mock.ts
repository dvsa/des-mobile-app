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

  getTaxMotUrl = jasmine.createSpy('getVehicleDetailsApiUrl')
    .and.returnValue('https://www.example.com/1.0/vehicle');

  getCandidateSignatureUrl = jasmine.createSpy('getCandidateSignatureUrl')
    .and.returnValue('https://www.example.com/signature');

  getCandidatePhotoUrl = jasmine.createSpy('getCandidatePhotoUrl')
    .and.returnValue('https://www.example.com/photo');

  getCandidateStandardDataUrl = jasmine.createSpy('getCandidateStandardDataUrl')
    .and.returnValue('https://www.example.com/standard');

  getTaxMotApiKey = jasmine.createSpy()
    .and.returnValue('x-api-key');

  getRefDataTestCentreUrl = jasmine.createSpy('getRefDataTestCentreUrl')
    .and.returnValue('https://ref-data/testcentre');
}
