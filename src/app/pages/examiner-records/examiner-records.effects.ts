import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import {
  CacheExaminerRecords,
  GetExaminerRecords,
  UpdateLastCached,
} from '@pages/examiner-records/examiner-records.actions';
import { SearchProvider } from '@providers/search/search';
import { Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { Router } from '@angular/router';
import { EXAMINER_RECORDS } from '@pages/page-names.constants';
import { ExaminerRecordModel } from '@dvsa/mes-microservice-common/domain/examiner-records';
import { CompressionProvider } from '@providers/compression/compression';
import { SaveLog } from '@store/logs/logs.actions';
import { LogType } from '@shared/models/log.model';
import { LogHelper } from '@providers/logs/logs-helper';
import { DateTime } from '@shared/helpers/date-time';
import { of } from 'rxjs';

@Injectable()
export class ExaminerRecordsEffects {

  constructor(
    private searchProvider: SearchProvider,
    private actions$: Actions,
    public store$: Store<StoreModel>,
    public router: Router,
    public compressionProvider: CompressionProvider,
    private logHelper: LogHelper,
  ) {
  }

  onlineExaminerRecordsCalled$ = createEffect(() => this.actions$.pipe(
    ofType(GetExaminerRecords),
    switchMap(({ staffNumber }) => {
      //Get backend tests in the examiner records format
      return this.searchProvider.examinerRecordsSearch(
        staffNumber,
      ).pipe(
        catchError((err) => {
          this.store$.dispatch(SaveLog({
            payload: this.logHelper.createLog(LogType.ERROR, 'Error retrieving examiner records', err.error),
          }));
          return of(null);
        }),
      );
    }),
    //Remove blank properties from returned records
    map((examinerHash: string) =>
      (examinerHash ? this.compressionProvider.extract(examinerHash) : null) as ExaminerRecordModel[]),
    map((examinerRecords) => {
      return examinerRecords ? examinerRecords.map((examinerRecord) => {
        return Object.fromEntries(Object.entries(examinerRecord).filter(([, v]) => v != null)) as ExaminerRecordModel;
      }) : null;
    }),
    //compress and cache results
    map((examinerRecords) => {
      this.store$.dispatch(CacheExaminerRecords(examinerRecords));
      if (examinerRecords) this.store$.dispatch(UpdateLastCached(new DateTime().format('DD/MM/YYYY')));
    }),
    map(() => this.router.navigate([EXAMINER_RECORDS])),
  ), { dispatch: false });
}
