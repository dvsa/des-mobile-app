import { Injectable } from '@angular/core';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { concatMap, filter, switchMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest, isPracticeMode } from '@store/tests/tests.selector';
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
import { AppConfigProvider } from '@providers/app-config/app-config';

@Injectable()
export class TestReportDashboardAnalyticsEffects {
  constructor(
    private analytics: AnalyticsProvider,
    private actions$: Actions,
    private store$: Store<StoreModel>,
    private appConfigProvider: AppConfigProvider,
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
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    switchMap((
      [, tests]: [ReturnType<typeof TestReportDashboardViewDidEnter>, TestsModel, boolean],
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
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    switchMap((
      [, tests]: [ReturnType<typeof TestReportDashboardModalOpened>, TestsModel, boolean],
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
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    switchMap((
      [{ page }, tests]:
      [ReturnType<typeof TestReportDashboardNavigateToPage>, TestsModel, boolean],
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
    ofType(FeedbackChanged),
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
      [, tests]:
      [ReturnType<typeof FeedbackChanged>, TestsModel, string, boolean],
    ) => {
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT_DASHBOARD, tests),
        formatAnalyticsText(AnalyticsEvents.FEEDBACK_CHANGED, tests),
        'Free text entered',
      );
      return of(AnalyticRecorded());
    }),
  ));
}
