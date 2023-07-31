import { fakeAsync, flushMicrotasks, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ExaminerWorkSchedule } from '@dvsa/mes-journal-schema';
import { JournalData } from '@dvsa/mes-test-schema/categories/common';
import { of } from 'rxjs';
import { DateTime, Duration } from '@shared/helpers/date-time';
import { JournalProvider } from '../journal';
import { AuthenticationProvider } from '../../authentication/authentication';
import { AuthenticationProviderMock } from '../../authentication/__mocks__/authentication.mock';
import { UrlProvider } from '../../url/url';
import { UrlProviderMock } from '../../url/__mocks__/url.mock';
import { DataStoreProvider } from '../../data-store/data-store';
import { ConnectionStatus, NetworkStateProvider } from '../../network-state/network-state';
import { NetworkStateProviderMock } from '../../network-state/__mocks__/network-state.mock';
import { DataStoreProviderMock } from '../../data-store/__mocks__/data-store.mock';
import { AppConfigProvider } from '../../app-config/app-config';
import { AppConfigProviderMock } from '../../app-config/__mocks__/app-config.mock';
import { DateTimeProvider } from '../../date-time/date-time';
import { DateTimeProviderMock } from '../../date-time/__mocks__/date-time.mock';
import { AppConfig } from '../../app-config/app-config.model';

