import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticNotRecorded, AnalyticRecorded } from '@providers/analytics/analytics.actions';
import {
  AnalyticsScreenNames,
  GoogleAnalyticsEvents,
  GoogleAnalyticsEventsTitles,
  GoogleAnalyticsEventsValues,
} from '@providers/analytics/analytics.model';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import {
  RekeySearchViewDidEnter,
  SearchBookedTest,
  isRekeyTestLessThanHalfAnHourLateUpdated,
} from './rekey-search.actions';

@Injectable()
export class RekeySearchAnalyticsEffects {
  constructor(
    public analytics: AnalyticsProvider,
    private actions$: Actions
  ) {}

  rekeySearchViewDidEnter$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RekeySearchViewDidEnter),
      switchMap(() => {
        // GA4 Analytics
        this.analytics.setGACurrentPage(AnalyticsScreenNames.REKEY_SEARCH);
        return of(AnalyticRecorded());
      })
    )
  );

  rekeySearchPerformed$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SearchBookedTest),
      switchMap(() => {
        // GA4 Analytics
        this.analytics.logGAEvent(GoogleAnalyticsEvents.TEST_BOOKING_SEARCH);
        return of(AnalyticRecorded());
      })
    )
  );
  rekeyTestLessThanHalfAnHourOld$ = createEffect(() =>
    this.actions$.pipe(
      ofType(isRekeyTestLessThanHalfAnHourLateUpdated),
      switchMap((value) => {
        if (value.isLate) {
          // GA4 Analytics
          this.analytics.logGAEvent(
            GoogleAnalyticsEvents.REKEY_SEARCH_PAGE,
            GoogleAnalyticsEventsTitles.THIRTY_MINUTE_TIMER,
            GoogleAnalyticsEventsValues.DISPLAYED
          );
          return of(AnalyticRecorded());
        }
        return of(AnalyticNotRecorded());
      })
    )
  );
}
