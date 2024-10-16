import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  CacheExaminerRecords,
  ColourFilterChanged,
  NoExaminerRecordSetting,
  UpdateLastCached,
} from '@pages/examiner-records/examiner-records.actions';
import { DataStoreProvider, LocalStorageKey, StorageKey } from '@providers/data-store/data-store';
import { StoreModel } from '@shared/models/store.model';
import {
  LoadExaminerRecordsFailure,
  LoadExaminerRecordsPreferences,
} from '@store/examiner-records/examiner-records.actions';
import { ExaminerRecordStateModel } from '@store/examiner-records/examiner-records.model';
import { selectExaminerRecords } from '@store/examiner-records/examiner-records.selectors';
import { of } from 'rxjs';
import { concatMap, switchMap, withLatestFrom } from 'rxjs/operators';

@Injectable()
export class ExaminerRecordsEffects {
  private static readonly EXAMINER_RECORDS_KEY: StorageKey = LocalStorageKey.EXAMINER_STATS_KEY;

  constructor(
    private actions$: Actions,
    private store$: Store<StoreModel>,
    private dataStore: DataStoreProvider
  ) {}

  persistExaminerRecordsPreferences$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ColourFilterChanged, CacheExaminerRecords, UpdateLastCached),
        concatMap((action) => of(action).pipe(withLatestFrom(this.store$.select(selectExaminerRecords)))),
        concatMap(async ([, examinerRecordsPreferences]) =>
          this.dataStore.setItem(
            ExaminerRecordsEffects.EXAMINER_RECORDS_KEY,
            JSON.stringify(examinerRecordsPreferences)
          )
        )
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
