import { fakeAsync, flushMicrotasks, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SecureStorageMock } from '@ionic-native-mocks/secure-storage';
import { SecureStorage } from '@ionic-native/secure-storage';
import { Network } from '@ionic-native/network';
import { NetworkMock } from 'ionic-mocks';
import { ExaminerWorkSchedule } from '@dvsa/mes-journal-schema';
import { configureTestSuite } from 'ng-bullet';
import { JournalProvider } from '../journal';
import { AuthenticationProvider } from '../../authentication/authentication';
import { AuthenticationProviderMock } from '../../authentication/__mocks__/authentication.mock';
import { UrlProvider } from '../../url/url';
import { UrlProviderMock } from '../../url/__mocks__/url.mock';
import { DataStoreProvider } from '../../data-store/data-store';
import { NetworkStateProvider } from '../../network-state/network-state';
import { NetworkStateProviderMock } from '../../network-state/__mocks__/network-state.mock';
import { DateTime, Duration } from '../../../shared/helpers/date-time';
import { DataStoreProviderMock } from '../../data-store/__mocks__/data-store.mock';
import { AppConfigProvider } from '../../app-config/app-config';
import { AppConfigProviderMock } from '../../app-config/__mocks__/app-config.mock';
import { DateTimeProvider } from '../../date-time/date-time';
import { DateTimeProviderMock } from '../../date-time/__mocks__/date-time.mock';

fdescribe('JournalProvider', () => {

  let journalProvider: JournalProvider;
  let httpMock: HttpTestingController;
  let authProviderMock: AuthenticationProvider;
  let urlProviderMock: UrlProvider;
  let dataStoreMock: DataStoreProvider;
  let appConfigProviderMock: AppConfigProvider;
  let cacheDays: number = 7;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        JournalProvider,
        { provide: UrlProvider, useClass: UrlProviderMock },
        { provide: AuthenticationProvider, useClass: AuthenticationProviderMock },
        { provide: DataStoreProvider, useClass: DataStoreProviderMock },
        { provide: NetworkStateProvider, useClass: NetworkStateProviderMock },
        // { provide: SecureStorage, useClass: SecureStorageMock },
        // { provide: Network, useClass: NetworkMock },
        { provide: AppConfigProvider, useClass: AppConfigProviderMock },
        { provide: DateTimeProvider, useClass: DateTimeProviderMock },
      ],
    });
  });

  beforeEach(() => {
    httpMock = TestBed.inject(HttpTestingController);
    journalProvider = TestBed.inject(JournalProvider);
    authProviderMock = TestBed.inject(AuthenticationProvider);
    urlProviderMock = TestBed.inject(UrlProvider);
    dataStoreMock = TestBed.inject(DataStoreProvider);
    appConfigProviderMock = TestBed.inject(AppConfigProvider);
    cacheDays = appConfigProviderMock.getAppConfig().journal.daysToCacheJournalData;
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
    beforeEach(() => {
      spyOn(dataStoreMock, 'setItem').and.returnValue(Promise.resolve(''));
    });
    it('should empty cached data if cache is too old', fakeAsync(async () => {
      const exampleSchedule: ExaminerWorkSchedule = {
        examiner: { staffNumber: '1234' },
      };
      const agedCache = {
        dateStored: new DateTime().add(-(cacheDays + 1), Duration.DAY).format('YYYY/MM/DD'),
        data: exampleSchedule,
      };
      // override mock getItem as we need data to test
      spyOn(dataStoreMock, 'getItem').and.returnValue(Promise.resolve(JSON.stringify(agedCache)));
      spyOn(journalProvider, 'emptyCachedData').and.callThrough();

      journalProvider.getAndConvertOfflineJournal().then((data) => {
        flushMicrotasks();
        expect(journalProvider.emptyCachedData).toHaveBeenCalled();
        expect(dataStoreMock.setItem).toHaveBeenCalled();
        expect(data).toEqual({} as ExaminerWorkSchedule);
      });
    }));

    it('should return data without emptying cache if data is not too old', () => {
      const exampleSchedule: ExaminerWorkSchedule = {
        examiner: { staffNumber: '1234' },
      };
      const dataWthinWindowCache = {
        dateStored: new DateTime().add(cacheDays, Duration.DAY).format('YYYY/MM/DD'),
        data: exampleSchedule,
      };

      // override mock getItem as we need data to test
      spyOn(dataStoreMock, 'getItem').and.returnValue(Promise.resolve(JSON.stringify(dataWthinWindowCache)));
      spyOn(journalProvider, 'emptyCachedData');

      journalProvider.getAndConvertOfflineJournal().then((data) => {
        expect(journalProvider.emptyCachedData).not.toHaveBeenCalled();
        expect(dataStoreMock.setItem).toHaveBeenCalledTimes(0);
        expect(data).toEqual(dataWthinWindowCache.data);
      });
    });
  });

  describe('getJournal', () => {
    it('should obtain the personal journal URL from the journal provider, passing the cached employee ID', () => {
      journalProvider.getJournal(null).subscribe();

      httpMock.expectOne('https://www.example.com/api/v1/journals/12345678/personal');
      expect(authProviderMock.getEmployeeId).toHaveBeenCalled();
      expect(authProviderMock.isInUnAuthenticatedMode).toHaveBeenCalled();
      expect(urlProviderMock.getPersonalJournalUrl).toHaveBeenCalledWith('12345678');
    });
  });
});
