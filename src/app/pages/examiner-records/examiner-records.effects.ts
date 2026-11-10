import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ExaminerRecordModel } from '@dvsa/mes-microservice-common/domain/examiner-records';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  CacheExaminerRecords,
  ColourFilterChanged,
  GetExaminerRecords,
  NoExaminerRecordSetting,
  UpdateLastCached,
} from '@pages/examiner-records/examiner-records.actions';
import { CompressionProvider } from '@providers/compression/compression';
import { DataStoreProvider, LocalStorageKey, StorageKey } from '@providers/data-store/data-store';
import { LogHelper } from '@providers/logs/logs-helper';
import { SearchProvider } from '@providers/search/search';
import { DateTime } from '@shared/helpers/date-time';
import { LogType } from '@shared/models/log.model';
import { StoreModel } from '@shared/models/store.model';
import {
  LoadExaminerRecordsFailure,
  LoadExaminerRecordsPreferences,
} from '@store/examiner-records/examiner-records.actions';
import { ExaminerRecordStateModel } from '@store/examiner-records/examiner-records.model';
import { selectExaminerRecords } from '@store/examiner-records/examiner-records.selectors';
import { SaveLog } from '@store/logs/logs.actions';
import moment from 'moment';
import { of } from 'rxjs';
import { catchError, concatMap, map, switchMap, withLatestFrom } from 'rxjs/operators';

@Injectable()
export class ExaminerRecordsEffects {
  constructor(
    private searchProvider: SearchProvider,
    private actions$: Actions,
    public store$: Store<StoreModel>,
    public router: Router,
    public compressionProvider: CompressionProvider,
    private logHelper: LogHelper,
    private dataStore: DataStoreProvider
  ) {}

  static readonly EXAMINER_RECORDS_KEY: StorageKey = LocalStorageKey.EXAMINER_STATS_KEY;

  onlineExaminerRecordsCalled$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(GetExaminerRecords),
        switchMap(({ staffNumber }) => {
          // Get remote data for examiner records
          return this.searchProvider
            .examinerRecordsSearch(staffNumber, null, moment(new Date()).subtract(15, 'days').format('YYYY-MM-DD'))
            .pipe(
              catchError((err) => {
                this.store$.dispatch(
                  SaveLog({
                    payload: this.logHelper.createLog(LogType.ERROR, 'Error retrieving examiner records', err.error),
                  })
                );
                return of(null);
              })
            );
        }),
        // Remove blank properties from returned records
        map(
          (examinerHash: string) => (examinerHash ? this.compressionProvider.extract(examinerHash) : null) as unknown[]
        ),
        map((examinerRecords): ExaminerRecordModel[] => {
          return examinerRecords
            ? examinerRecords.map((examinerRecord) => {
                const newRecord = Object.fromEntries(Object.entries(examinerRecord).filter(([, v]) => v != null));
                if (newRecord.controlledStop) {
                  newRecord.controlledStop = JSON.parse(newRecord.controlledStop);
                }
                if (newRecord.extendedTest) {
                  newRecord.extendedTest = JSON.parse(newRecord.extendedTest);
                }
                if (newRecord.activityCode) {
                  newRecord.activityCode = Number(newRecord.activityCode);
                }
                return newRecord as ExaminerRecordModel;
              })
            : null;
        }),
        //cache results
        map((examinerRecords: ExaminerRecordModel[]) => {
          this.store$.dispatch(CacheExaminerRecords(examinerRecords));
          if (examinerRecords) this.store$.dispatch(UpdateLastCached(new DateTime().format('DD/MM/YYYY')));
        })
      ),
    { dispatch: false }
  );

  persistExaminerRecordsPreferences$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ColourFilterChanged, CacheExaminerRecords, UpdateLastCached),
        concatMap((action) => of(action).pipe(withLatestFrom(this.store$.select(selectExaminerRecords)))),
        concatMap(async ([, examinerRecordsPreferences]) => {
          await this.dataStore.setItem(
            ExaminerRecordsEffects.EXAMINER_RECORDS_KEY,
            JSON.stringify(examinerRecordsPreferences)
          );
        })
      ),
    { dispatch: false }
  );

  loadExaminerRecordsPreferences$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LoadExaminerRecordsPreferences),
      concatMap(() => this.dataStore.getItem(ExaminerRecordsEffects.EXAMINER_RECORDS_KEY)),
      switchMap((examinerRecords) => {
        if (!examinerRecords) {
          return [LoadExaminerRecordsFailure('Examiner stats preferences not found')];
        }
        const { colourScheme, cachedRecords, lastUpdatedTime } = JSON.parse(
          examinerRecords
        ) as ExaminerRecordStateModel;

        return [
          colourScheme ? ColourFilterChanged(colourScheme) : NoExaminerRecordSetting('colour scheme'),
          !!cachedRecords && cachedRecords.length
            ? CacheExaminerRecords(cachedRecords)
            : NoExaminerRecordSetting('cached records'),
          lastUpdatedTime ? UpdateLastCached(lastUpdatedTime) : NoExaminerRecordSetting('last updated time'),
        ];
      })
    )
  );
}
