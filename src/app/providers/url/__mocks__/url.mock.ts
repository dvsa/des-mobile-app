import { vi } from 'vitest';
export const LOGS_SERVICE_URL = 'https://www.example.com/api/v1/logs';
export const TEST_RESULT_SERVICE_URL = 'https://www.example.com/api/v1/test-result';

export class UrlProviderMock {
  getPersonalJournalUrl = vi.fn().mockReturnValue('https://www.example.com/api/v1/journals/12345678/personal');

  getLogsServiceUrl = vi.fn().mockReturnValue(LOGS_SERVICE_URL);

  getTestResultServiceUrl = vi.fn().mockReturnValue(TEST_RESULT_SERVICE_URL);

  getRekeySearchUrl = vi.fn().mockReturnValue('https://www.example.com/api/v1/journals/654321/search');

  getRekeyFindUserUrl = vi.fn().mockReturnValue('https://www.example.com/api/v1/users/search/1234567');

  getTestCentreJournalUrl = vi.fn().mockReturnValue('https://www.example.com/api/v1/journals/testcentre');

  getMotUrl = vi.fn().mockReturnValue('https://www.example.com/1.0/checkMot?identifier=ABC123');

  getCandidateSignatureUrl = vi.fn().mockReturnValue('https://www.example.com/signature');

  getCandidatePhotoUrl = vi.fn().mockReturnValue('https://www.example.com/photo');

  getCandidateStandardDataUrl = vi.fn().mockReturnValue('https://www.example.com/standard');

  getRefDataTestCentreUrl = vi.fn().mockReturnValue('https://ref-data/testcentre');

  getDelegatedExaminerSearchBookingUrl = vi.fn().mockReturnValue('https://www.example.com/delegated-booking');

  getLogsServiceApiKey = vi.fn().mockReturnValue('logs-api-key');
}
