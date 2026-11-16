import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ExaminerWorkSchedule } from '@dvsa/mes-journal-schema';
import { JournalData } from '@dvsa/mes-test-schema/categories/common';
import { DateTime, Duration } from '@shared/helpers/date-time';
import { of } from 'rxjs';
import { take } from 'rxjs/operators';
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { unitTestErrorCause } from '../../../../test-setup.vitest';
import { AppConfigProviderMock } from '../../app-config/__mocks__/app-config.mock';
import { AppConfigProvider } from '../../app-config/app-config';
import { AppConfig } from '../../app-config/app-config.model';
import { AuthenticationProviderMock } from '../../authentication/__mocks__/authentication.mock';
import { AuthenticationProvider } from '../../authentication/authentication';
import { DataStoreProviderMock } from '../../data-store/__mocks__/data-store.mock';
import { DataStoreProvider, LocalStorageKey } from '../../data-store/data-store';
import { DateTimeProviderMock } from '../../date-time/__mocks__/date-time.mock';
import { DateTimeProvider } from '../../date-time/date-time';
import { NetworkStateProviderMock } from '../../network-state/__mocks__/network-state.mock';
import { NetworkConnectionStatus, NetworkStateProvider } from '../../network-state/network-state';
import { UrlProviderMock } from '../../url/__mocks__/url.mock';
import { UrlProvider } from '../../url/url';
import { JournalProvider } from '../journal';

