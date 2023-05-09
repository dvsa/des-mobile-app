import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  concatMap, filter, switchMap, withLatestFrom,
} from 'rxjs/operators';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import {
  AnalyticsDimensionIndices,
  AnalyticsEventCategories,
  AnalyticsEvents,
  AnalyticsScreenNames,
} from '@providers/analytics/analytics.model';
import { select, Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { getTests } from '@store/tests/tests.reducer';
import {
  getCurrentTest, getJournalData, isPassed, isPracticeMode,
} from '@store/tests/tests.selector';
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
import { AppConfigProvider } from '@providers/app-config/app-config';
import { RekeyReasonViewDidEnter, RekeyUploadTest } from './rekey-reason.actions';

@Injectable()
export class RekeyReasonAnalyticsEffects {

  constructor(
    private analytics: AnalyticsProvider,
    private actions$: Actions,
    private store$: Store<StoreModel>,
    private appConfigProvider: AppConfigProvider,
  ) {
  }

  rekeyReasonViewDidEnter$ = createEffect(() => this.actions$.pipe(
    ofType(RekeyReasonViewDidEnter),
    concatMap((action) => of(action)
      .pipe(
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
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , , , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    switchMap((
      [, tests, candidateId, applicationReference]:
      [ReturnType<typeof RekeyReasonViewDidEnter>, TestsModel, number, string, boolean],
    ) => {
      const screenName = formatAnalyticsText(AnalyticsScreenNames.REKEY_REASON, tests);
      this.analytics.addCustomDimension(AnalyticsDimensionIndices.CANDIDATE_ID, `${candidateId}`);
      this.analytics.addCustomDimension(AnalyticsDimensionIndices.APPLICATION_REFERENCE, applicationReference);
      this.analytics.setCurrentPage(screenName);
      return of(AnalyticRecorded());
    }),
  ));

  rekeyReasonUploadTest$ = createEffect(() => this.actions$.pipe(
    ofType(RekeyUploadTest),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
            select(getCurrentTest),
            select(isPassed),
          ),
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    switchMap((
      [, isTestPassed, tests]:
      [ReturnType<typeof RekeyUploadTest>, boolean, TestsModel, boolean],
    ) => {
      const outcome = isTestPassed ? 'Pass' : 'Fail';

      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.POST_TEST, tests),
        formatAnalyticsText(AnalyticsEvents.CONFIRM_UPLOAD, tests),
        formatAnalyticsText(`Upload confirmed - ${outcome}`, tests),
      );

      return of(AnalyticRecorded());
    }),
  ));

}
