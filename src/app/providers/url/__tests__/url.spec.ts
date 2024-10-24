import { TestBed, waitForAsync } from '@angular/core/testing';
import { AppConfig } from '@providers/app-config/app-config.model';
import { AppConfigProviderMock } from '../../app-config/__mocks__/app-config.mock';
import { AppConfigProvider } from '../../app-config/app-config';
import { UrlProvider } from '../url';

describe('UrlProvider', () => {
  let urlProvider: UrlProvider;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        UrlProvider,
        {
          provide: AppConfigProvider,
          useClass: AppConfigProviderMock,
        },
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
  describe('getMotUrl', () => {
    it('should get Mot Url', () => {
      spyOn(urlProvider.appConfigProvider, 'getAppConfig').and.returnValue({
        mot: { motHistoryUrl: 'url' },
      } as AppConfig);
      expect(urlProvider.getMotUrl('')).toBe('url');
    });
  });
  describe('getTestCentreJournalUrl', () => {
    it('should get teamJournalUrl', () => {
      spyOn(urlProvider.appConfigProvider, 'getAppConfig').and.returnValue({
        journal: { teamJournalUrl: 'url' },
      } as AppConfig);
      expect(urlProvider.getTestCentreJournalUrl()).toBe('url');
    });
  });
  describe('getCandidateStandardDataUrl', () => {
    it('should get standardUrl', () => {
      spyOn(urlProvider.appConfigProvider, 'getAppConfig').and.returnValue({
        driver: { standardUrl: 'url' },
      } as AppConfig);
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

  describe('getRefDataTestCentreUrl', () => {
    it('should return appConfigProvider testCentreUrl', () => {
      spyOn(urlProvider.appConfigProvider, 'getAppConfig').and.returnValue({
        refData: { testCentreUrl: '1' },
      } as AppConfig);
      expect(urlProvider.getRefDataTestCentreUrl()).toBe('1');
    });
  });

  describe('getDelegatedExaminerSearchBookingUrl', () => {
    it('should replace {applicationReference} with passed variable', () => {
      spyOn(urlProvider.appConfigProvider, 'getAppConfig').and.returnValue({
        journal: { delegatedExaminerSearchBookingUrl: '{applicationReference}' },
      } as AppConfig);
      expect(urlProvider.getDelegatedExaminerSearchBookingUrl('test')).toBe('test');
    });
    it('should replace {applicationReference} with 00000000 if there is no passed variable', () => {
      spyOn(urlProvider.appConfigProvider, 'getAppConfig').and.returnValue({
        journal: { delegatedExaminerSearchBookingUrl: '{applicationReference}' },
      } as AppConfig);
      expect(urlProvider.getDelegatedExaminerSearchBookingUrl(null)).toBe('00000000');
    });
  });

  describe('getRekeyFindUserUrl', () => {
    it('should replace {staffNumber} with passed variable', () => {
      spyOn(urlProvider.appConfigProvider, 'getAppConfig').and.returnValue({
        user: { findUserUrl: '{staffNumber}' },
      } as AppConfig);
      expect(urlProvider.getRekeyFindUserUrl('test')).toBe('test');
    });
    it('should replace {staffNumber} with 00000000 if there is no passed variable', () => {
      spyOn(urlProvider.appConfigProvider, 'getAppConfig').and.returnValue({
        user: { findUserUrl: '{staffNumber}' },
      } as AppConfig);
      expect(urlProvider.getRekeyFindUserUrl(null)).toBe('00000000');
    });
  });

  describe('getCandidateSignatureUrl', () => {
    it('should replace {drivingLicenceNumber} with passed variable', () => {
      spyOn(urlProvider.appConfigProvider, 'getAppConfig').and.returnValue({
        driver: { signatureUrl: '{drivingLicenceNumber}' },
      } as AppConfig);
      expect(urlProvider.getCandidateSignatureUrl('test')).toBe('test');
    });
  });

  describe('getCandidatePhotoUrl', () => {
    it('should replace {drivingLicenceNumber} with passed variable', () => {
      spyOn(urlProvider.appConfigProvider, 'getAppConfig').and.returnValue({
        driver: { photographUrl: '{drivingLicenceNumber}' },
      } as AppConfig);
      expect(urlProvider.getCandidatePhotoUrl('test')).toBe('test');
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
