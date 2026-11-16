import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { HttpErrorResponse } from '@angular/common/http';
import { SentryIonicErrorHandler } from '@app/sentry-error-handler';
import { AppConfigProviderMock } from '@providers/app-config/__mocks__/app-config.mock';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { AppConfig } from '@providers/app-config/app-config.model';
import { ExaminerRole } from '@providers/app-config/constants/examiner-role.constants';
import { AppInfoProviderMock } from '@providers/app-info/__mocks__/app-info.mock';
import { AppInfoProvider } from '@providers/app-info/app-info';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { LogHelperMock } from '@providers/logs/__mocks__/logs-helper.mock';
import { LogHelper } from '@providers/logs/logs-helper';
import { Log } from '@shared/models/log.model';
import { SaveLog } from '@store/logs/logs.actions';
import { unitTestErrorCause } from '../../test-setup.vitest';

describe('SentryIonicErrorHandler', () => {
  let sentryErrorHandler: SentryIonicErrorHandler;
  const mockLog = { drivingExaminerId: '1234567' } as Log;

  beforeEach(() => {
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

    vi.spyOn(sentryErrorHandler.store$, 'dispatch').mockReturnValue(undefined);
    vi.spyOn(sentryErrorHandler.appConfigProvider, 'getAppConfigAsync').mockReturnValue(
      Promise.resolve({
        role: ExaminerRole.DE,
      } as AppConfig)
    );
  });

  describe('handleError', () => {
    it('should call through to all providers and pass error to Sentry', async () => {
      vi.spyOn(sentryErrorHandler.appInfoProvider, 'getFullVersionNumber').mockReturnValue(Promise.resolve('4.8.0.5'));

      await sentryErrorHandler.handleError(new Error('Some runtime error', { cause: unitTestErrorCause }));
      expect(sentryErrorHandler.appConfigProvider.getAppConfigAsync).toHaveBeenCalled();
      expect(sentryErrorHandler.appInfoProvider.getFullVersionNumber).toHaveBeenCalled();
      expect(sentryErrorHandler.authenticationProvider.getEmployeeId).toHaveBeenCalled();
      expect(sentryErrorHandler.store$.dispatch).not.toHaveBeenCalled();
    });
    it('should attempt call to providers and fail, but report via store$ dispatch', async () => {
      vi.spyOn(sentryErrorHandler.appInfoProvider, 'getFullVersionNumber').mockReturnValue(
        Promise.reject(new Error('RUNTIME err', { cause: unitTestErrorCause }))
      );
      vi.spyOn(sentryErrorHandler.logHelper, 'createLog').mockReturnValue(mockLog);

      await sentryErrorHandler.handleError(new Error('Some runtime error', { cause: unitTestErrorCause }));
      expect(sentryErrorHandler.appConfigProvider.getAppConfigAsync).toHaveBeenCalled();
      expect(sentryErrorHandler.appInfoProvider.getFullVersionNumber).toHaveBeenCalled();
      expect(sentryErrorHandler.authenticationProvider.getEmployeeId).toHaveBeenCalled();
      expect(sentryErrorHandler.store$.dispatch).toHaveBeenCalledWith(SaveLog({ payload: mockLog }));
    });
    it('should attempt call to providers and fail, and report a custom error object', async () => {
      vi.spyOn(sentryErrorHandler.appInfoProvider, 'getFullVersionNumber').mockReturnValue(
        Promise.reject(new Error('RUNTIME err', { cause: unitTestErrorCause }))
      );
      vi.spyOn(sentryErrorHandler.logHelper, 'createLog').mockReturnValue(mockLog);

      await sentryErrorHandler.handleError({
        message: 'message',
        name: 'name',
        stack: 'stack',
        originalError: { name: 'originalName', message: 'originalMessage' },
      });
      expect(sentryErrorHandler.store$.dispatch).toHaveBeenCalledWith(SaveLog({ payload: mockLog }));
    });
    it('should not call to any provider if an instance of HttpErrorResponse', async () => {
      await sentryErrorHandler.handleError(
        new HttpErrorResponse({
          status: 403,
          url: 'https://logs-service.com',
        })
      );
      expect(sentryErrorHandler.appConfigProvider.getAppConfigAsync).not.toHaveBeenCalled();
    });
  });
});
