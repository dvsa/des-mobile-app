import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import {
  switchMap, map, catchError, withLatestFrom, concatMap,
} from 'rxjs/operators';
import {
  of, interval, Observable, from,
} from 'rxjs';

import { NetworkStateProvider, ConnectionStatus } from '@providers/network-state/network-state';
import { DataStoreProvider } from '@providers/data-store/data-store';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { LogsProvider } from '@providers/logs/logs';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { StoreModel } from '../../app/shared/models/store.model';
import { Log } from '../../app/shared/models/log.model';

import * as logsActions from './logs.actions';
import { getLogsState } from './logs.reducer';

import { DateTime } from '../../app/shared/helpers/date-time';

type LogCache = {
  dateStored: string,
  data: Log[],
};

@Injectable()
export class LogsEffects {
  constructor(
    private actions$: Actions,
    private store$: Store<StoreModel>,
    private logsProvider: LogsProvider,
    private appConfigProvider: AppConfigProvider,
    private dataStore: DataStoreProvider,
    private networkStateProvider: NetworkStateProvider,
    private dateTimeProvider: DateTimeProvider,
  ) { }

  startSendingLogsEffect$ = createEffect(() => this.actions$.pipe(
    ofType(logsActions.StartSendingLogs.type),
    switchMap(() => {
      return interval(this.appConfigProvider.getAppConfig().logsAutoSendInterval)
        .pipe(
          map(() => logsActions.SendLogs()),
        );
    }),
  ));

  persistLogEffect$ = createEffect(() => this.actions$.pipe(
    ofType(logsActions.PersistLog.type),
    concatMap((action) => of(action).pipe(
      withLatestFrom(
        this.store$.pipe(
          select(getLogsState),
        ),
      ),
    )),
    switchMap(([, logs]) => {
      this.saveLogs(logs);
      return of({ type: '[LogsEffects] Persist Log Finished' });
    }),
  ));

  loadLogEffect$ = createEffect(() => this.actions$.pipe(
    ofType(logsActions.LoadLog.type),
    switchMap(() => {
      return this.getPersistedLogs()
        .pipe(
          map((logs: Log[]) => logsActions.LoadLogState({ payload: logs })),
        );
    }),
  ));

  saveLogEffect$ = createEffect(() => this.actions$.pipe(
    ofType(logsActions.SaveLog.type),
    switchMap(() => {
      return of(logsActions.PersistLog());
    }),
  ));

  sendLogsSuccessEffect$ = createEffect(() => this.actions$.pipe(
    ofType(logsActions.SendLogsSuccess),
    switchMap(() => {
      return of(logsActions.PersistLog());
    }),
  ));

  sendLogsEffect$ = createEffect(() => this.actions$.pipe(
    ofType(logsActions.SendLogs.type),
    concatMap((action) => of(action).pipe(
      withLatestFrom(
        this.store$.pipe(
          select(getLogsState),
        ),
      ),
    )),
    switchMap(([, logs]) => {
      if (this.networkStateProvider.getNetworkState() === ConnectionStatus.OFFLINE) {
        return of({ type: '[LogsEffects] Connection Status OFFLINE' });
      }
      return this.logsProvider
        .sendLogs(logs)
        .pipe(
          map(() => {
            const timestamps = logs.map((log: Log) => log.timestamp);
            return logsActions.SendLogsSuccess({ timestamps });
          }),
          catchError((err: any) => {
            return of(logsActions.SendLogsFailure(err));
          }),
        );
    }),
  ));

  // TODO: All this has to be moved to the LogsProvider or DataStore provider

  getPersistedLogs = (): Observable<Log[]> => {
    return from(this.getAndConvertPersistedLogs());
  };

  getAndConvertPersistedLogs = (): Promise<Log[]> => this.dataStore.getItem('LOGS')
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

  saveLogs = (logData: Log[]) => {
    const logDataToStore: LogCache = {
      dateStored: this.dateTimeProvider.now().format('YYYY/MM/DD'),
      data: logData,
    };
    this.dataStore.setItem('LOGS', JSON.stringify(logDataToStore));
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
    this.dataStore.setItem('LOGS', JSON.stringify(logDataToStore)).then(() => { });
    return emptyLogData;
  };

}
