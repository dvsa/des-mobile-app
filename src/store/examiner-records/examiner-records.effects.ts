import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { StoreModel } from '@shared/models/store.model';
import {
  ColourFilterChanged, DateRangeChanged, LocationChanged,
  ShowDataChanged,
  TestCategoryChanged,
} from '@pages/examiner-records/examiner-records.actions';
import { concatMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { DataStoreProvider, LocalStorageKey, StorageKey } from '@providers/data-store/data-store';
import {
  LoadExaminerRecordsFailure,
  LoadExaminerRecordsPreferences,
} from '@store/examiner-records/examiner-records.actions';
import { selectExaminerRecords } from '@store/examiner-records/examiner-records.selectors';

@Injectable()
export class ExaminerRecordsEffects {
  private static readonly EXAMINER_STATS_KEY: StorageKey = LocalStorageKey.EXAMINER_STATS_KEY;

  constructor(
    private actions$: Actions,
    private store$: Store<StoreModel>,
    private dataStore: DataStoreProvider
  ) {}

  persistExaminerRecordsPreferences$ = createEffect(() => this.actions$.pipe(
    ofType(
      ColourFilterChanged,
      ShowDataChanged,
      TestCategoryChanged,
      DateRangeChanged,
      LocationChanged,
    ),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.select(selectExaminerRecords),
        ),
      )),
    switchMap(async (
      [, examinerStatPreferences],
    ) => this.dataStore.setItem(ExaminerRecordsEffects.EXAMINER_STATS_KEY, JSON.stringify(examinerStatPreferences))),
  ), { dispatch: false });

  loadExaminerRecordsPreferences$ = createEffect(() => this.actions$.pipe(
    ofType(LoadExaminerRecordsPreferences),
    concatMap(() => this.dataStore.getItem(ExaminerRecordsEffects.EXAMINER_STATS_KEY)),
    switchMap((examinerRecords) => {
      if (!examinerRecords) {
        return [LoadExaminerRecordsFailure('Examiner stats preferences not found')];
      }
      const {
        hideCharts,
        colourScheme,
        dateFilter,
        locationFilter,
        categoryFilter,
      } = JSON.parse(examinerRecords);

      return [
        (!!colourScheme) ? ColourFilterChanged(colourScheme) : null,
        (!!hideCharts) ? ShowDataChanged(hideCharts) : null,
        (!!dateFilter) ? DateRangeChanged(dateFilter) : null,
        (!!locationFilter) ? LocationChanged(locationFilter) : null,
        (!!categoryFilter) ? TestCategoryChanged(categoryFilter) : null,
      ];
    }),
  ));
}
