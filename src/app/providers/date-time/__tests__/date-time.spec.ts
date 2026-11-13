import { TestBed } from '@angular/core/testing';
import { AppConfigProviderMock } from '@providers/app-config/__mocks__/app-config.mock';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { AppConfig } from '@providers/app-config/app-config.model';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { DateTime } from '@shared/helpers/date-time';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('DateTimeProvider', () => {
  let dateTimeProvider: DateTimeProvider;
  let appConfig: AppConfigProvider;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DateTimeProvider,
        {
          provide: AppConfigProvider,
          useClass: AppConfigProviderMock,
        },
      ],
    });

    appConfig = TestBed.inject(AppConfigProvider);
    dateTimeProvider = TestBed.inject(DateTimeProvider);
  });

  describe('now', () => {
    it('should return a new DateTime if timeTravelDate is empty', () => {
      vi.spyOn(appConfig, 'getAppConfig').mockReturnValue({ timeTravelDate: null } as AppConfig);
      expect(dateTimeProvider.now()).toBeInstanceOf(DateTime);
    });
    it('should return a new DateTime if timeTravelDate is empty', () => {
      vi.spyOn(appConfig, 'getAppConfig').mockReturnValue({
        timeTravelDate: 'Tue Jan 1 2000 01:01:11 GMT+2000',
      } as AppConfig);
      vi.spyOn(DateTime, 'at').mockReturnValue(undefined);
      dateTimeProvider.now();
      expect(DateTime.at).toHaveBeenCalledWith('Tue Jan 1 2000 01:01:11 GMT+2000');
    });
  });
});
