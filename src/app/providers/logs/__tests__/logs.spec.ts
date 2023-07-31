import { TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LogType } from '@shared/models/log.model';
import { UrlProvider } from '../../url/url';
import { LOGS_SERVICE_URL, UrlProviderMock } from '../../url/__mocks__/url.mock';
import { LogsProvider } from '../logs';
import { AuthenticationProvider } from '../../authentication/authentication';
import { AuthenticationProviderMock } from '../../authentication/__mocks__/authentication.mock';

xdescribe('LogsProvider', () => {
  let logsProvider: LogsProvider;
  let httpMock: HttpTestingController;
  let urlProviderMock: UrlProvider;

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
    urlProviderMock = TestBed.inject(UrlProvider);
  });

  xdescribe('sendLogs', () => {
    it('should successfully send the logs', () => {
      logsProvider.sendLogs([{
        type: LogType.DEBUG,
        message: 'Successfully logged multiple',
        timestamp: new Date().getTime(),
        drivingExaminerId: '1234567',
      }])
        .subscribe();

      httpMock.expectOne(LOGS_SERVICE_URL);
      expect(urlProviderMock.getLogsServiceUrl)
        .toHaveBeenCalled();
    });
  });
});
