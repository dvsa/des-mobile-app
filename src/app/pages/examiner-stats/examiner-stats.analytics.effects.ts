import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { switchMap } from 'rxjs/operators';
import { AnalyticsScreenNames } from '@providers/analytics/analytics.model';
import { of } from 'rxjs';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import { ExaminerStatsViewDidEnter } from '@pages/examiner-stats/examiner-stats.actions';

@Injectable()
export class ExaminerStatsAnalyticsEffects {

  constructor(
    private analytics: AnalyticsProvider,
    private actions$: Actions,
  ) {
  }

  examinerStatsView$ = createEffect(() => this.actions$.pipe(
    ofType(ExaminerStatsViewDidEnter),
    switchMap(() => {
      this.analytics.setCurrentPage(AnalyticsScreenNames.EXAMINER_STATS);
      return of(AnalyticRecorded());
    }),
  ));
}
