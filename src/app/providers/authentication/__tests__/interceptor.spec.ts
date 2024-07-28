import { HTTP_INTERCEPTORS, HttpHandler, HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Platform } from '@ionic/angular';
import { PlatformMock } from '@mocks/index.mock';
import { of } from 'rxjs';
import { AppConfigProviderMock } from '../../app-config/__mocks__/app-config.mock';
import { AppConfigProvider } from '../../app-config/app-config';
import { DataStoreProviderMock } from '../../data-store/__mocks__/data-store.mock';
import { DataStoreProvider } from '../../data-store/data-store';
import { DateTimeProviderMock } from '../../date-time/__mocks__/date-time.mock';
import { DateTimeProvider } from '../../date-time/date-time';
import { JournalProvider } from '../../journal/journal';
import { NetworkStateProviderMock } from '../../network-state/__mocks__/network-state.mock';
import { NetworkStateProvider } from '../../network-state/network-state';
import { UrlProviderMock } from '../../url/__mocks__/url.mock';
import { UrlProvider } from '../../url/url';
import { AuthenticationProviderMock } from '../__mocks__/authentication.mock';
import { AuthenticationProvider } from '../authentication';
import { AuthInterceptor } from '../interceptor';

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
        {
          provide: Platform,
          useClass: PlatformMock,
        },
        {
          provide: AppConfigProvider,
          useClass: AppConfigProviderMock,
        },
        {
          provide: AuthenticationProvider,
          useClass: AuthenticationProviderMock,
        },
        {
          provide: UrlProvider,
          useClass: UrlProviderMock,
        },
        {
          provide: DataStoreProvider,
          useClass: DataStoreProviderMock,
        },
        {
          provide: NetworkStateProvider,
          useClass: NetworkStateProviderMock,
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true,
        },
        {
          provide: DateTimeProvider,
          useClass: DateTimeProviderMock,
        },
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
      journalProvider.getJournal(null).subscribe({
        next: () => {},
        error: () => {},
      });
      const httpRequest = httpMock.expectOne(journalUrl);
      expect(httpRequest.request.headers.has('Authorization')).toBe(false);
    });

    it('should add the authentication header to the request if running on ios', (done) => {
      platform.is = jasmine.createSpy('platform.is').and.returnValue(true);
      const next = {
        handle: (request: HttpRequest<any>) => {
          expect(request.headers.has('Authorization')).toEqual(true);
          expect(request.headers.get('Authorization')).toEqual('token');
          return of({});
        },
      } as HttpHandler;
      const req = new HttpRequest<any>('GET', journalUrl);
      interceptor.intercept(req, next).subscribe(() => done());
    });
  });
});
