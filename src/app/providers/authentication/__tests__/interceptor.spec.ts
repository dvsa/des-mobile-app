import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpRequest } from '@angular/common/http';
import { Platform } from '@ionic/angular';
import { PlatformMock } from 'ionic-mocks';
import { of } from 'rxjs';
import { JournalProvider } from '../../journal/journal';
import { AuthInterceptor } from '../interceptor';
import { AppConfigProvider } from '../../app-config/app-config';
import { AppConfigProviderMock } from '../../app-config/__mocks__/app-config.mock';
import { AuthenticationProvider } from '../authentication';
import { AuthenticationProviderMock } from '../__mocks__/authentication.mock';
import { UrlProvider } from '../../url/url';
import { UrlProviderMock } from '../../url/__mocks__/url.mock';
import { DataStoreProvider } from '../../data-store/data-store';
import { DataStoreProviderMock } from '../../data-store/__mocks__/data-store.mock';
import { NetworkStateProvider } from '../../network-state/network-state';
import { NetworkStateProviderMock } from '../../network-state/__mocks__/network-state.mock';
import { DateTimeProvider } from '../../date-time/date-time';
import { DateTimeProviderMock } from '../../date-time/__mocks__/date-time.mock';

describe('Authentication interceptor', () => {
  let httpMock: HttpTestingController;
  let interceptor: AuthInterceptor;
  let journalProvider: JournalProvider;
  let platform: Platform;
  let urlProvider: UrlProvider;
  let journalUrl: string;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthInterceptor,
        JournalProvider,
        { provide: Platform, useFactory: () => PlatformMock.instance() },
        { provide: AppConfigProvider, useClass: AppConfigProviderMock },
        { provide: AuthenticationProvider, useClass: AuthenticationProviderMock },
        { provide: UrlProvider, useClass: UrlProviderMock },
        { provide: DataStoreProvider, useClass: DataStoreProviderMock },
        { provide: NetworkStateProvider, useClass: NetworkStateProviderMock },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true,
        },
        { provide: DateTimeProvider, useClass: DateTimeProviderMock },
      ],
    });
    platform = TestBed.inject(Platform);
    httpMock = TestBed.inject(HttpTestingController);
    interceptor = TestBed.inject(AuthInterceptor);
    journalProvider = TestBed.inject(JournalProvider);
    urlProvider = TestBed.inject(UrlProvider);
    journalUrl = urlProvider.getPersonalJournalUrl('');
  });

  afterEach(() => httpMock.verify());

  describe('Interceptor', () => {

    it('should compile', () => {
      expect(interceptor).toBeDefined();
    });

    it('should not modify the request if not on ios', () => {
      platform.is = jasmine.createSpy('platform.is').and.returnValue(false);
      journalProvider.getJournal(null).subscribe(
        () => {},
        () => {},
      );
      const httpRequest = httpMock.expectOne(journalUrl);
      expect(httpRequest.request.headers.has('Authorization')).toBe(false);
    });

    it('should add the authentication header to the request if running on ios', (done) => {
      platform.is = jasmine.createSpy('platform.is').and.returnValue(true);
      const next: any = {
        handle: (request: HttpRequest<any>) => {
          expect(request.headers.has('Authorization')).toEqual(true);
          expect(request.headers.get('Authorization')).toEqual('token');
          return of({});
        },
      };
      const req = new HttpRequest<any>('GET', journalUrl);
      interceptor.intercept(req, next).subscribe(() => done());
    });

  });

});
