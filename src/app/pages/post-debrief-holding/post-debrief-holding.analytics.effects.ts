import { Injectable } from '@angular/core';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import {
  Actions, createEffect, ofType,
} from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { concatMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { getTests } from '@store/tests/tests.reducer';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import { TestsModel } from '@store/tests/tests.model';
import { formatAnalyticsText } from '@shared/helpers/format-analytics-text';
import { AnalyticsScreenNames } from '@providers/analytics/analytics.model';
import { PostDebriefHoldingViewDidEnter } from '@pages/post-debrief-holding/post-debrief-holding.actions';

@Injectable()
export class PostDebriefHoldingAnalyticsEffects {
  constructor(
    private analytics: AnalyticsProvider,
    private actions$: Actions,
    private store$: Store<StoreModel>,
  ) {
  }

  postDebriefHoldingViewDidEnterEffect$ = createEffect(() => this.actions$.pipe(
    ofType(PostDebriefHoldingViewDidEnter),
    concatMap((action) => of(action).pipe(
      withLatestFrom(
        this.store$.pipe(
          select(getTests),
        ),
      ),
    )),
    concatMap(([, tests]: [ReturnType<typeof PostDebriefHoldingViewDidEnter>, TestsModel]) => {
      const screenName = formatAnalyticsText(AnalyticsScreenNames.POST_DEBRIEF_HOLDING, tests);
      this.analytics.setCurrentPage(screenName);
      return of(AnalyticRecorded());
    }),
  ));

}
