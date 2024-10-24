import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Store, StoreModule } from '@ngrx/store';
import { ReplaySubject } from 'rxjs';

import { AppConfigProviderMock } from '@providers/app-config/__mocks__/app-config.mock';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { DataStoreProviderMock } from '@providers/data-store/__mocks__/data-store.mock';
import { DataStoreProvider } from '@providers/data-store/data-store';
import { DateTimeProviderMock } from '@providers/date-time/__mocks__/date-time.mock';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { LogsProviderMock } from '@providers/logs/__mocks__/logs.mock';
import { LogsProvider } from '@providers/logs/logs';
import { NetworkStateProviderMock } from '@providers/network-state/__mocks__/network-state.mock';
import { NetworkStateProvider } from '@providers/network-state/network-state';

import { DateTime, Duration } from '@shared/helpers/date-time';
import { Log, LogType } from '@shared/models/log.model';
import * as logsActions from '../logs.actions';
import { LogsEffects } from '../logs.effects';
import { logsReducer } from '../logs.reducer';

describe('LogsEffects', () => {
  let effects: LogsEffects;
  let actions$: ReplaySubject<any>;
  let cacheDays: number;
  let appConfigProviderMock: AppConfigProvider;
  let dataStoreMock: DataStoreProvider;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          logs: logsReducer,
        }),
      ],
      providers: [
        LogsEffects,
        provideMockActions(() => actions$),
        { provide: AppConfigProvider, useClass: AppConfigProviderMock },
        { provide: NetworkStateProvider, useClass: NetworkStateProviderMock },
        { provide: DataStoreProvider, useClass: DataStoreProviderMock },
        { provide: LogsProvider, useClass: LogsProviderMock },
        { provide: DateTimeProvider, useClass: DateTimeProviderMock },
        Store,
      ],
    });

    // ARRANGE
    actions$ = new ReplaySubject(1);
    effects = TestBed.inject(LogsEffects);
    appConfigProviderMock = TestBed.inject(AppConfigProvider);
    cacheDays = appConfigProviderMock.getAppConfig().daysToCacheLogs;
    dataStoreMock = TestBed.inject(DataStoreProvider);
  });

  it('should dispatch the persist logs action when the logs post successfully', (done) => {
    // ARRANGE
    const timestamps: number[] = [12345678];
    // ACT
    actions$.next(logsActions.SendLogsSuccess({ timestamps }));
    // ASSERT
    effects.sendLogsSuccessEffect$.subscribe((result) => {
      expect(result.type).toEqual(logsActions.PersistLog.type);
      done();
    });
  });

  it('should dispatch the persist logs action when an individual log is added', (done) => {
    // ARRANGE
    const log: Log = {
      test: 'xyz',
      type: LogType.DEBUG,
      message: 'test',
      timestamp: 1234567,
      drivingExaminerId: '1234567',
    };
    // ACT
    actions$.next(logsActions.SaveLog({ payload: log }));
    // ASSERT
    effects.saveLogEffect$.subscribe((result) => {
      expect(result.type).toEqual(logsActions.PersistLog.type);
      done();
    });
  });

  xdescribe('persistLogs', () => {
    it('should call saveLogs', fakeAsync((done) => {
      // ARRANGE
      spyOn(effects, 'saveLogs').and.callThrough();
      // ACT
      actions$.next(logsActions.PersistLog());
      tick();
      // ASSERT
      effects.persistLogEffect$.subscribe((result) => {
        expect(effects.saveLogs).toHaveBeenCalled();
        expect(result.type).toEqual('[LogsEffects] Persist Log Finished');
        done();
      });
    }));
  });
  describe('LoadLog', () => {
    it('should call getPersistedLogs and return LoadLogState', fakeAsync((done) => {
      // ARRANGE
      spyOn(effects, 'getPersistedLogs').and.callThrough();
      // ACT
      actions$.next(logsActions.LoadLog());
      tick();
      // ASSERT
      effects.persistLogEffect$.subscribe((result) => {
        expect(effects.getPersistedLogs).toHaveBeenCalled();
        expect(result instanceof logsActions.LoadLogState).toBe(true);
        done();
      });
    }));
  });

  describe('getAndConvertPersistedLogs', () => {
    it('should empty cached data if cache is too old', (done) => {
      const log: Log = {
        test: 'xyz',
        type: LogType.DEBUG,
        message: 'test',
        timestamp: 1234567,
        drivingExaminerId: '1234567',
      };

      const agedCache = {
        dateStored: new DateTime().add(-(cacheDays + 1), Duration.DAY).format('YYYY/MM/DD'),
        data: log,
      };

      // override mock getItem as we need data to test
      // @ts-ignore
      dataStoreMock.getItem.and.callFake(() => Promise.resolve(JSON.stringify(agedCache)));

      spyOn(effects, 'emptyCachedData').and.callThrough();

      effects.getAndConvertPersistedLogs().then((data) => {
        expect(effects.emptyCachedData).toHaveBeenCalled();
        expect(dataStoreMock.setItem).toHaveBeenCalled();
        expect(data).toEqual([] as Log[]);
        done();
      });
    });

    xit('should return data without emptying cache if data is not too old', (done) => {
      const log: Log = {
        test: 'xyz',
        type: LogType.DEBUG,
        message: 'test',
        timestamp: 1234567,
        drivingExaminerId: '1234567',
      };
      const dataWithinWindowCache = {
        dateStored: new DateTime().add(cacheDays - 1, Duration.DAY).format('YYYY/MM/DD'),
        data: [log],
      };

      // override mock getItem as we need data to test
      // @ts-ignore
      dataStoreMock.getItem.and.callFake(() => Promise.resolve(JSON.stringify(dataWithinWindowCache)));

      spyOn(effects, 'emptyCachedData').and.callThrough();

      effects.getAndConvertPersistedLogs().then((data) => {
        expect(effects.emptyCachedData).toHaveBeenCalledTimes(0);
        expect(dataStoreMock.setItem).toHaveBeenCalledTimes(0);
        expect(data).toEqual(dataWithinWindowCache.data);
        done();
      });
    });
  });

  describe('isCacheTooOld', () => {
    it('should return true if date is greater than cacheDays days ago', (done) => {
      const today = new DateTime();
      const tooOld = new DateTime().add(-(cacheDays + 1), Duration.DAY);
      expect(effects.isCacheTooOld(tooOld, today)).toBe(true);
      done();
    });

    it('should return true if date is less than or equal to cacheDays days ago', (done) => {
      const today = new DateTime();
      const withinWindow = new DateTime().add(-cacheDays, Duration.DAY);
      expect(effects.isCacheTooOld(withinWindow, today)).toBe(false);
      done();
    });
  });
});