xdescribe('JournalProvider', () => {
  let journalProvider: JournalProvider;
  let httpMock: HttpTestingController;
  let authProviderMock: AuthenticationProvider;
  let urlProviderMock: UrlProvider;
  let dataStoreMock: DataStoreProvider;
  let appConfigProviderMock: AppConfigProvider;
  let networkStateProviderMock: NetworkStateProvider;
  let dateTimeProviderMock: DateTimeProvider;
  let cacheDays: number = 7;
  const mockJournalUrl: string = 'https://www.example.com/api/v1/journals/12345678/personal';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
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
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    journalProvider = TestBed.inject(JournalProvider);
    authProviderMock = TestBed.inject(AuthenticationProvider);
    urlProviderMock = TestBed.inject(UrlProvider);
    dataStoreMock = TestBed.inject(DataStoreProvider);
    appConfigProviderMock = TestBed.inject(AppConfigProvider);
    networkStateProviderMock = TestBed.inject(NetworkStateProvider);
    dateTimeProviderMock = TestBed.inject(DateTimeProvider);
    cacheDays = appConfigProviderMock.getAppConfig().journal.daysToCacheJournalData;
  });

  xdescribe('getJournal', () => {
    beforeEach(() => {
      spyOn(authProviderMock, 'getEmployeeId')
        .and
        .returnValue('12345678');
      spyOn(journalProvider.urlProvider, 'getPersonalJournalUrl');
      spyOn(appConfigProviderMock, 'getAppConfig')
        .and
        .returnValue({ requestTimeout: 100000 } as AppConfig);
      spyOn(authProviderMock, 'isInUnAuthenticatedMode')
        .and
        .returnValue(false);
      spyOn(journalProvider, 'getOfflineJournal')
        .and
        .returnValue(of({}));
    });

    it('should get the journal record using the url', () => {
      spyOn(journalProvider.networkStateProvider, 'getNetworkState')
        .and
        .returnValue(ConnectionStatus.ONLINE);
      journalProvider.getJournal(null)
        .subscribe(() => {
        });
      expect(authProviderMock.getEmployeeId)
        .toHaveBeenCalled();
      expect(journalProvider.urlProvider.getPersonalJournalUrl)
        .toHaveBeenCalledWith('12345678');
      expect(journalProvider.networkStateProvider.getNetworkState)
        .toHaveBeenCalled();
      const req = httpMock.expectOne((request) => request.url === mockJournalUrl);
      expect(req.request.method)
        .toBe('GET');
      expect(req.request.headers.get('If-Modified-Since'))
        .toBe(null);
    });
    it('should get the offline journal when lastRefreshed is null and ConnectionStatus is OFFLINE', () => {
      spyOn(journalProvider.networkStateProvider, 'getNetworkState')
        .and
        .returnValue(ConnectionStatus.OFFLINE);
      journalProvider.getJournal(null)
        .subscribe(() => {
        });
      expect(authProviderMock.getEmployeeId)
        .toHaveBeenCalled();
      expect(journalProvider.urlProvider.getPersonalJournalUrl)
        .toHaveBeenCalledWith('12345678');
      expect(journalProvider.networkStateProvider.getNetworkState)
        .toHaveBeenCalled();
      expect(journalProvider.getOfflineJournal)
        .toHaveBeenCalled();
    });
    it('should get the journal record with an `If-Modified-Since` header', () => {
      spyOn(journalProvider.networkStateProvider, 'getNetworkState')
        .and
        .returnValue(ConnectionStatus.ONLINE);
      journalProvider.getJournal(new Date('2020-01-01'))
        .subscribe(() => {
        });
      expect(authProviderMock.getEmployeeId)
        .toHaveBeenCalled();
      expect(journalProvider.urlProvider.getPersonalJournalUrl)
        .toHaveBeenCalledWith('12345678');
      expect(journalProvider.networkStateProvider.getNetworkState)
        .toHaveBeenCalled();
      const req = httpMock.expectOne((request) => request.url === mockJournalUrl);
      expect(req.request.method)
        .toBe('GET');
      expect(req.request.headers.get('If-Modified-Since'))
        .toBeDefined();
    });
    it('should get the offline journal when lastRefreshed is defined but ConnectionStatus is OFFLINE', () => {
      spyOn(journalProvider.networkStateProvider, 'getNetworkState')
        .and
        .returnValue(ConnectionStatus.OFFLINE);
      journalProvider.getJournal(new Date('2020-01-01'))
        .subscribe(() => {
        });
      expect(authProviderMock.getEmployeeId)
        .toHaveBeenCalled();
      expect(journalProvider.urlProvider.getPersonalJournalUrl)
        .toHaveBeenCalledWith('12345678');
      expect(journalProvider.networkStateProvider.getNetworkState)
        .toHaveBeenCalled();
      expect(journalProvider.getOfflineJournal)
        .toHaveBeenCalled();
    });
  });

  xdescribe('isCacheTooOld', () => {
    it('should return true if date is greater than cacheDays days ago', () => {
      const today = new DateTime();
      const tooOld = new DateTime().add(-(cacheDays + 1), Duration.DAY);
      expect(journalProvider.isCacheTooOld(tooOld, today))
        .toBe(true);
    });

    it('should return true if date is less than or equal to cacheDays days ago', () => {
      const today = new DateTime();
      const withinWindow = new DateTime().add(-cacheDays, Duration.DAY);
      expect(journalProvider.isCacheTooOld(withinWindow, today))
        .toBe(false);
    });
  });

  xdescribe('getAndConvertOfflineJournal', () => {
    it('should return data without emptying cache if data is not too old', async () => {
      const exampleSchedule: ExaminerWorkSchedule = {
        examiner: { staffNumber: '1234' },
      };
      const dataWthinWindowCache = {
        dateStored: new DateTime().add(cacheDays, Duration.DAY)
          .format('YYYY/MM/DD'),
        data: exampleSchedule,
      };

      // override mock getItem as we need data to test
      spyOn(dataStoreMock, 'getItem')
        .and
        .returnValue(Promise.resolve(JSON.stringify(dataWthinWindowCache)));
      spyOn(dataStoreMock, 'setItem')
        .and
        .returnValue(Promise.resolve(''));
      spyOn(journalProvider, 'emptyCachedData');

      const data = await journalProvider.getAndConvertOfflineJournal();
      expect(data)
        .toEqual(dataWthinWindowCache.data);
    });
    it('should empty cached data if cache is too old', fakeAsync(async () => {
      const exampleSchedule: ExaminerWorkSchedule = {
        examiner: { staffNumber: '1234' },
      };
      const agedCache = {
        dateStored: new DateTime().add(-(cacheDays + 1), Duration.DAY)
          .format('YYYY/MM/DD'),
        data: exampleSchedule,
      };
      // override mock getItem as we need data to test
      spyOn(dataStoreMock, 'getItem')
        .and
        .returnValue(Promise.resolve(JSON.stringify(agedCache)));
      spyOn(dataStoreMock, 'setItem')
        .and
        .returnValue(Promise.resolve(''));
      spyOn(journalProvider, 'emptyCachedData')
        .and
        .callThrough();

      journalProvider.getAndConvertOfflineJournal()
        .then((data) => {
          flushMicrotasks();
          expect(journalProvider.emptyCachedData)
            .toHaveBeenCalled();
          expect(dataStoreMock.setItem)
            .toHaveBeenCalled();
          expect(data)
            .toEqual({} as ExaminerWorkSchedule);
        });
    }));
    it('should fall through catch and not run then code in then', async () => {
      spyOn(dataStoreMock, 'getItem')
        .and
        .callFake(() => Promise.reject(new Error('cannot get')));
      spyOn(journalProvider, 'isCacheTooOld');
      await journalProvider.getAndConvertOfflineJournal();
      expect(journalProvider.isCacheTooOld)
        .not
        .toHaveBeenCalled();
    });
  });

  xdescribe('getJournal', () => {
    it('should obtain the personal journal URL from the journal provider, passing the cached employee ID', () => {
      journalProvider.getJournal(null)
        .subscribe();

      httpMock.expectOne('https://www.example.com/api/v1/journals/12345678/personal');
      expect(authProviderMock.getEmployeeId)
        .toHaveBeenCalled();
      expect(authProviderMock.isInUnAuthenticatedMode)
        .toHaveBeenCalled();
      expect(urlProviderMock.getPersonalJournalUrl)
        .toHaveBeenCalledWith('12345678');
    });
  });

  xdescribe('saveJournalForOffline', () => {
    beforeEach(() => {
      spyOn(dateTimeProviderMock, 'now')
        .and
        .returnValue(new DateTime('2021-01-01'));
      spyOn(dataStoreMock, 'setItem')
        .and
        .returnValue(Promise.resolve(''));
      spyOn(networkStateProviderMock, 'getNetworkState')
        .and
        .returnValue(ConnectionStatus.ONLINE);
    });
    it('should set the journalData param into data store', () => {
      const journalDataToStore = {
        dateStored: '2021/01/01',
        data: {},
      };
      journalProvider.saveJournalForOffline({} as JournalData);
      expect(networkStateProviderMock.getNetworkState)
        .toHaveBeenCalled();
      expect(dataStoreMock.setItem)
        .toHaveBeenCalledWith('JOURNAL', JSON.stringify(journalDataToStore));
    });
  });

  xdescribe('getOfflineJournal', () => {
    beforeEach(() => {
      spyOn(journalProvider, 'getAndConvertOfflineJournal')
        .and
        .returnValue(Promise.resolve({}));
    });
    it('should convert the promise returned from getAndConvertOfflineJournal into an observable', () => {
      journalProvider.getOfflineJournal()
        .subscribe((response) => {
          expect(response)
            .toEqual({});
        });
      expect(journalProvider.getAndConvertOfflineJournal)
        .toHaveBeenCalled();
    });
  });
});