describe('JournalProvider', () => {
  let journalProvider: JournalProvider;
  let httpMock: HttpTestingController;
  let authProviderMock: AuthenticationProvider;
  let dataStoreMock: DataStoreProvider;
  let appConfigProviderMock: AppConfigProvider;
  let networkStateProviderMock: NetworkStateProvider;
  let dateTimeProviderMock: DateTimeProvider;
  let cacheDays = 7;
  const mockJournalUrl: string = 'https://www.example.com/api/v1/journals/12345678/personal';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        JournalProvider,
        {
          provide: UrlProvider,
          useClass: UrlProviderMock,
        },
        {
          provide: AuthenticationProvider,
          useClass: AuthenticationProviderMock,
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
          provide: AppConfigProvider,
          useClass: AppConfigProviderMock,
        },
        {
          provide: DateTimeProvider,
          useClass: DateTimeProviderMock,
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    journalProvider = TestBed.inject(JournalProvider);
    authProviderMock = TestBed.inject(AuthenticationProvider);
    dataStoreMock = TestBed.inject(DataStoreProvider);
    appConfigProviderMock = TestBed.inject(AppConfigProvider);
    networkStateProviderMock = TestBed.inject(NetworkStateProvider);
    dateTimeProviderMock = TestBed.inject(DateTimeProvider);
    cacheDays = appConfigProviderMock.getAppConfig().journal.daysToCacheJournalData;
  });

  afterAll(() => {
    httpMock.verify();
  });

  describe('getJournal', () => {
    beforeEach(() => {
      vi.spyOn(authProviderMock, 'getEmployeeId').mockReturnValue('12345678');
      vi.spyOn(journalProvider.urlProvider, 'getPersonalJournalUrl');
      vi.spyOn(appConfigProviderMock, 'getAppConfig').mockReturnValue({ requestTimeout: 100000 } as AppConfig);
      vi.spyOn(authProviderMock, 'isOffline').mockReturnValue(false);
      vi.spyOn(journalProvider, 'getOfflineJournal').mockReturnValue(of({}));
    });

    it('should get the journal record using the url', () => {
      vi.spyOn(journalProvider.networkStateProvider, 'getNetworkState').mockReturnValue(NetworkConnectionStatus.ONLINE);
      journalProvider
        .getJournal(null)
        .pipe(take(1))
        .subscribe(() => {});
      expect(authProviderMock.getEmployeeId).toHaveBeenCalled();
      expect(journalProvider.urlProvider.getPersonalJournalUrl).toHaveBeenCalledWith('12345678');
      expect(journalProvider.networkStateProvider.getNetworkState).toHaveBeenCalled();
      const req = httpMock.expectOne((request) => request.url === mockJournalUrl);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('If-Modified-Since')).toBe(null);
    });
    it('should get the offline journal when lastRefreshed is null and ConnectionStatus is OFFLINE', () => {
      vi.spyOn(journalProvider.networkStateProvider, 'getNetworkState').mockReturnValue(
        NetworkConnectionStatus.OFFLINE
      );
      journalProvider
        .getJournal(null)
        .pipe(take(1))
        .subscribe(() => {});
      expect(authProviderMock.getEmployeeId).toHaveBeenCalled();
      expect(journalProvider.urlProvider.getPersonalJournalUrl).toHaveBeenCalledWith('12345678');
      expect(journalProvider.networkStateProvider.getNetworkState).toHaveBeenCalled();
      expect(journalProvider.getOfflineJournal).toHaveBeenCalled();
    });
    it('should get the journal record with an `If-Modified-Since` header', () => {
      vi.spyOn(journalProvider.networkStateProvider, 'getNetworkState').mockReturnValue(NetworkConnectionStatus.ONLINE);
      journalProvider
        .getJournal(new Date('2020-01-01'))
        .pipe(take(1))
        .subscribe(() => {});
      expect(authProviderMock.getEmployeeId).toHaveBeenCalled();
      expect(journalProvider.urlProvider.getPersonalJournalUrl).toHaveBeenCalledWith('12345678');
      expect(journalProvider.networkStateProvider.getNetworkState).toHaveBeenCalled();
      const req = httpMock.expectOne((request) => request.url === mockJournalUrl);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('If-Modified-Since')).toBeDefined();
    });
    it('should get the offline journal when lastRefreshed is defined but ConnectionStatus is OFFLINE', () => {
      vi.spyOn(journalProvider.networkStateProvider, 'getNetworkState').mockReturnValue(
        NetworkConnectionStatus.OFFLINE
      );
      journalProvider
        .getJournal(new Date('2020-01-01'))
        .pipe(take(1))
        .subscribe(() => {});
      expect(authProviderMock.getEmployeeId).toHaveBeenCalled();
      expect(journalProvider.urlProvider.getPersonalJournalUrl).toHaveBeenCalledWith('12345678');
      expect(journalProvider.networkStateProvider.getNetworkState).toHaveBeenCalled();
      expect(journalProvider.getOfflineJournal).toHaveBeenCalled();
    });
  });

  describe('isCacheTooOld', () => {
    it('should return true if date is greater than cacheDays days ago', () => {
      const today = new DateTime();
      const tooOld = new DateTime().add(-(cacheDays + 1), Duration.DAY);
      expect(journalProvider.isCacheTooOld(tooOld, today)).toBe(true);
    });

    it('should return true if date is less than or equal to cacheDays days ago', () => {
      const today = new DateTime();
      const withinWindow = new DateTime().add(-cacheDays, Duration.DAY);
      expect(journalProvider.isCacheTooOld(withinWindow, today)).toBe(false);
    });
  });

  describe('getAndConvertOfflineJournal', () => {
    it('should return data without emptying cache if data is not too old', async () => {
      const exampleSchedule: ExaminerWorkSchedule = {
        examiner: { staffNumber: '1234' },
      };
      const dataWthinWindowCache = {
        dateStored: new DateTime().add(cacheDays, Duration.DAY).format('YYYY/MM/DD'),
        data: exampleSchedule,
      };

      // override mock getItem as we need data to test
      vi.spyOn(dataStoreMock, 'getItem').mockReturnValue(Promise.resolve(JSON.stringify(dataWthinWindowCache)));
      vi.spyOn(dataStoreMock, 'setItem').mockReturnValue(Promise.resolve(''));
      vi.spyOn(journalProvider, 'emptyCachedData').mockReturnValue(undefined);

      const data = await journalProvider.getAndConvertOfflineJournal();
      expect(data).toEqual(dataWthinWindowCache.data);
    });
    it('should empty cached data if cache is too old', async () => {
      vi.useFakeTimers();
      try {
        const exampleSchedule: ExaminerWorkSchedule = {
          examiner: { staffNumber: '1234' },
        };
        const agedCache = {
          dateStored: new DateTime().add(-(cacheDays + 1), Duration.DAY).format('YYYY/MM/DD'),
          data: exampleSchedule,
        };
        // override mock getItem as we need data to test
        vi.spyOn(dataStoreMock, 'getItem').mockReturnValue(Promise.resolve(JSON.stringify(agedCache)));
        vi.spyOn(dataStoreMock, 'setItem').mockReturnValue(Promise.resolve(''));
        vi.spyOn(journalProvider, 'emptyCachedData');

        const data = await journalProvider.getAndConvertOfflineJournal();
        expect(journalProvider.emptyCachedData).toHaveBeenCalled();
        expect(dataStoreMock.setItem).toHaveBeenCalled();
        expect(data).toEqual({} as ExaminerWorkSchedule);
      } finally {
        vi.useRealTimers();
      }
    });
    it('should fall through catch and not run then code in then', async () => {
      vi.spyOn(dataStoreMock, 'getItem').mockImplementation(() =>
        Promise.reject(new Error('cannot get', { cause: unitTestErrorCause }))
      );
      vi.spyOn(journalProvider, 'isCacheTooOld').mockReturnValue(undefined);
      await journalProvider.getAndConvertOfflineJournal();
      expect(journalProvider.isCacheTooOld).not.toHaveBeenCalled();
    });
  });

  describe('saveJournalForOffline', () => {
    beforeEach(() => {
      vi.spyOn(dateTimeProviderMock, 'now').mockReturnValue(new DateTime('2021-01-01'));
      vi.spyOn(dataStoreMock, 'setItem').mockReturnValue(Promise.resolve(''));
      vi.spyOn(networkStateProviderMock, 'getNetworkState').mockReturnValue(NetworkConnectionStatus.ONLINE);
    });
    it('should set the journalData param into data store', () => {
      const journalDataToStore = {
        dateStored: '2021/01/01',
        data: {},
      };
      journalProvider.saveJournalForOffline({} as JournalData);
      expect(networkStateProviderMock.getNetworkState).toHaveBeenCalled();
      expect(dataStoreMock.setItem).toHaveBeenCalledWith(LocalStorageKey.JOURNAL, JSON.stringify(journalDataToStore));
    });
  });

  describe('getOfflineJournal', () => {
    beforeEach(() => {
      vi.spyOn(journalProvider, 'getAndConvertOfflineJournal').mockReturnValue(Promise.resolve({}));
    });
    it('should convert the promise returned from getAndConvertOfflineJournal into an observable', () => {
      journalProvider
        .getOfflineJournal()
        .pipe(take(1))
        .subscribe((response) => {
          expect(response).toEqual({});
        });
      expect(journalProvider.getAndConvertOfflineJournal).toHaveBeenCalled();
    });
  });
});
