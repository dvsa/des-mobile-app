import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
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

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        SearchProvider,
        { provide: UrlProvider, useClass: UrlProviderMock },
        { provide: AppConfigProvider, useClass: AppConfigProviderMock },
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    searchProvider = TestBed.inject(SearchProvider);
    urlProvider = TestBed.inject(UrlProvider);
    spyOn(urlProvider, 'getTestResultServiceUrl');
  });

  describe('driverNumberSearch', () => {
    it('should call the search endpoint with the provided driver number', () => {
      searchProvider.driverNumberSearch('12345').subscribe();
      httpMock.expectOne('https://www.example.com/api/v1/test-result?driverNumber=12345');
      expect(urlProvider.getTestResultServiceUrl).toHaveBeenCalled();
    });
  });

  describe('applicationReferenceSearch', () => {
    it('should call the search endpoint with the provided application reference', () => {
      searchProvider.applicationReferenceSearch('12345').subscribe();
      httpMock.expectOne('https://www.example.com/api/v1/test-result?applicationReference=12345');
      expect(urlProvider.getTestResultServiceUrl).toHaveBeenCalled();
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
        category: 'A',
      };

      searchProvider.advancedSearch(params).subscribe();

      httpMock.expectOne(
        // eslint-disable-next-line max-len
        'https://www.example.com/api/v1/test-result?startDate=12-12-12&endDate=12-12-12&staffNumber=12345&dtcCode=abc&excludeAutoSavedTests=true&category=A&activityCode=1',
      );
      expect(urlProvider.getTestResultServiceUrl).toHaveBeenCalled();
    });
    it('should not add the paramters to the url if they are not provided', () => {
      searchProvider.advancedSearch({}).subscribe(() => {
        httpMock.expectOne(
          'https://www.example.com/api/v1/test-result',
        );
      });
      expect(urlProvider.getTestResultServiceUrl).toHaveBeenCalled();
    });
  });

  describe('getTestResult', () => {
    it('should call the search endpoint and get a test result back', () => {
      searchProvider.getTestResult('12345', '123456').subscribe();
      httpMock.expectOne('https://www.example.com/api/v1/test-result/12345/123456');
      expect(urlProvider.getTestResultServiceUrl).toHaveBeenCalled();
    });
  });

});
