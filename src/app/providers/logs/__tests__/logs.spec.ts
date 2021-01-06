import { TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { configureTestSuite } from 'ng-bullet';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UrlProvider } from '../../url/url';
import { UrlProviderMock, LOGS_SERVICE_URL } from '../../url/__mocks__/url.mock';
import { LogsProvider } from '../logs';
import { LogType } from '../../../shared/models/log.model';
import { AuthenticationProvider } from '../../authentication/authentication';
import { AuthenticationProviderMock } from '../../authentication/__mocks__/authentication.mock';

describe('LogsProvider', () => {
  let logsProvider: LogsProvider;
  let httpMock: HttpTestingController;
  let urlProviderMock: UrlProvider;

  configureTestSuite(() => {
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
        { provide: UrlProvider, useClass: UrlProviderMock },
        { provide: AuthenticationProvider, useClass: AuthenticationProviderMock },
        Store,
      ],
    });
  });

  beforeEach(() => {
    httpMock = TestBed.get(HttpTestingController);
    logsProvider = TestBed.get(LogsProvider);
    urlProviderMock = TestBed.get(UrlProvider);
  });

  describe('sendLogs', () => {
    it('should successfully send the logs', () => {
      logsProvider.sendLogs([{
        type: LogType.DEBUG,
        message: 'Successfully logged multiple',
        timestamp: new Date().getTime(),
        drivingExaminerId: '1234567',
      }]).subscribe();

      httpMock.expectOne(LOGS_SERVICE_URL);
      expect(urlProviderMock.getLogsServiceUrl).toHaveBeenCalled();
    });
  });
});
