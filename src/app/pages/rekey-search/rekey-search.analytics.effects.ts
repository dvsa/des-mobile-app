import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import {
  AnalyticsScreenNames, AnalyticsEventCategories, AnalyticsEvents,
} from '@providers/analytics/analytics.model';
import {
  RekeySearchViewDidEnter,
  SearchBookedTest,
} from './rekey-search.actions';

@Injectable()
export class RekeySearchAnalyticsEffects {

  constructor(
    public analytics: AnalyticsProvider,
    private actions$: Actions,
  ) {
  }

  rekeySearchViewDidEnter$ = createEffect(() => this.actions$.pipe(
    ofType(RekeySearchViewDidEnter.type),
    switchMap(() => {
      this.analytics.setCurrentPage(AnalyticsScreenNames.REKEY_SEARCH);
      return of(AnalyticRecorded());
    }),
  ));

  rekeySearchPerformed$ = createEffect(() => this.actions$.pipe(
    ofType(SearchBookedTest.type),
    switchMap(() => {
      this.analytics.logEvent(
        AnalyticsEventCategories.REKEY_SEARCH,
        AnalyticsEvents.TEST_BOOKING_SEARCH,
      );
      return of(AnalyticRecorded());
    }),
  ));
}
