import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import {
  concatMap, filter, switchMap, withLatestFrom,
} from 'rxjs/operators';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticsScreenNames } from '@providers/analytics/analytics.model';
import { DebriefViewDidEnter } from '@pages/debrief/debrief.actions';
import { StoreModel } from '@shared/models/store.model';
import { select, Store } from '@ngrx/store';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import { formatAnalyticsText } from '@shared/helpers/format-analytics-text';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest, isPassed, isPracticeMode } from '@store/tests/tests.selector';
import { TestsModel } from '@store/tests/tests.model';
import { AppConfigProvider } from '@providers/app-config/app-config';

@Injectable()
export class DebriefAnalyticsEffects {

  constructor(
    private analytics: AnalyticsProvider,
    private actions$: Actions,
    private store$: Store<StoreModel>,
    private appConfigProvider: AppConfigProvider,
  ) {
  }

  debriefViewDidEnter$ = createEffect(() => this.actions$.pipe(
    ofType(DebriefViewDidEnter),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(getCurrentTest),
            select(isPassed),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    switchMap(([, tests, isTestPassed]: [ReturnType<typeof DebriefViewDidEnter>, TestsModel, boolean, boolean]) => {
      const screenName = isTestPassed
        ? formatAnalyticsText(AnalyticsScreenNames.PASS_DEBRIEF, tests)
        : formatAnalyticsText(AnalyticsScreenNames.FAIL_DEBRIEF, tests);
      this.analytics.setCurrentPage(screenName);
      return of(AnalyticRecorded());
    }),
  ));
}
