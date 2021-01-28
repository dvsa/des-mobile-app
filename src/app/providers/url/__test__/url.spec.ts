import { TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { UrlProvider } from '../url';
import { AppConfigProvider } from '../../app-config/app-config';
import { AppConfigProviderMock } from '../../app-config/__mocks__/app-config.mock';

describe('UrlProvider', () => {

  let urlProvider: UrlProvider;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        UrlProvider,
        { provide: AppConfigProvider, useClass: AppConfigProviderMock },
      ],
    });
  });

  beforeEach(() => {
    urlProvider = TestBed.inject(UrlProvider);
  });

  describe('getPersonalJournalUrl', () => {
    it('should format the URL template from the AppConfigProvider with the provided staffNumber', () => {
      const url = urlProvider.getPersonalJournalUrl('12345678');
      expect(url).toBe('https://www.example.com/api/v1/journals/12345678/personal');
    });

    it('should format the URL with an unmapped staffNumber when no staffNumber is provided', () => {
      let url;
      url = urlProvider.getPersonalJournalUrl(null);
      expect(url).toBe('https://www.example.com/api/v1/journals/00000000/personal');
      url = urlProvider.getPersonalJournalUrl(undefined);
      expect(url).toBe('https://www.example.com/api/v1/journals/00000000/personal');
    });
  });

  describe('getLogsServiceUrl', () => {
    it('should return the correct url', () => {
      const url = urlProvider.getLogsServiceUrl();
      expect(url).toBe('https://www.example.com/api/v1/logs');
    });
  });

  describe('getTestResultServiceUrl', () => {
    it('should return the correct url', () => {
      const url = urlProvider.getTestResultServiceUrl();
      expect(url).toBe('https://www.example.com/api/v1/test-result');
    });
  });

  describe('getRekeySearchlUrl', () => {
    it('should format the URL template from the AppConfigProvider with the provided staffNumber', () => {
      const url = urlProvider.getRekeySearchUrl('12345678');
      expect(url).toBe('https://www.example.com/api/v1/journals/12345678/search');
    });

    it('should format the URL with an unmapped staffNumber when no staffNumber is provided', () => {
      const urlWithNull = urlProvider.getRekeySearchUrl(null);
      expect(urlWithNull).toBe('https://www.example.com/api/v1/journals/00000000/search');
      const urlWithUndefined = urlProvider.getRekeySearchUrl(undefined);
      expect(urlWithUndefined).toBe('https://www.example.com/api/v1/journals/00000000/search');
    });
  });
});
