import { TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UrlProvider } from '../../url/url';
import { UrlProviderMock } from '../../url/__mocks__/url.mock';
import { AppConfigProvider } from '../../app-config/app-config';
import { AppConfigProviderMock } from '../../app-config/__mocks__/app-config.mock';
import { TestCentreJournalProvider } from '../test-centre-journal';
import { AppConfig } from '../../app-config/app-config.model';

describe('TestCentreJournalProvider', () => {
  let testCentreJournalProvider: TestCentreJournalProvider;
  let httpMock: HttpTestingController;
  let urlProviderMock: UrlProvider;
  let appConfigProviderMock: AppConfigProvider;
  const mockTestCentreJournalUrl = 'https://www.example.com/api/v1/journals/testcentre';

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        TestCentreJournalProvider,
        { provide: UrlProvider, useClass: UrlProviderMock },
        { provide: AppConfigProvider, useClass: AppConfigProviderMock },
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    testCentreJournalProvider = TestBed.inject(TestCentreJournalProvider);
    urlProviderMock = TestBed.inject(UrlProvider);
    appConfigProviderMock = TestBed.inject(AppConfigProvider);
  }));

  describe('getTestCentreJournal', () => {
    beforeEach(() => {
      spyOn(appConfigProviderMock, 'getAppConfig').and.returnValue({ requestTimeout: 100000 } as AppConfig);
    });
    it('should call through to the URL provider for the test centre journal URL', () => {
      testCentreJournalProvider.getTestCentreJournal().subscribe();
      httpMock.expectOne('https://www.example.com/api/v1/journals/testcentre');
      expect(urlProviderMock.getTestCentreJournalUrl).toHaveBeenCalled();
    });
    it('should use a GET request', () => {
      testCentreJournalProvider.getTestCentreJournal().subscribe(() => {});
      const req = httpMock.expectOne((request) => request.url === mockTestCentreJournalUrl);
      expect(req.request.method).toBe('GET');
    });
  });
});
