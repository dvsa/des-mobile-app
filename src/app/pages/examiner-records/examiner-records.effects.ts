import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import {
  CacheTests,
  GetExaminerRecords,
} from '@pages/examiner-records/examiner-records.actions';
import { formatDate } from '@angular/common';
import { SearchProvider } from '@providers/search/search';
import { Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { Router } from '@angular/router';
import { EXAMINER_RECORDS } from '@pages/page-names.constants';
import { ExaminerRecordModel } from '@dvsa/mes-microservice-common/domain/examiner-records';
import { CompressionProvider } from '@providers/compression/compression';
import { gzipSync } from 'zlib';
import { SaveLog } from '@store/logs/logs.actions';
import { LogType } from '@shared/models/log.model';
import { LogHelper } from '@providers/logs/logs-helper';

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

  recordsCalled$ = createEffect(() => this.actions$.pipe(
    ofType(GetExaminerRecords),
    switchMap(({ staffNumber }) => {
      //Get backend tests in the examiner records format
      return this.searchProvider.examinerRecordsSearch(
        staffNumber,
        formatDate(new Date(Date.now() - 730 * 24 * 60 * 60 * 1000).toLocaleString(), 'yyyy-MM-dd', 'en-GB'),
        formatDate(new Date(Date.now()).toLocaleString(), 'yyyy-MM-dd', 'en-GB')
      );
    }),
    catchError((err) => {
      this.store$.dispatch(SaveLog({
        payload: this.logHelper.createLog(LogType.ERROR, 'Error retrieving examiner records', err.error),
      }));
      return '';
    }),
    //Remove blank properties from returned records
    map((examinerHash) => this.compressionProvider.extract(examinerHash) as ExaminerRecordModel[]),
    map((examinerRecords) => {
      return examinerRecords.map((examinerRecord) => {
        return Object.fromEntries(Object.entries(examinerRecord).filter(([, v]) => v != null)) as ExaminerRecordModel;
      })
    }),
    //compress and cache results
    map((examinerHash) => this.store$.dispatch(
      CacheTests(gzipSync(JSON.stringify(examinerHash)).toString('base64')),
    )),
    map(() => this.router.navigate([EXAMINER_RECORDS])),
  ),  { dispatch: false });
}
