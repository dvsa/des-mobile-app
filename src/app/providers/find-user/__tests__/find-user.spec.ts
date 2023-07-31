import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UrlProvider } from '../../url/url';
import { UrlProviderMock } from '../../url/__mocks__/url.mock';
import { AppConfigProvider } from '../../app-config/app-config';
import { AppConfigProviderMock } from '../../app-config/__mocks__/app-config.mock';
import { FindUserProvider } from '../find-user';

xdescribe('FindUserProvider', () => {

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

  xdescribe('userExists', () => {
    it('should call the find user URL with the staff number', () => {
      const staffNumber = 1234567;

      findUserProvider.userExists(staffNumber)
        .subscribe();
      httpMock.expectOne('https://www.example.com/api/v1/users/search/1234567');
      expect(urlProvider.getRekeyFindUserUrl)
        .toHaveBeenCalledWith('1234567');
    });
  });

});
