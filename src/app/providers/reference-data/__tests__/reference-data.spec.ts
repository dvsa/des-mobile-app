import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AppConfigProviderMock } from '@providers/app-config/__mocks__/app-config.mock';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { RefDataTestCentreResponse, ReferenceDataProvider } from '@providers/reference-data/reference-data';
import { UrlProviderMock } from '@providers/url/__mocks__/url.mock';
import { UrlProvider } from '@providers/url/url';
import { take } from 'rxjs/operators';

describe('ReferenceDataProvider', () => {
  let referenceDataProvider: ReferenceDataProvider;
  let urlProvider: UrlProvider;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ReferenceDataProvider,
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
    referenceDataProvider = TestBed.inject(ReferenceDataProvider);
    urlProvider = TestBed.inject(UrlProvider);
    spyOn(urlProvider, 'getRefDataTestCentreUrl');
  });

  afterAll(() => {
    httpMock.verify();
  });

  describe('getTestCentres', () => {
    it('should call getRefDataTestCentreUrl and check request is a GET', () => {
      referenceDataProvider
        .getTestCentres()
        .pipe(take(1))
        .subscribe((response) => {
          expect(response).toEqual({} as RefDataTestCentreResponse);
        });

      const req = httpMock.expectOne((request) => request.url === 'https://ref-data/testcentre');

      expect(req.request.method).toBe('GET');
      req.flush({});
    });
  });
});
