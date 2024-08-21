import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RekeySearchParams } from '@providers/rekey-search/rekey-search.model';
import { take } from 'rxjs/operators';
import { UrlProviderMock } from '../../url/__mocks__/url.mock';
import { UrlProvider } from '../../url/url';
import { RekeySearchProvider } from '../rekey-search';

describe('RekeySearchProvider', () => {
  let rekeySearchProvider: RekeySearchProvider;
  let urlProvider: UrlProvider;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        RekeySearchProvider,
        {
          provide: UrlProvider,
          useClass: UrlProviderMock,
        },
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    rekeySearchProvider = TestBed.inject(RekeySearchProvider);
    urlProvider = TestBed.inject(UrlProvider);
    spyOn(urlProvider, 'getRekeySearchUrl');
  });

  afterAll(() => {
    httpMock.verify();
  });

  describe('getBooking', () => {
    it('should call getRekeySearchUrl and check request is a GET', () => {
      rekeySearchProvider
        .getBooking({ applicationReference: '123456' } as RekeySearchParams)
        .pipe(take(1))
        .subscribe((response) => {
          expect(response).toEqual({});
        });

      const req = httpMock.expectOne('https://www.example.com/api/v1/journals/654321/search?appRef=123456');

      expect(req.request.method).toBe('GET');
      req.flush({});
    });
  });
});
