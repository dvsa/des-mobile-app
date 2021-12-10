import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import {
  switchMap, map, catchError, withLatestFrom, concatMap, tap,
} from 'rxjs/operators';
import {
  of, interval, Observable, from,
} from 'rxjs';

import { NetworkStateProvider, ConnectionStatus } from '@providers/network-state/network-state';
import { DataStoreProvider } from '@providers/data-store/data-store';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { LogsProvider } from '@providers/logs/logs';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { StoreModel } from '@shared/models/store.model';
import { Log } from '@shared/models/log.model';
import { DateTime } from '@shared/helpers/date-time';

import * as logsActions from './logs.actions';
import { getLogsState } from './logs.reducer';

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
    ofType(logsActions.StartSendingLogs),
    switchMap(() => {
      return interval(this.appConfigProvider.getAppConfig().logsAutoSendInterval)
        .pipe(
          map(() => logsActions.SendLogs()),
        );
    }),
  ));

  persistLogEffect$ = createEffect(() => this.actions$.pipe(
    ofType(logsActions.PersistLog),
    concatMap((action) => of(action).pipe(
      withLatestFrom(
        this.store$.pipe(
          select(getLogsState),
        ),
      ),
    )),
    tap(async ([, logs]) => this.saveLogs(logs)),
    switchMap(() => of({ type: '[LogsEffects] Persist Log Finished' })),
  ));

  loadLogEffect$ = createEffect(() => this.actions$.pipe(
    ofType(logsActions.LoadLog),
    switchMap(() => {
      return this.getPersistedLogs()
        .pipe(
          map((logs: Log[]) => logsActions.LoadLogState({ payload: logs })),
        );
    }),
  ));

  saveLogEffect$ = createEffect(() => this.actions$.pipe(
    ofType(logsActions.SaveLog),
    switchMap(() => of(logsActions.PersistLog())),
  ));

  sendLogsSuccessEffect$ = createEffect(() => this.actions$.pipe(
    ofType(logsActions.SendLogsSuccess),
    switchMap(() => of(logsActions.PersistLog())),
  ));

  sendLogsEffect$ = createEffect(() => this.actions$.pipe(
    ofType(logsActions.SendLogs),
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

  // @TODO: MES-7129 All this has to be moved to the LogsProvider or DataStore provider

  getPersistedLogs = (): Observable<Log[]> => {
    return from(this.getAndConvertPersistedLogs());
  };

  getAndConvertPersistedLogs = async (): Promise<Log[]> => {
    try {
      const data = await this.dataStore.getItem('LOGS');
      const logCache: LogCache = JSON.parse(data);
      const cachedDate = DateTime.at(logCache.dateStored);
      if (this.isCacheTooOld(cachedDate, new DateTime())) {
        return await this.emptyCachedData();
      }
      return logCache.data;
    } catch {
      return [];
    }
  };

  saveLogs = async (logData: Log[]) => {
    const logDataToStore: LogCache = {
      dateStored: this.dateTimeProvider.now().format('YYYY/MM/DD'),
      data: logData,
    };
    await this.dataStore.setItem('LOGS', JSON.stringify(logDataToStore));
  };

  isCacheTooOld = (dateStored: DateTime, now: DateTime): boolean => {
    return dateStored.daysDiff(now) > this.appConfigProvider.getAppConfig().daysToCacheLogs;
  };

  emptyCachedData = async () => {
    const emptyLogData: Log[] = [];
    const logDataToStore: LogCache = {
      dateStored: this.dateTimeProvider.now().format('YYYY/MM/DD'),
      data: emptyLogData,
    };
    await this.dataStore.setItem('LOGS', JSON.stringify(logDataToStore));
    return emptyLogData;
  };

}
