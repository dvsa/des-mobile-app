import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import {
  AnalyticsScreenNames,
} from '@providers/analytics/analytics.model';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import { ConfirmTestDetailsViewDidEnter } from '@pages/confirm-test-details/confirm-test-details.actions';

@Injectable()
export class ConfirmTestDetailsAnalyticsEffects {

  constructor(
    public analytics: AnalyticsProvider,
    private actions$: Actions,
  ) {
  }

  confirmTestDetailsView$ = createEffect(() => this.actions$.pipe(
    ofType(ConfirmTestDetailsViewDidEnter),
    switchMap(() => {
      this.analytics.setCurrentPage(AnalyticsScreenNames.CONFIRM_TEST_DETAILS);
      return of(AnalyticRecorded());
    }),
  ));
}
