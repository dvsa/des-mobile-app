import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, tap } from 'rxjs/operators';
import {
  CacheTests,
  CallBackendRecords,
} from '@pages/examiner-records/examiner-records.actions';
import { formatDate } from '@angular/common';
import { SearchProvider } from '@providers/search/search';

@Injectable()
export class ExaminerRecordsAnalyticsEffects {

  constructor(
    private searchProvider: SearchProvider,
    private actions$: Actions,
  ) {
  }

  recordsCalled$ = createEffect(() => this.actions$.pipe(
    tap(() => {
      console.log('call');
    }),
    ofType(CallBackendRecords),
    map(({ staffNumber }) => {
      let results: string = '';
      console.log('before', staffNumber);
      this.searchProvider.examinerRecordsSearch(
        staffNumber,
        formatDate(new Date(Date.now() - 730 * 24 * 60 * 60 * 1000).toLocaleString(), 'yyyy-MM-dd', 'en-GB'),
        formatDate(new Date(Date.now()).toLocaleString(), 'yyyy-MM-dd', 'en-GB')).subscribe(value => {
        console.log('after', value)
        results = value;
      });
      return results;
    }),
    map((result) => CacheTests(result))
  ));
}
