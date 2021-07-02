import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, withLatestFrom, concatMap } from 'rxjs/operators';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import {
  AnalyticsScreenNames,
} from '@providers/analytics/analytics.model';
import {
  DebriefViewDidEnter,
} from '@pages/debrief/debrief.actions';
import { StoreModel } from '@shared/models/store.model';
import { Store, select } from '@ngrx/store';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import { formatAnalyticsText } from '@shared/helpers/format-analytics-text';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest, isPassed } from '@store/tests/tests.selector';
import { TestsModel } from '@store/tests/tests.model';

@Injectable()
export class DebriefAnalyticsEffects {

  constructor(
    private analytics: AnalyticsProvider,
    private actions$: Actions,
    private store$: Store<StoreModel>,
  ) {
  }

  debriefViewDidEnter$ = createEffect(() => this.actions$.pipe(
    ofType(DebriefViewDidEnter),
    concatMap((action) => of(action).pipe(
      withLatestFrom(
        this.store$.pipe(
          select(getTests),
        ),
        this.store$.pipe(
          select(getTests),
          select(getCurrentTest),
          select(isPassed),
        ),
      ),
    )),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    switchMap(([action, tests, isTestPassed]: [ReturnType<typeof DebriefViewDidEnter>, TestsModel, boolean]) => {
      const screenName = isTestPassed
        ? formatAnalyticsText(AnalyticsScreenNames.PASS_DEBRIEF, tests)
        : formatAnalyticsText(AnalyticsScreenNames.FAIL_DEBRIEF, tests);
      this.analytics.setCurrentPage(screenName);
      return of(AnalyticRecorded());
    }),
  ));
}
