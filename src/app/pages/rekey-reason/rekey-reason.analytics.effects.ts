import { Injectable } from '@angular/core';
import {
  Actions, createEffect, ofType,
} from '@ngrx/effects';
import { withLatestFrom, switchMap, concatMap } from 'rxjs/operators';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticsScreenNames, AnalyticsDimensionIndices } from '@providers/analytics/analytics.model';
import { Store, select } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest, getJournalData } from '@store/tests/tests.selector';
import { of } from 'rxjs';
import { formatAnalyticsText } from '@shared/helpers/format-analytics-text';
import { TestsModel } from '@store/tests/tests.model';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import { getCandidate } from '@store/tests/journal-data/common/candidate/candidate.reducer';
import { getCandidateId } from '@store/tests/journal-data/common/candidate/candidate.selector';
import {
  getApplicationReference,
} from '@store/tests/journal-data/common/application-reference/application-reference.reducer';
import {
  getApplicationNumber,
} from '@store/tests/journal-data/common/application-reference/application-reference.selector';
import { RekeyReasonViewDidEnter } from './rekey-reason.actions';

@Injectable()
export class RekeyReasonAnalyticsEffects {

  constructor(
    private analytics: AnalyticsProvider,
    private actions$: Actions,
    private store$: Store<StoreModel>,
  ) {
  }

  rekeyReasonViewDidEnter$ = createEffect(() => this.actions$.pipe(
    ofType(RekeyReasonViewDidEnter),
    concatMap((action) => of(action).pipe(
      withLatestFrom(
        this.store$.pipe(
          select(getTests),
        ),
        this.store$.pipe(
          select(getTests),
          select(getCurrentTest),
          select(getJournalData),
          select(getCandidate),
          select(getCandidateId),
        ),
        this.store$.pipe(
          select(getTests),
          select(getCurrentTest),
          select(getJournalData),
          select(getApplicationReference),
          select(getApplicationNumber),
        ),
      ),
    )),
    switchMap((
      [, tests, candidateId, applicationReference]:
      [ReturnType<typeof RekeyReasonViewDidEnter>, TestsModel, number, string],
    ) => {
      const screenName = formatAnalyticsText(AnalyticsScreenNames.REKEY_REASON, tests);
      this.analytics.addCustomDimension(AnalyticsDimensionIndices.CANDIDATE_ID, `${candidateId}`);
      this.analytics.addCustomDimension(AnalyticsDimensionIndices.APPLICATION_REFERENCE, applicationReference);
      this.analytics.setCurrentPage(screenName);
      return of(AnalyticRecorded());
    }),
  ));

}
