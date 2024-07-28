import { Injectable } from '@angular/core';
import { CategoryCode } from '@dvsa/mes-test-schema/categories/common';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import {
  TestReportDashboardModalOpened,
  TestReportDashboardNavigateToPage,
  TestReportDashboardViewDidEnter,
} from '@pages/test-report-dashboard/test-report-dashboard.actions';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import {
  AnalyticsEventCategories,
  AnalyticsEvents,
  AnalyticsScreenNames,
  GoogleAnalyticsEvents,
  GoogleAnalyticsEventsTitles,
  GoogleAnalyticsEventsValues,
} from '@providers/analytics/analytics.model';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { analyticsEventTypePrefix, formatAnalyticsText } from '@shared/helpers/format-analytics-text';
import { StoreModel } from '@shared/models/store.model';
import { getTestCategory } from '@store/tests/category/category.reducer';
import { FeedbackChanged } from '@store/tests/test-data/cat-adi-part3/review/review.actions';
import { getReview } from '@store/tests/test-data/cat-adi-part3/review/review.reducer';
import { getFeedback } from '@store/tests/test-data/cat-adi-part3/review/review.selector';
import { getTestData } from '@store/tests/test-data/cat-adi-part3/test-data.cat-adi-part3.reducer';
import { TestsModel } from '@store/tests/tests.model';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest, isPracticeMode } from '@store/tests/tests.selector';
import { of } from 'rxjs';
import { concatMap, filter, switchMap, withLatestFrom } from 'rxjs/operators';

@Injectable()
export class TestReportDashboardAnalyticsEffects {
  constructor(
    private analytics: AnalyticsProvider,
    private actions$: Actions,
    private store$: Store<StoreModel>,
    private appConfigProvider: AppConfigProvider
  ) {}

  testReportDashboardViewDidEnter$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TestReportDashboardViewDidEnter),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store$.pipe(select(getTests)), this.store$.pipe(select(getTests), select(isPracticeMode)))
        )
      ),
      filter(([, , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      switchMap(([, tests]: [ReturnType<typeof TestReportDashboardViewDidEnter>, TestsModel, boolean]) => {
        // TODO - MES-9495 - remove old analytics
        this.analytics.setCurrentPage(formatAnalyticsText(AnalyticsScreenNames.TEST_REPORT_DASHBOARD, tests));

        // GA4 Analytics
        this.analytics.setGACurrentPage(analyticsEventTypePrefix(AnalyticsScreenNames.TEST_REPORT_DASHBOARD, tests));
        return of(AnalyticRecorded());
      })
    )
  );

  testReportDashboardModalOpened$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TestReportDashboardModalOpened),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store$.pipe(select(getTests)), this.store$.pipe(select(getTests), select(isPracticeMode)))
        )
      ),
      filter(([, , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      switchMap(([, tests]: [ReturnType<typeof TestReportDashboardModalOpened>, TestsModel, boolean]) => {
        // TODO - MES-9495 - remove old analytics
        this.analytics.logEvent(
          formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT_DASHBOARD, tests),
          formatAnalyticsText(AnalyticsEvents.ASSESSMENT_MODAL_OPENED, tests)
        );

        // GA4 Analytics
        this.analytics.logGAEvent(
          analyticsEventTypePrefix(GoogleAnalyticsEvents.NAVIGATION, tests),
          GoogleAnalyticsEventsTitles.OPENED,
          GoogleAnalyticsEventsValues.ASSESSMENT_MODAL
        );
        return of(AnalyticRecorded());
      })
    )
  );

  testReportDashboardNavigateToPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TestReportDashboardNavigateToPage),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store$.pipe(select(getTests)), this.store$.pipe(select(getTests), select(isPracticeMode)))
        )
      ),
      filter(([, , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      switchMap(([{ page }, tests]: [ReturnType<typeof TestReportDashboardNavigateToPage>, TestsModel, boolean]) => {
        // TODO - MES-9495 - remove old analytics
        this.analytics.logEvent(
          formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT_DASHBOARD, tests),
          formatAnalyticsText(AnalyticsEvents.NAVIGATION, tests),
          `clicked option to enter ${page}`
        );

        // GA4 Analytics
        this.analytics.logGAEvent(
          analyticsEventTypePrefix(GoogleAnalyticsEvents.NAVIGATION, tests),
          GoogleAnalyticsEventsTitles.OPENED,
          page
        );
        return of(AnalyticRecorded());
      })
    )
  );

  testReportDashboardFeedbackChanged$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FeedbackChanged),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(
            this.store$.pipe(select(getTests)),
            this.store$.pipe(
              select(getTests),
              select(getCurrentTest),
              select(getTestData),
              select(getReview),
              select(getFeedback)
            ),
            this.store$.pipe(select(getTests), select(getCurrentTest), select(getTestCategory)),
            this.store$.pipe(select(getTests), select(isPracticeMode))
          )
        )
      ),
      filter(([, , , , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      switchMap(
        ([, tests, , category]: [ReturnType<typeof FeedbackChanged>, TestsModel, string, CategoryCode, boolean]) => {
          // TODO - MES-9495 - remove old analytics
          this.analytics.logEvent(
            formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT_DASHBOARD, tests),
            formatAnalyticsText(AnalyticsEvents.FEEDBACK_CHANGED, tests),
            'Free text entered'
          );

          // GA4 Analytics
          this.analytics.logGAEvent(
            analyticsEventTypePrefix(GoogleAnalyticsEvents.FEEDBACK, tests),
            GoogleAnalyticsEventsTitles.TEST_CATEGORY,
            category,
            GoogleAnalyticsEventsTitles.REASON,
            GoogleAnalyticsEventsValues.FREE_TEXT_ENTERED
          );
          return of(AnalyticRecorded());
        }
      )
    )
  );
}
