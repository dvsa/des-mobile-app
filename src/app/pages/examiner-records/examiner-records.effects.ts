import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ExaminerRecordModel } from '@dvsa/mes-microservice-common/domain/examiner-records';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  CacheExaminerRecords,
  GetExaminerRecords,
  UpdateLastCached,
} from '@pages/examiner-records/examiner-records.actions';
import { CompressionProvider } from '@providers/compression/compression';
import { LogHelper } from '@providers/logs/logs-helper';
import { SearchProvider } from '@providers/search/search';
import { DateTime } from '@shared/helpers/date-time';
import { LogType } from '@shared/models/log.model';
import { StoreModel } from '@shared/models/store.model';
import { SaveLog } from '@store/logs/logs.actions';
import moment from 'moment';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

@Injectable()
export class ExaminerRecordsEffects {
  constructor(
    private searchProvider: SearchProvider,
    private actions$: Actions,
    public store$: Store<StoreModel>,
    public router: Router,
    public compressionProvider: CompressionProvider,
    private logHelper: LogHelper
  ) {}

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
          (examinerHash: string) =>
            (examinerHash ? this.compressionProvider.extract(examinerHash) : null) as ExaminerRecordModel[]
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
                return newRecord as ExaminerRecordModel;
              })
            : null;
        }),
        //cache results
        map((examinerRecords: ExaminerRecordModel[]) => {
          this.store$.dispatch(CacheExaminerRecords(examinerRecords));
          if (!!examinerRecords) this.store$.dispatch(UpdateLastCached(new DateTime().format('DD/MM/YYYY')));
        })
      ),
    { dispatch: false }
  );
}
