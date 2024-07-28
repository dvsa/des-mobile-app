import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import { AnalyticsEventCategories, AnalyticsEvents, GoogleAnalyticsEvents } from '@providers/analytics/analytics.model';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { analyticsEventTypePrefix } from '@shared/helpers/format-analytics-text';
import { StoreModel } from '@shared/models/store.model';
import { TestsModel } from '@store/tests/tests.model';
import { getTests } from '@store/tests/tests.reducer';
import { isPracticeMode } from '@store/tests/tests.selector';
import { of } from 'rxjs';
import { concatMap, filter, withLatestFrom } from 'rxjs/operators';
import * as testStatusActions from './test-status.actions';

@Injectable()
export class TestStatusAnalyticsEffects {
  constructor(
    public analytics: AnalyticsProvider,
    private actions$: Actions,
    private store$: Store<StoreModel>,
    private appConfigProvider: AppConfigProvider
  ) {}

  setTestStatusDecidedEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(testStatusActions.SetTestStatusDecided),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store$.pipe(select(getTests)), this.store$.pipe(select(getTests), select(isPracticeMode)))
        )
      ),
      filter(([, , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      concatMap(([, tests]: [ReturnType<typeof testStatusActions.SetTestStatusDecided>, TestsModel, boolean]) => {
        // TODO - MES-9495 - remove old analytics
        this.analytics.logEvent(AnalyticsEventCategories.TEST_LIFECYCLE, AnalyticsEvents.TEST_DECIDED);

        //GA4 Analytics
        this.analytics.logGAEvent(analyticsEventTypePrefix(GoogleAnalyticsEvents.TEST_DECIDED, tests));
        return of(AnalyticRecorded());
      })
    )
  );

  setTestStatusWriteUpEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(testStatusActions.SetTestStatusWriteUp),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store$.pipe(select(getTests)), this.store$.pipe(select(getTests), select(isPracticeMode)))
        )
      ),
      filter(([, , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      concatMap(([, tests]: [ReturnType<typeof testStatusActions.SetTestStatusWriteUp>, TestsModel, boolean]) => {
        // TODO - MES-9495 - remove old analytics
        this.analytics.logEvent(AnalyticsEventCategories.TEST_LIFECYCLE, AnalyticsEvents.TEST_IN_WRITE_UP);

        //GA4 Analytics
        this.analytics.logGAEvent(analyticsEventTypePrefix(GoogleAnalyticsEvents.TEST_IN_WRITE_UP, tests));
        return of(AnalyticRecorded());
      })
    )
  );

  setTestStatusAutosavedEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(testStatusActions.SetTestStatusAutosaved),
      concatMap(() => {
        // TODO - MES-9495 - remove old analytics
        this.analytics.logEvent(AnalyticsEventCategories.TEST_LIFECYCLE, AnalyticsEvents.TEST_AUTOSAVED);

        // GA4 Analytics
        this.analytics.logGAEvent(GoogleAnalyticsEvents.TEST_AUTOSAVED);
        return of(AnalyticRecorded());
      })
    )
  );

  setTestStatusSubmittedEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(testStatusActions.SetTestStatusSubmitted),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store$.pipe(select(getTests)), this.store$.pipe(select(getTests), select(isPracticeMode)))
        )
      ),
      filter(([, , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      concatMap(([, tests]: [ReturnType<typeof testStatusActions.SetTestStatusSubmitted>, TestsModel, boolean]) => {
        // TODO - MES-9495 - remove old analytics
        this.analytics.logEvent(AnalyticsEventCategories.TEST_LIFECYCLE, AnalyticsEvents.TEST_SUBMITTED);

        // GA4 Analytics
        this.analytics.logGAEvent(analyticsEventTypePrefix(GoogleAnalyticsEvents.TEST_SUBMITTED, tests));
        return of(AnalyticRecorded());
      })
    )
  );
}
