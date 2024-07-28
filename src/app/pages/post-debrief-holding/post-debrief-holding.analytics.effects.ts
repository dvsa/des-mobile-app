import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { PostDebriefHoldingViewDidEnter } from '@pages/post-debrief-holding/post-debrief-holding.actions';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import { AnalyticsScreenNames } from '@providers/analytics/analytics.model';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { analyticsEventTypePrefix, formatAnalyticsText } from '@shared/helpers/format-analytics-text';
import { StoreModel } from '@shared/models/store.model';
import { TestsModel } from '@store/tests/tests.model';
import { getTests } from '@store/tests/tests.reducer';
import { isPracticeMode } from '@store/tests/tests.selector';
import { of } from 'rxjs';
import { concatMap, filter, withLatestFrom } from 'rxjs/operators';

@Injectable()
export class PostDebriefHoldingAnalyticsEffects {
  constructor(
    private analytics: AnalyticsProvider,
    private actions$: Actions,
    private store$: Store<StoreModel>,
    private appConfigProvider: AppConfigProvider
  ) {}

  postDebriefHoldingViewDidEnterEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PostDebriefHoldingViewDidEnter),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store$.pipe(select(getTests)), this.store$.pipe(select(getTests), select(isPracticeMode)))
        )
      ),
      filter(([, , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      concatMap(([, tests]: [ReturnType<typeof PostDebriefHoldingViewDidEnter>, TestsModel, boolean]) => {
        // TODO - MES-9495 - remove old analytics
        const screenName = formatAnalyticsText(AnalyticsScreenNames.POST_DEBRIEF_HOLDING, tests);
        this.analytics.setCurrentPage(screenName);

        // GA4 Analytics
        this.analytics.setGACurrentPage(analyticsEventTypePrefix(AnalyticsScreenNames.POST_DEBRIEF_HOLDING, tests));
        return of(AnalyticRecorded());
      })
    )
  );
}
