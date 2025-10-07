import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { Observable, from, interval, of } from 'rxjs';
import { catchError, concatMap, map, switchMap, takeUntil, withLatestFrom } from 'rxjs/operators';

import { AppConfigProvider } from '@providers/app-config/app-config';
import { DataStoreProvider, LocalStorageError, LocalStorageKey } from '@providers/data-store/data-store';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { LogsProvider } from '@providers/logs/logs';
import { ConnectionStatus, NetworkStateProvider } from '@providers/network-state/network-state';
import { DateTime } from '@shared/helpers/date-time';
import { Log } from '@shared/models/log.model';
import { StoreModel } from '@shared/models/store.model';

import { get } from 'lodash-es';
import * as logsActions from './logs.actions';
import { StopLogPolling } from './logs.actions';
import { getLogsState } from './logs.reducer';

type LogCache = {
  dateStored: string;
  data: Log[];
};

@Injectable()
export class LogsEffects {
  // every 1 minute
  private static readonly fallBackInterval = 60000;
  localStorageErrorTimer: Date = new Date();

  constructor(
    private actions$: Actions,
    private store$: Store<StoreModel>,
    private logsProvider: LogsProvider,
    private appConfigProvider: AppConfigProvider,
    private dataStore: DataStoreProvider,
    private networkStateProvider: NetworkStateProvider,
    private dateTimeProvider: DateTimeProvider
  ) {}

  startSendingLogsEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(logsActions.StartSendingLogs.type),
      switchMap(() => {
        return interval(
          this.appConfigProvider.getAppConfig()?.logsAutoSendInterval || LogsEffects.fallBackInterval
        ).pipe(
          takeUntil(this.actions$.pipe(ofType(StopLogPolling))),
          map(() => logsActions.SendLogs())
        );
      })
    )
  );

  persistLogEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(logsActions.PersistLog.type),
      concatMap((action) => of(action).pipe(withLatestFrom(this.store$.pipe(select(getLogsState))))),
      switchMap(async ([, logs]) => {
        await this.saveLogs(logs);
        return { type: '[LogsEffects] Persist Log Finished' };
      })
    )
  );

  loadLogEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(logsActions.LoadLog),
      switchMap(() => {
        return this.getPersistedLogs().pipe(map((logs: Log[]) => logsActions.LoadLogState({ payload: logs })));
      })
    )
  );

  saveLogEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(logsActions.SaveLog),
      switchMap(() => {
        return of(logsActions.PersistLog());
      })
    )
  );

  sendLogsSuccessEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(logsActions.SendLogsSuccess),
      switchMap(() => {
        return of(logsActions.PersistLog());
      })
    )
  );

  sendLogsEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(logsActions.SendLogs),
      concatMap((action) => of(action).pipe(withLatestFrom(this.store$.pipe(select(getLogsState))))),
      switchMap(([, logs]) => {
        if (this.networkStateProvider.getNetworkState() === ConnectionStatus.OFFLINE) {
          return of({ type: '[LogsEffects] Connection Status OFFLINE' });
        }
        return this.logsProvider.sendLogs(logs).pipe(
          map(() => {
            const timestamps = logs.map((log: Log) => log.timestamp);
            return logsActions.SendLogsSuccess({ timestamps });
          }),
          catchError((err) => {
            return of(logsActions.SendLogsFailure(err));
          })
        );
      })
    )
  );

  // @TODO: MES-7129 All this has to be moved to the LogsProvider or DataStore provider

  getPersistedLogs = (): Observable<Log[]> => {
    return from(this.getAndConvertPersistedLogs());
  };

  getAndConvertPersistedLogs = (): Promise<Log[]> =>
    this.dataStore
      .getItem(LocalStorageKey.LOGS)
      .then((data) => {
        const logCache: LogCache = JSON.parse(data);
        const cachedDate = DateTime.at(logCache.dateStored);
        if (this.isCacheTooOld(cachedDate, new DateTime())) {
          return this.emptyCachedData();
        }
        return logCache.data;
      })
      .catch(() => {
        const emptyLogData: Log[] = [];
        return emptyLogData;
      });

  saveLogs = async (logData: Log[]) => {
    if (logData && logData.length > 0) {
      const logDataToStore: LogCache = {
        dateStored: this.dateTimeProvider.now().format('YYYY/MM/DD'),
        data: logData,
      };
      /*
      If the latest description is related to the local storage error, there is a chance that it will
      cause an infinite loop due to the system logging an error whenever storage fails.
      In these cases, we want to log the storage errors with a cooldown to break the infinite loop.
      THIS IS A TEMPORARY FIX AND NEEDS TO BE REPLACED IN THE FUTURE
       */
      const latestDescription: string = get(logData[logData.length - 1], 'description', '') as string;
      if (latestDescription.includes(LocalStorageError.LOCAL_STORAGE_ERROR)) {
        const newDate: Date = new Date();
        if (newDate.getTime() - this.localStorageErrorTimer.getTime() > 60) {
          this.localStorageErrorTimer = newDate;
          await this.dataStore.setItem(LocalStorageKey.LOGS, JSON.stringify(logDataToStore));
        }
      } else {
        await this.dataStore.setItem(LocalStorageKey.LOGS, JSON.stringify(logDataToStore));
      }
    }
  };

  isCacheTooOld = (dateStored: DateTime, now: DateTime): boolean => {
    return dateStored.daysDiff(now) > this.appConfigProvider.getAppConfig().daysToCacheLogs;
  };

  emptyCachedData = () => {
    const emptyLogData: Log[] = [];
    const logDataToStore: LogCache = {
      dateStored: this.dateTimeProvider.now().format('YYYY/MM/DD'),
      data: emptyLogData,
    };
    this.dataStore.setItem(LocalStorageKey.LOGS, JSON.stringify(logDataToStore)).then(() => {});
    return emptyLogData;
  };
}
