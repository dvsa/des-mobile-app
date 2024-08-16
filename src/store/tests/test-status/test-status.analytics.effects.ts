import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { concatMap, filter, withLatestFrom } from 'rxjs/operators';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { GoogleAnalyticsEvents } from '@providers/analytics/analytics.model';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import * as testStatusActions from './test-status.actions';
import { analyticsEventTypePrefix } from '@shared/helpers/format-analytics-text';
import { select, Store } from '@ngrx/store';
import { getTests } from '@store/tests/tests.reducer';
import { isPracticeMode } from '@store/tests/tests.selector';
import { TestsModel } from '@store/tests/tests.model';
import { StoreModel } from '@shared/models/store.model';
import { AppConfigProvider } from '@providers/app-config/app-config';

@Injectable()
export class TestStatusAnalyticsEffects {

  constructor(
    public analytics: AnalyticsProvider,
    private actions$: Actions,
    private store$: Store<StoreModel>,
    private appConfigProvider: AppConfigProvider,
  ) {
  }

  setTestStatusDecidedEffect$ = createEffect(() => this.actions$.pipe(
    ofType(testStatusActions.SetTestStatusDecided),
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
    concatMap((
      [, tests]:
      [ReturnType<typeof testStatusActions.SetTestStatusDecided>, TestsModel, boolean],
    ) => {

      //GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.TEST_DECIDED, tests),
      );
      return of(AnalyticRecorded());
    }),
  ));

  setTestStatusWriteUpEffect$ = createEffect(() => this.actions$.pipe(
    ofType(testStatusActions.SetTestStatusWriteUp),
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
    concatMap((
      [, tests]:
      [ReturnType<typeof testStatusActions.SetTestStatusWriteUp>, TestsModel, boolean],
    ) => {

      //GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.TEST_IN_WRITE_UP, tests),
      );
      return of(AnalyticRecorded());
    }),
  ));

  setTestStatusAutosavedEffect$ = createEffect(() => this.actions$.pipe(
    ofType(testStatusActions.SetTestStatusAutosaved),
    concatMap(() => {

      // GA4 Analytics
      this.analytics.logGAEvent(
        GoogleAnalyticsEvents.TEST_AUTOSAVED,
      );
      return of(AnalyticRecorded());
    }),
  ));

  setTestStatusSubmittedEffect$ = createEffect(() => this.actions$.pipe(
    ofType(testStatusActions.SetTestStatusSubmitted),
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
    concatMap((
      [, tests]:
      [ReturnType<typeof testStatusActions.SetTestStatusSubmitted>, TestsModel, boolean],
    ) => {

      // GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.TEST_SUBMITTED, tests),
      );
      return of(AnalyticRecorded());
    }),
  ));

}
