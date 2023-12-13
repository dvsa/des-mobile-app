import { TestBed, waitForAsync } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { SentryIonicErrorHandler } from '@app/sentry-error-handler';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { Log } from '@shared/models/log.model';
import { SaveLog } from '@store/logs/logs.actions';
import { AppInfoProvider } from '@providers/app-info/app-info';
import { AppConfig } from '@providers/app-config/app-config.model';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { AppConfigProviderMock } from '@providers/app-config/__mocks__/app-config.mock';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { LogHelper } from '@providers/logs/logs-helper';
import { LogHelperMock } from '@providers/logs/__mocks__/logs-helper.mock';
import { AppInfoProviderMock } from '@providers/app-info/__mocks__/app-info.mock';
import { ExaminerRole } from '@providers/app-config/constants/examiner-role.constants';
import { HttpErrorResponse } from '@angular/common/http';

describe('SentryIonicErrorHandler', () => {
  let sentryErrorHandler: SentryIonicErrorHandler;
  const mockLog = { drivingExaminerId: '1234567' } as Log;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        SentryIonicErrorHandler,
        {
          provide: AppInfoProvider,
          useClass: AppInfoProviderMock,
        },
        {
          provide: AuthenticationProvider,
          useClass: AuthenticationProviderMock,
        },
        {
          provide: AppConfigProvider,
          useClass: AppConfigProviderMock,
        },
        {
          provide: LogHelper,
          useClass: LogHelperMock,
        },
        provideMockStore(),
      ],
    });

    sentryErrorHandler = TestBed.inject(SentryIonicErrorHandler);

    spyOn(sentryErrorHandler.store$, 'dispatch');
    spyOn(sentryErrorHandler.appConfigProvider, 'getAppConfigAsync')
      .and
      .returnValue(Promise.resolve({
        role: ExaminerRole.DE,
      } as AppConfig));
  }));

  describe('handleError', () => {
    it('should call through to all providers and pass error to Sentry', async () => {
      spyOn(sentryErrorHandler.appInfoProvider, 'getFullVersionNumber')
        .and
        .returnValue(
          Promise.resolve('4.8.0.5'),
        );

      await sentryErrorHandler.handleError(new Error('Some runtime error'));
      expect(sentryErrorHandler.appConfigProvider.getAppConfigAsync)
        .toHaveBeenCalled();
      expect(sentryErrorHandler.appInfoProvider.getFullVersionNumber)
        .toHaveBeenCalled();
      expect(sentryErrorHandler.authenticationProvider.getEmployeeIdFromIDToken)
        .toHaveBeenCalled();
      expect(sentryErrorHandler.store$.dispatch)
        .not
        .toHaveBeenCalled();
    });
    it('should attempt call to providers and fail, but report via store$ dispatch', async () => {
      spyOn(sentryErrorHandler.appInfoProvider, 'getFullVersionNumber')
        .and
        .returnValue(
          Promise.reject(new Error('RUNTIME err')),
        );
      spyOn(sentryErrorHandler.logHelper, 'createLog')
        .and
        .returnValue(mockLog);

      await sentryErrorHandler.handleError(new Error('Some runtime error'));
      expect(sentryErrorHandler.appConfigProvider.getAppConfigAsync)
        .toHaveBeenCalled();
      expect(sentryErrorHandler.appInfoProvider.getFullVersionNumber)
        .toHaveBeenCalled();
      expect(sentryErrorHandler.authenticationProvider.getEmployeeIdFromIDToken)
        .toHaveBeenCalled();
      expect(sentryErrorHandler.store$.dispatch)
        .toHaveBeenCalledWith(SaveLog({ payload: mockLog }));
    });
    it('should attempt call to providers and fail, and report a custom error object', async () => {
      spyOn(sentryErrorHandler.appInfoProvider, 'getFullVersionNumber')
        .and
        .returnValue(
          Promise.reject(new Error('RUNTIME err')),
        );
      spyOn(sentryErrorHandler.logHelper, 'createLog')
        .and
        .returnValue(mockLog);

      await sentryErrorHandler.handleError({ err: 'some error' });
      expect(sentryErrorHandler.store$.dispatch)
        .toHaveBeenCalledWith(SaveLog({ payload: mockLog }));
    });
    it('should not call to any provider if an instance of HttpErrorResponse', async () => {
      await sentryErrorHandler.handleError(new HttpErrorResponse({
        status: 403,
        url: 'https://logs-service.com',
      }));
      expect(sentryErrorHandler.appConfigProvider.getAppConfigAsync)
        .not
        .toHaveBeenCalled();
    });
  });
});
