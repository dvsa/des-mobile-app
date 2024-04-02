import { Injectable } from '@angular/core';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ContinueUnuploadedTest, UnuploadedTestsViewDidEnter } from '@pages/unuploaded-tests/unuploaded-tests.actions';
import { switchMap } from 'rxjs/operators';
import {
  AnalyticsEventCategories,
  AnalyticsEvents,
  AnalyticsScreenNames,
  GoogleAnalyticsEvents, GoogleAnalyticsEventsTitles,
} from '@providers/analytics/analytics.model';
import { of } from 'rxjs';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';

@Injectable()
export class UnuploadedTestsAnalyticsEffects {
  constructor(
    public analytics: AnalyticsProvider,
    private actions$: Actions,
  ) {
  }

  unUploadedTestViewDidEnter$ = createEffect(() => this.actions$.pipe(
    ofType(UnuploadedTestsViewDidEnter),
    switchMap(() => {

      // TODO - MES-9495 - remove old analytics
      this.analytics.setCurrentPage(AnalyticsScreenNames.UN_UPLOADED);

      //GA4 Analytics
      this.analytics.setGACurrentPage(AnalyticsScreenNames.UN_UPLOADED);

      return of(AnalyticRecorded());
    }),
  ));

  continueUnUploadedTest$ = createEffect(() => this.actions$.pipe(
    ofType(ContinueUnuploadedTest),
    switchMap(({ testStatus }) => {

      // TODO - MES-9495 - remove old analytics
      this.analytics.logEvent(
        AnalyticsEventCategories.UN_UPLOADED_TESTS,
        AnalyticsEvents.TEST_SELECTED,
        testStatus,
      );

      //GA4 Analytics
      this.analytics.logGAEvent(
        GoogleAnalyticsEvents.INCOMPLETE_TESTS,
        GoogleAnalyticsEventsTitles.TEST_STATUS,
        testStatus
      );
      return of(AnalyticRecorded());
    }),
  ));
}
