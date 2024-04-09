import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticsEventCategories, AnalyticsEvents, GoogleAnalyticsEvents } from '@providers/analytics/analytics.model';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import * as testStatusActions from './test-status.actions';

@Injectable()
export class TestStatusAnalyticsEffects {

  constructor(
    public analytics: AnalyticsProvider,
    private actions$: Actions,
  ) {
  }

  setTestStatusDecidedEffect$ = createEffect(() => this.actions$.pipe(
    ofType(testStatusActions.SetTestStatusDecided),
    concatMap(() => {

      // TODO - MES-9495 - remove old analytics
      this.analytics.logEvent(
        AnalyticsEventCategories.TEST_LIFECYCLE,
        AnalyticsEvents.TEST_DECIDED,
      );

      //GA4 Analytics
      this.analytics.logGAEvent(
        GoogleAnalyticsEvents.TEST_DECIDED
      )
      return of(AnalyticRecorded());
    }),
  ));

  setTestStatusWriteUpEffect$ = createEffect(() => this.actions$.pipe(
    ofType(testStatusActions.SetTestStatusWriteUp),
    concatMap(() => {

      // TODO - MES-9495 - remove old analytics
      this.analytics.logEvent(
        AnalyticsEventCategories.TEST_LIFECYCLE,
        AnalyticsEvents.TEST_IN_WRITE_UP,
      );

      //GA4 Analytics
      this.analytics.logGAEvent(
        GoogleAnalyticsEvents.TEST_IN_WRITE_UP
      )
      return of(AnalyticRecorded());
    }),
  ));

  setTestStatusAutosavedEffect$ = createEffect(() => this.actions$.pipe(
    ofType(testStatusActions.SetTestStatusAutosaved),
    concatMap(() => {

      // TODO - MES-9495 - remove old analytics
      this.analytics.logEvent(
        AnalyticsEventCategories.TEST_LIFECYCLE,
        AnalyticsEvents.TEST_AUTOSAVED,
      );

      // GA4 Analytics
      this.analytics.logGAEvent(
        GoogleAnalyticsEvents.TEST_AUTOSAVED
      )
      return of(AnalyticRecorded());
    }),
  ));

  setTestStatusSubmittedEffect$ = createEffect(() => this.actions$.pipe(
    ofType(testStatusActions.SetTestStatusSubmitted),
    concatMap(() => {

      // TODO - MES-9495 - remove old analytics
      this.analytics.logEvent(
        AnalyticsEventCategories.TEST_LIFECYCLE,
        AnalyticsEvents.TEST_SUBMITTED,
      );

      // GA4 Analytics
      this.analytics.logGAEvent(
        GoogleAnalyticsEvents.TEST_SUBMITTED
      )
      return of(AnalyticRecorded());
    }),
  ));

}
