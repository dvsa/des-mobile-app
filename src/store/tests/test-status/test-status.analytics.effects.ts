import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticsEventCategories, AnalyticsEvents } from '@providers/analytics/analytics.model';
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
      this.analytics.logEvent(
        AnalyticsEventCategories.TEST_LIFECYCLE,
        AnalyticsEvents.TEST_DECIDED,
      );
      return of(AnalyticRecorded());
    }),
  ));

  setTestStatusWriteUpEffect$ = createEffect(() => this.actions$.pipe(
    ofType(testStatusActions.SetTestStatusWriteUp),
    concatMap(() => {
      this.analytics.logEvent(
        AnalyticsEventCategories.TEST_LIFECYCLE,
        AnalyticsEvents.TEST_IN_WRITE_UP,
      );
      return of(AnalyticRecorded());
    }),
  ));

  setTestStatusAutosavedEffect$ = createEffect(() => this.actions$.pipe(
    ofType(testStatusActions.SetTestStatusAutosaved),
    concatMap(() => {
      this.analytics.logEvent(
        AnalyticsEventCategories.TEST_LIFECYCLE,
        AnalyticsEvents.TEST_AUTOSAVED,
      );
      return of(AnalyticRecorded());
    }),
  ));

  setTestStatusSubmittedEffect$ = createEffect(() => this.actions$.pipe(
    ofType(testStatusActions.SetTestStatusSubmitted),
    concatMap(() => {
      this.analytics.logEvent(
        AnalyticsEventCategories.TEST_LIFECYCLE,
        AnalyticsEvents.TEST_SUBMITTED,
      );
      return of(AnalyticRecorded());
    }),
  ));

}
