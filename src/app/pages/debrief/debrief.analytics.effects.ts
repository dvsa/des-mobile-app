import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { DebriefViewDidEnter } from '@pages/debrief/debrief.actions';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import { AnalyticsScreenNames } from '@providers/analytics/analytics.model';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { analyticsEventTypePrefix, formatAnalyticsText } from '@shared/helpers/format-analytics-text';
import { StoreModel } from '@shared/models/store.model';
import { TestsModel } from '@store/tests/tests.model';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest, isPassed, isPracticeMode } from '@store/tests/tests.selector';
import { of } from 'rxjs';
import { concatMap, filter, switchMap, withLatestFrom } from 'rxjs/operators';

@Injectable()
export class DebriefAnalyticsEffects {
  constructor(
    private analytics: AnalyticsProvider,
    private actions$: Actions,
    private store$: Store<StoreModel>,
    private appConfigProvider: AppConfigProvider
  ) {}

  debriefViewDidEnter$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DebriefViewDidEnter),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(
            this.store$.pipe(select(getTests)),
            this.store$.pipe(select(getTests), select(getCurrentTest), select(isPassed)),
            this.store$.pipe(select(getTests), select(isPracticeMode))
          )
        )
      ),
      filter(([, practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      switchMap(([, tests, isTestPassed]: [ReturnType<typeof DebriefViewDidEnter>, TestsModel, boolean, boolean]) => {
        // TODO - MES-9495 - remove old analytics
        let screenName = isTestPassed
          ? formatAnalyticsText(AnalyticsScreenNames.PASS_DEBRIEF, tests)
          : formatAnalyticsText(AnalyticsScreenNames.FAIL_DEBRIEF, tests);
        this.analytics.setCurrentPage(screenName);
        // GA4 Analytics
        screenName = isTestPassed
          ? analyticsEventTypePrefix(AnalyticsScreenNames.PASS_DEBRIEF, tests)
          : analyticsEventTypePrefix(AnalyticsScreenNames.FAIL_DEBRIEF, tests);
        this.analytics.setCurrentPage(screenName);
        this.analytics.setGACurrentPage(screenName);
        return of(AnalyticRecorded());
      })
    )
  );
}
