import { TestBed, waitForAsync } from '@angular/core/testing';
import { AppConfig } from '@providers/app-config/app-config.model';
import { UrlProvider } from '../url';
import { AppConfigProvider } from '../../app-config/app-config';
import { AppConfigProviderMock } from '../../app-config/__mocks__/app-config.mock';

describe('UrlProvider', () => {
  let urlProvider: UrlProvider;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        UrlProvider,
        { provide: AppConfigProvider, useClass: AppConfigProviderMock },
      ],
    });

    urlProvider = TestBed.inject(UrlProvider);
  }));

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

  describe('getLogsServiceApiKey', () => {
    it('should get logsPostApiKey', () => {
      spyOn(urlProvider.appConfigProvider, 'getAppConfig').and.returnValue({ logsPostApiKey: 'key' } as AppConfig);
      expect(urlProvider.getLogsServiceApiKey()).toBe('key');
    });
  });
  describe('getTaxMotApiKey', () => {
    it('should get taxMotApiKey', () => {
      spyOn(urlProvider.appConfigProvider, 'getAppConfig').and.returnValue({ taxMotApiKey: 'key' } as AppConfig);
      expect(urlProvider.getTaxMotApiKey()).toBe('key');
    });
  });
  describe('getTaxMotUrl', () => {
    it('should get taxMotUrl', () => {
      spyOn(urlProvider.appConfigProvider, 'getAppConfig').and
        .returnValue({ vehicle: { taxMotUrl: 'url' } } as AppConfig);
      expect(urlProvider.getTaxMotUrl()).toBe('url');
    });
  });
  describe('getTestCentreJournalUrl', () => {
    it('should get teamJournalUrl', () => {
      spyOn(urlProvider.appConfigProvider, 'getAppConfig').and
        .returnValue({ journal: { teamJournalUrl: 'url' } } as AppConfig);
      expect(urlProvider.getTestCentreJournalUrl()).toBe('url');
    });
  });
  describe('getCandidateStandardDataUrl', () => {
    it('should get standardUrl', () => {
      spyOn(urlProvider.appConfigProvider, 'getAppConfig').and
        .returnValue({ driver: { standardUrl: 'url' } } as AppConfig);
      expect(urlProvider.getCandidateStandardDataUrl()).toBe('url');
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
