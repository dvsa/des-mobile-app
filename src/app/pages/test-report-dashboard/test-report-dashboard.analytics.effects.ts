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
import { analyticsEventTypePrefix } from '@shared/helpers/format-analytics-text';
import {
  AnalyticsScreenNames,
  GoogleAnalyticsEvents,
  GoogleAnalyticsEventsTitles,
  GoogleAnalyticsEventsValues,
} from '@providers/analytics/analytics.model';
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
import { getTestCategory } from '@store/tests/category/category.reducer';
import { CategoryCode } from '@dvsa/mes-test-schema/categories/common';

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

      // GA4 Analytics
      this.analytics.setGACurrentPage(analyticsEventTypePrefix(AnalyticsScreenNames.TEST_REPORT_DASHBOARD, tests));
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

      // GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.NAVIGATION, tests),
        GoogleAnalyticsEventsTitles.OPENED,
        GoogleAnalyticsEventsValues.ASSESSMENT_MODAL,
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

      // GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.NAVIGATION, tests),
        GoogleAnalyticsEventsTitles.OPENED,
        page,
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
            select(getCurrentTest),
            select(getTestCategory),
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
      [, tests, , category]:
      [ReturnType<typeof FeedbackChanged>, TestsModel, string, CategoryCode, boolean],
    ) => {

      // GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.FEEDBACK, tests),
        GoogleAnalyticsEventsTitles.TEST_CATEGORY,
        category,
        GoogleAnalyticsEventsTitles.REASON,
        GoogleAnalyticsEventsValues.FREE_TEXT_ENTERED,
      );
      return of(AnalyticRecorded());
    }),
  ));
}
