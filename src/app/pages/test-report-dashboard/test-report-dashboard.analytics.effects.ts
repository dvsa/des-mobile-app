import { Injectable } from '@angular/core';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { concatMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';
import { TestsModel } from '@store/tests/tests.model';
import { formatAnalyticsText } from '@shared/helpers/format-analytics-text';
import { AnalyticsEventCategories, AnalyticsEvents, AnalyticsScreenNames } from '@providers/analytics/analytics.model';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import { FeedbackChanged } from '@store/tests/test-data/cat-adi-part3/review/review.actions';
import { getReview } from '@store/tests/test-data/cat-adi-part3/review/review.reducer';
import { getFeedback } from '@store/tests/test-data/cat-adi-part3/review/review.selector';
import {
  TestReportDashboardModalOpened,
  TestReportDashboardNavigateToPage,
  TestReportDashboardViewDidEnter,
} from '@pages/test-report-dashboard/test-report-dashboard.actions';
import { getTestData } from '@store/tests/test-data/cat-adi-part3/test-data.cat-adi-part3.reducer';

@Injectable()
export class TestReportDashboardAnalyticsEffects {
  constructor(
    private analytics: AnalyticsProvider,
    private actions$: Actions,
    private store$: Store<StoreModel>,
  ) {
  }

  testReportDashboardViewDidEnter$ = createEffect(() => this.actions$.pipe(
    ofType(TestReportDashboardViewDidEnter),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
        ),
      )),
    switchMap((
      [, tests]: [ReturnType<typeof TestReportDashboardViewDidEnter>, TestsModel],
    ) => {
      this.analytics.setCurrentPage(formatAnalyticsText(AnalyticsScreenNames.TEST_REPORT_DASHBOARD, tests));
      return of(AnalyticRecorded());
    }),
  ));

  testReportDashboardModalOpened$ = createEffect(() => this.actions$.pipe(
    ofType(TestReportDashboardModalOpened),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
        ),
      )),
    switchMap((
      [, tests]: [ReturnType<typeof TestReportDashboardModalOpened>, TestsModel],
    ) => {
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT_DASHBOARD, tests),
        formatAnalyticsText(AnalyticsEvents.ASSESSMENT_MODAL_OPENED, tests),
      );
      return of(AnalyticRecorded());
    }),
  ));

  testReportDashboardNavigateToPage$ = createEffect(() => this.actions$.pipe(
    ofType(TestReportDashboardNavigateToPage),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
        ),
      )),
    switchMap((
      [{ page }, tests]:
      [ReturnType<typeof TestReportDashboardNavigateToPage>, TestsModel],
    ) => {
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT_DASHBOARD, tests),
        formatAnalyticsText(AnalyticsEvents.NAVIGATION, tests),
        `clicked option to enter ${page}`,
      );
      return of(AnalyticRecorded());
    }),
  ));

  testReportDashboardFeedbackChanged$ = createEffect(() => this.actions$.pipe(
    ofType(
      FeedbackChanged,
    ),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(getCurrentTest),
            select(getTestData),
            select(getReview),
            select(getFeedback),
          ),
        ),
      )),
    switchMap((
      [, tests, feedback]:
      [ReturnType<typeof FeedbackChanged>, TestsModel, string],
    ) => {
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT_DASHBOARD, tests),
        formatAnalyticsText(AnalyticsEvents.FEEDBACK_CHANGED, tests),
        feedback,
      );
      return of(AnalyticRecorded());
    }),
  ));
}
