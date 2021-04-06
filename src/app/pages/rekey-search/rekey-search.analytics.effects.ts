import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AnalyticsProvider } from '../../providers/analytics/analytics';
import { AnalyticRecorded } from '../../providers/analytics/analytics.actions';
import {
  RekeySearchViewDidEnter,
  SearchBookedTest,
} from './rekey-search.actions';
import {
  AnalyticsScreenNames, AnalyticsEventCategories, AnalyticsEvents,
} from '../../providers/analytics/analytics.model';

@Injectable()
export class RekeySearchAnalyticsEffects {

  constructor(
    public analytics: AnalyticsProvider,
    private actions$: Actions,
  ) {
  }

  @Effect()
  rekeySearchViewDidEnter$ = this.actions$.pipe(
    ofType(RekeySearchViewDidEnter),
    switchMap(() => {
      this.analytics.setCurrentPage(AnalyticsScreenNames.REKEY_SEARCH);
      return of(AnalyticRecorded());
    }),
  );

  @Effect()
  rekeySearchPerformed$ = this.actions$.pipe(
    ofType(SearchBookedTest),
    switchMap(() => {
      this.analytics.logEvent(
        AnalyticsEventCategories.REKEY_SEARCH,
        AnalyticsEvents.TEST_BOOKING_SEARCH,
      );
      return of(AnalyticRecorded());
    }),
  );
}
