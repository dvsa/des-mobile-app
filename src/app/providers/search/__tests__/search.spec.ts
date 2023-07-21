import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { take } from 'rxjs/operators';
import { UrlProvider } from '../../url/url';
import { UrlProviderMock } from '../../url/__mocks__/url.mock';
import { SearchProvider } from '../search';
import { AdvancedSearchParams } from '../search.models';
import { AppConfigProvider } from '../../app-config/app-config';
import { AppConfigProviderMock } from '../../app-config/__mocks__/app-config.mock';

describe('SearchProvider', () => {
  let searchProvider: SearchProvider;
  let urlProvider: UrlProvider;
  let httpMock: HttpTestingController;
  const mockParams = {
    startDate: '12-12-12',
    endDate: '12-12-12',
    staffNumber: '12345',
    costCode: 'abc',
    excludeAutoSavedTests: 'true',
    activityCode: '1',
    category: 'A',
    passCertificateNumber: 'A1',
    rekey: true,
  } as AdvancedSearchParams;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        SearchProvider,
        {
          provide: UrlProvider,
          useClass: UrlProviderMock,
        },
        {
          provide: AppConfigProvider,
          useClass: AppConfigProviderMock,
        },
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    searchProvider = TestBed.inject(SearchProvider);
    urlProvider = TestBed.inject(UrlProvider);
    spyOn(urlProvider, 'getTestResultServiceUrl');
  });

  afterAll(() => {
    httpMock.verify();
  });

  describe('driverNumberSearch', () => {
    it('should call getTestResultServiceUrl and check request is a GET', () => {
      searchProvider
        .driverNumberSearch('12345')
        .pipe(take(1))
        .subscribe((response) => {
          expect(response)
            .toEqual([]);
        });

      const req = httpMock.expectOne('https://www.example.com/api/v1/test-result?driverNumber=12345');
      expect(req.request.method)
        .toBe('GET');
      req.flush([]);
    });
  });
  describe('applicationReferenceSearch', () => {
    it('should call getTestResultServiceUrl and check request is a GET', () => {
      searchProvider
        .applicationReferenceSearch('12345')
        .pipe(take(1))
        .subscribe((response) => {
          expect(response)
            .toEqual([]);
        });

      const req = httpMock.expectOne('https://www.example.com/api/v1/test-result?applicationReference=12345');
      expect(req.request.method)
        .toBe('GET');
      req.flush([]);
    });
  });
  describe('advancedSearch', () => {
    it('should call the search endpoint with the correct values for all parameters', () => {
      const params: AdvancedSearchParams = {
        startDate: '12-12-12',
        endDate: '12-12-12',
        staffNumber: '12345',
        costCode: 'abc',
        excludeAutoSavedTests: 'true',
        activityCode: '1',
        rekey: true,
        category: 'A',
        passCertificateNumber: 'A1',
      };
    it('should call getTestResultServiceUrl and check request is a GET', () => {
      searchProvider
        .advancedSearch(mockParams)
        .pipe(take(1))
        .subscribe((response) => {
          expect(response)
            .toEqual([]);
        });

      const req = httpMock.expectOne(
        // eslint-disable-next-line max-len
        'https://www.example.com/api/v1/test-result?startDate=12-12-12&endDate=12-12-12&staffNumber=12345&costCode=abc&excludeAutoSavedTests=true&activityCode=1&rekey=true&category=A&passCertificateNumber=A1',
      );

      expect(req.request.method)
        .toBe('GET');
      req.flush([]);
    });
  });
  describe('getTestResult', () => {
    it('should call getTestResultServiceUrl and check request is a GET', () => {
      searchProvider
        .getTestResult('12345', '6789')
        .pipe(take(1))
        .subscribe((response) => {
          expect(response.body)
            .toEqual([]);
        });

      const req = httpMock.expectOne('https://www.example.com/api/v1/test-result/12345/6789');

      expect(req.request.method)
        .toBe('GET');
      req.flush([]);
    });
  });
  describe('getRegeneratedEmails', () => {
    it('should call getTestResultServiceUrl and check request is a GET', () => {
      searchProvider
        .getRegeneratedEmails('12345')
        .pipe(take(1))
        .subscribe((response) => {
          expect(response)
            .toEqual('some-val');
        });

      const req = httpMock.expectOne('https://www.example.com/api/v1/test-result/regeneratedemails/12345');

      expect(req.request.method)
        .toBe('GET');
      req.flush('some-val');
    });
  });
});
