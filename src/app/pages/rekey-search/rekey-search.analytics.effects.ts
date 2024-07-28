import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import {
  AnalyticsEventCategories,
  AnalyticsEvents,
  AnalyticsScreenNames,
  GoogleAnalyticsEvents,
} from '@providers/analytics/analytics.model';
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
        // TODO - MES-9495 - remove old analytics
        this.analytics.setCurrentPage(AnalyticsScreenNames.REKEY_SEARCH);

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
        // TODO - MES-9495 - remove old analytics
        this.analytics.logEvent(AnalyticsEventCategories.REKEY_SEARCH, AnalyticsEvents.TEST_BOOKING_SEARCH);

        // GA4 Analytics
        this.analytics.logGAEvent(GoogleAnalyticsEvents.TEST_BOOKING_SEARCH);
        return of(AnalyticRecorded());
      })
    )
  );
}
