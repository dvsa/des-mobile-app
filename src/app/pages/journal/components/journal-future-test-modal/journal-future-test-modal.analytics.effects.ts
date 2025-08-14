import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import {
  GoogleAnalyticsEvents,
  GoogleAnalyticsEventsTitles,
  GoogleAnalyticsEventsValues,
} from '@providers/analytics/analytics.model';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import * as futureTestModalActions from './journal-future-test-modal.actions';
@Injectable()
export class JournalFutureTestModalAnalyticsEffects {
  constructor(
    public analytics: AnalyticsProvider,
    public actions$: Actions
  ) {}

  futureTestModalCancel$ = createEffect(() =>
    this.actions$.pipe(
      ofType(futureTestModalActions.FutureTestModalCancelButton),
      switchMap(() => {
        this.analytics.logGAEvent(
          GoogleAnalyticsEvents.DX_TEST_IN_FUTURE,
          GoogleAnalyticsEventsTitles.MODAL,
          GoogleAnalyticsEventsValues.CANCELLED
        );
        return of(AnalyticRecorded());
      })
    )
  );

  futureTestModalContinue$ = createEffect(() =>
    this.actions$.pipe(
      ofType(futureTestModalActions.FutureTestModalContinueButton),
      switchMap(() => {
        this.analytics.logGAEvent(
          GoogleAnalyticsEvents.DX_TEST_IN_FUTURE,
          GoogleAnalyticsEventsTitles.MODAL,
          GoogleAnalyticsEventsValues.CONTINUE
        );
        return of(AnalyticRecorded());
      })
    )
  );
}
