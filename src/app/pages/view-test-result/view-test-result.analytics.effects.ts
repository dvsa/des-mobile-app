import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import { AnalyticsScreenNames, AnalyticsDimensionIndices } from '@providers/analytics/analytics.model';
import { ViewTestResultViewDidEnter } from './view-test-result.actions';

@Injectable()
export class ViewTestResultAnalyticsEffects {

  constructor(
    public analytics: AnalyticsProvider,
    private actions$: Actions,
  ) {
  }

  viewTestResultViewDidEnter$ = createEffect(() => this.actions$.pipe(
    ofType(ViewTestResultViewDidEnter),
    switchMap((action: ReturnType<typeof ViewTestResultViewDidEnter>) => {
      this.analytics.addCustomDimension(AnalyticsDimensionIndices.APPLICATION_REFERENCE, action.applicationReference);
      this.analytics.setCurrentPage(AnalyticsScreenNames.VIEW_TEST_RESULT);
      return of(AnalyticRecorded());
    }),
  ));
}
