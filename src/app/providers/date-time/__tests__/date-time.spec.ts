import { TestBed } from '@angular/core/testing';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { AppConfigProviderMock } from '@providers/app-config/__mocks__/app-config.mock';
import { DateTime } from '@shared/helpers/date-time';

describe('Compression Provider', () => {

  let dateTimeProvider: DateTimeProvider;
  let appConfig: AppConfigProvider;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DateTimeProvider,
        { provide: AppConfigProvider, useClass: AppConfigProviderMock },
      ],
    });

    appConfig = TestBed.inject(AppConfigProvider);
    dateTimeProvider = TestBed.inject(DateTimeProvider);
  });

  describe('now', () => {
    it('should return a new DateTime if timeTravelDate is empty', () => {
      spyOn(appConfig, 'getAppConfig').and.returnValue({ timeTravelDate: null } as any);
      expect(dateTimeProvider.now()).toBeInstanceOf(DateTime);
    });
    it('should return a new DateTime if timeTravelDate is empty', () => {
      spyOn(appConfig, 'getAppConfig').and.returnValue({ timeTravelDate: 'Tue Jan 1 2000 01:01:11 GMT+2000' } as any);
      spyOn(DateTime, 'at');
      dateTimeProvider.now();
      expect(DateTime.at).toHaveBeenCalledWith('Tue Jan 1 2000 01:01:11 GMT+2000');
    });
  });
});
