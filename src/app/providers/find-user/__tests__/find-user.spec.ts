import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { take } from 'rxjs/operators';
import { UrlProvider } from '../../url/url';
import { UrlProviderMock } from '../../url/__mocks__/url.mock';
import { AppConfigProvider } from '../../app-config/app-config';
import { AppConfigProviderMock } from '../../app-config/__mocks__/app-config.mock';
import { FindUserProvider } from '../find-user';

describe('FindUserProvider', () => {
  let findUserProvider: FindUserProvider;
  let urlProvider: UrlProvider;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        FindUserProvider,
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
    findUserProvider = TestBed.inject(FindUserProvider);
    urlProvider = TestBed.inject(UrlProvider);
    spyOn(urlProvider, 'getRekeyFindUserUrl');
  });

  afterAll(() => {
    httpMock.verify();
  });

  describe('userExists', () => {
    it('should call getRekeyFindUserUrl and check request is a GET', () => {
      const staffNumber = 1234567;

      findUserProvider
        .userExists(staffNumber)
        .pipe(take(1))
        .subscribe((response) => {
          expect(response)
            .toEqual({});
        });

      const req = httpMock.expectOne(
        (request) => request.url === 'https://www.example.com/api/v1/users/search/1234567',
      );

      expect(req.request.method)
        .toBe('GET');
      req.flush({});
    });
  });
});
