import { Injectable } from '@angular/core';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { concatMap, filter, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { getTests } from '@store/tests/tests.reducer';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import { TestsModel } from '@store/tests/tests.model';
import { formatAnalyticsText } from '@shared/helpers/format-analytics-text';
import { AnalyticsScreenNames } from '@providers/analytics/analytics.model';
import { PostDebriefHoldingViewDidEnter } from '@pages/post-debrief-holding/post-debrief-holding.actions';
import { isPracticeMode } from '@store/tests/tests.selector';
import { AppConfigProvider } from '@providers/app-config/app-config';

@Injectable()
export class PostDebriefHoldingAnalyticsEffects {
  constructor(
    private analytics: AnalyticsProvider,
    private actions$: Actions,
    private store$: Store<StoreModel>,
    private appConfigProvider: AppConfigProvider,
  ) {
  }

  postDebriefHoldingViewDidEnterEffect$ = createEffect(() => this.actions$.pipe(
    ofType(PostDebriefHoldingViewDidEnter),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    concatMap(([, tests]: [ReturnType<typeof PostDebriefHoldingViewDidEnter>, TestsModel, boolean]) => {
      const screenName = formatAnalyticsText(AnalyticsScreenNames.POST_DEBRIEF_HOLDING, tests);
      this.analytics.setCurrentPage(screenName);
      return of(AnalyticRecorded());
    }),
  ));

}
