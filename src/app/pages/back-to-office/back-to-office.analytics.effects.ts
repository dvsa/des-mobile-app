import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
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
import {
  getCurrentTest, getJournalData, isPassed, isPracticeMode,
} from '@store/tests/tests.selector';
import { getTests } from '@store/tests/tests.reducer';
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
import { ASAMPopupPresented, BackToOfficeViewDidEnter, DeferWriteUp } from './back-to-office.actions';

@Injectable()
export class BackToOfficeAnalyticsEffects {
  constructor(
    private analytics: AnalyticsProvider,
    private actions$: Actions,
    private store$: Store<StoreModel>,
    private appConfigProvider: AppConfigProvider,
  ) {
  }

  backToOfficeViewDidEnter$ = createEffect(() => this.actions$.pipe(
    ofType(BackToOfficeViewDidEnter),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    switchMap(([, tests]: [ReturnType<typeof BackToOfficeViewDidEnter>, TestsModel, boolean]) => {
      const screenName = formatAnalyticsText(AnalyticsScreenNames.BACK_TO_OFFICE, tests);
      this.analytics.setCurrentPage(screenName);
      return of(AnalyticRecorded());
    }),
  ));

  deferWriteUpEffect$ = createEffect(() => this.actions$.pipe(
    ofType(DeferWriteUp),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(getCurrentTest),
            select(isPassed),
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
    filter(([, , , , , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    switchMap(([, tests, isTestPassed, candidateId, applicationReference]:
    [ReturnType<typeof DeferWriteUp>, TestsModel, boolean, number, string, boolean]) => {
      this.analytics.addCustomDimension(AnalyticsDimensionIndices.CANDIDATE_ID, `${candidateId}`);
      this.analytics.addCustomDimension(AnalyticsDimensionIndices.APPLICATION_REFERENCE, applicationReference);

      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.BACK_TO_OFFICE, tests),
        formatAnalyticsText(AnalyticsEvents.DEFER_WRITE_UP, tests),
        isTestPassed ? 'pass' : 'fail',
      );
      return of(AnalyticRecorded());
    }),
  ));

  asamPopupShown$ = createEffect(() => this.actions$.pipe(
    ofType(ASAMPopupPresented),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    switchMap(([, tests]: [ReturnType<typeof ASAMPopupPresented>, TestsModel, boolean]) => {
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.ERROR, tests),
        formatAnalyticsText(AnalyticsEvents.ASAM, tests),
        'Modal Triggered',
      );
      return of(AnalyticRecorded());
    }),
  ));
}
