import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import {
  catchError,
  concatMap, filter, map, switchMap, withLatestFrom,
} from 'rxjs/operators';
import {
  ClearCandidateLicenceData,
  GetCandidateLicenceData,
  GetCandidateLicenceDataError,
  GetCandidateLicenceDataSuccess,
} from '@pages/candidate-licence/candidate-licence.actions';
import { CandidateLicence } from '@providers/candidate-licence/candidate-licence';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest, getJournalData, isPracticeMode } from '@store/tests/tests.selector';
import { getCandidate } from '@store/tests/journal-data/common/candidate/candidate.reducer';
import { getCandidateDriverNumber } from '@store/tests/journal-data/common/candidate/candidate.selector';
import {
  getApplicationReference,
} from '@store/tests/journal-data/common/application-reference/application-reference.reducer';
import {
  getApplicationNumber,
} from '@store/tests/journal-data/common/application-reference/application-reference.selector';
import { of } from 'rxjs';
import { SaveLog } from '@store/logs/logs.actions';
import { LogType } from '@shared/models/log.model';
import { LogHelper } from '@providers/logs/logs-helper';
import { getRekeyIndicator } from '@store/tests/rekey/rekey.reducer';
import { isRekey } from '@store/tests/rekey/rekey.selector';

@Injectable()
export class CandidateLicenceEffects {

  constructor(
    private actions$: Actions,
    private store$: Store<StoreModel>,
    private candidateLicenceProvider: CandidateLicence,
    private logHelper: LogHelper,
  ) {}

  getCandidateLicenceData$ = createEffect(() => this.actions$.pipe(
    ofType(GetCandidateLicenceData),
    concatMap((action) => of(action).pipe(
      withLatestFrom(
        this.store$.pipe(
          select(getTests),
          select(getCurrentTest),
          select(getJournalData),
          select(getCandidate),
          select(getCandidateDriverNumber),
        ),
        this.store$.pipe(
          select(getTests),
          select(getCurrentTest),
          select(getJournalData),
          select(getApplicationReference),
          select(getApplicationNumber),
        ),
        this.store$.pipe(
          select(getTests),
          select(isPracticeMode),
        ),
        this.store$.pipe(
          select(getTests),
          select(getCurrentTest),
          select(getRekeyIndicator),
          select(isRekey),
        ),
      ),
    )),
    filter(([, , , isPracticeTest, isRekeyTest]) => !isPracticeTest && !isRekeyTest),
    switchMap(([, driverNumber, appRef]) => this.candidateLicenceProvider.getCandidateData(driverNumber, appRef)),
    map(() => GetCandidateLicenceDataSuccess()),
    catchError((err) => {
      this.store$.dispatch(SaveLog({
        payload: this.logHelper.createLog(LogType.ERROR, 'Error retrieving candidate licence', err.error),
      }));
      return of(GetCandidateLicenceDataError());
    }),
  ));

  clearCandidateLicenceData$ = createEffect(() => this.actions$.pipe(
    ofType(ClearCandidateLicenceData),
    map(() => this.candidateLicenceProvider.clearDriverData()),
  ), { dispatch: false });
}
