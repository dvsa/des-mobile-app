import { TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Log, LogType } from '@shared/models/log.model';
import { take } from 'rxjs/operators';
import { UrlProvider } from '../../url/url';
import { LOGS_SERVICE_URL, UrlProviderMock } from '../../url/__mocks__/url.mock';
import { LogsProvider } from '../logs';
import { AuthenticationProvider } from '../../authentication/authentication';
import { AuthenticationProviderMock } from '../../authentication/__mocks__/authentication.mock';

describe('LogsProvider', () => {
  let logsProvider: LogsProvider;
  let httpMock: HttpTestingController;
  const log = {
    type: LogType.DEBUG,
    message: 'Successfully logged multiple',
    timestamp: new Date().getTime(),
    drivingExaminerId: '1234567',
  } as Log;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        StoreModule.forRoot({
          appInfo: () => ({
            versionNumber: '5',
          }),
        }),
      ],
      providers: [
        LogsProvider,
        {
          provide: UrlProvider,
          useClass: UrlProviderMock,
        },
        {
          provide: AuthenticationProvider,
          useClass: AuthenticationProviderMock,
        },
        Store,
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    logsProvider = TestBed.inject(LogsProvider);
  });

  afterAll(() => {
    httpMock.verify();
  });

  describe('sendLogs', () => {
    it('should call getLogsServiceUrl and check request is a POST with payload', () => {
      logsProvider
        .sendLogs([log])
        .pipe(take(1))
        .subscribe((response) => {
          expect(response)
            .toEqual({});
        });

      const req = httpMock.expectOne(
        (request) => request.url === LOGS_SERVICE_URL,
      );

      expect(req.request.body)
        .toEqual([log]);
      expect(req.request.method)
        .toBe('POST');
      req.flush({});
    });
  });
});
