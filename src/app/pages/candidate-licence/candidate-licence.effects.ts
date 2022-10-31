import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import {
  catchError, concatMap, filter, map, repeat, switchMap, withLatestFrom,
} from 'rxjs/operators';
import {
  ClearCandidateLicenceData,
  GetCandidateLicenceData,
  GetCandidateLicenceDataError,
  GetCandidateLicenceDataSuccess,
} from '@pages/candidate-licence/candidate-licence.actions';
import { CandidateLicenceProvider } from '@providers/candidate-licence/candidate-licence';
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
import { NetworkStateProvider } from '@providers/network-state/network-state';
import { getTestCategory } from '@store/tests/category/category.reducer';
import { isAnyOf } from '@shared/helpers/simplifiers';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';

@Injectable()
export class CandidateLicenceEffects {

  constructor(
    private actions$: Actions,
    private store$: Store<StoreModel>,
    private candidateLicenceProvider: CandidateLicenceProvider,
    private networkStateProvider: NetworkStateProvider,
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
        this.store$.pipe(
          select(getTests),
          select(getCurrentTest),
          select(getTestCategory),
        ),
      ),
    )),
    filter(this.isEligibleForLicenceData),
    // above filter means test must a value for driverNumber (might be missing for un-named test slots) & appRef
    // whilst also not being in practice mode or a rekey test.
    switchMap(([, driverNumber, appRef]) => this.candidateLicenceProvider.getCandidateData(driverNumber, appRef)),
    map(() => GetCandidateLicenceDataSuccess()),
    catchError((err) => {
      this.store$.dispatch(SaveLog({
        payload: this.logHelper.createLog(LogType.ERROR, 'Error retrieving candidate licence', err.error),
      }));
      return of(GetCandidateLicenceDataError());
    }),
    repeat(),
  ));

  private isEligibleForLicenceData = (
    [, driverNumber, appRef, isPracticeTest, isRekeyTest, category]:
    [ReturnType<typeof GetCandidateLicenceData>, string, string, boolean, boolean, TestCategory],
  ): boolean => {
    return (
      driverNumber
        && appRef
        && !isPracticeTest
        && !isRekeyTest
        && !isAnyOf(category, [TestCategory.ADI3, TestCategory.SC])
    );
  };

  clearCandidateLicenceData$ = createEffect(() => this.actions$.pipe(
    ofType(ClearCandidateLicenceData),
    map(() => this.candidateLicenceProvider.clearDriverData()),
  ), { dispatch: false });
}
