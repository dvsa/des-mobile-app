import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import { AnalyticsScreenNames, GoogleAnalyticsEvents } from '@providers/analytics/analytics.model';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { RekeySearchViewDidEnter, SearchBookedTest } from './rekey-search.actions';

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
}
