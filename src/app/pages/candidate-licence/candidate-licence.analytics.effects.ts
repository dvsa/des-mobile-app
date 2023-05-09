import { Injectable } from '@angular/core';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  concatMap, filter, switchMap, withLatestFrom,
} from 'rxjs/operators';
import { of } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { getTests } from '@store/tests/tests.reducer';
import { TestsModel } from '@store/tests/tests.model';
import { formatAnalyticsText } from '@shared/helpers/format-analytics-text';
import { AnalyticsScreenNames } from '@providers/analytics/analytics.model';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import { CandidateLicenceViewDidEnter } from '@pages/candidate-licence/candidate-licence.actions';
import { StoreModel } from '@shared/models/store.model';
import { isPracticeMode } from '@store/tests/tests.selector';
import { AppConfigProvider } from '@providers/app-config/app-config';

@Injectable()
export class CandidateLicenceAnalyticsEffects {
  constructor(
    public analytics: AnalyticsProvider,
    private actions$: Actions,
    private store$: Store<StoreModel>,
    private appConfigProvider: AppConfigProvider,
  ) {
  }

  candidateLicenceInfoViewDidEnter$ = createEffect(() => this.actions$.pipe(
    ofType(CandidateLicenceViewDidEnter),
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
    filter(([, practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    switchMap(([, tests]: [ReturnType<typeof CandidateLicenceViewDidEnter>, TestsModel, boolean]) => {
      const screenName = formatAnalyticsText(AnalyticsScreenNames.CANDIDATE_LICENCE_INFO, tests);
      this.analytics.setCurrentPage(screenName);
      return of(AnalyticRecorded());
    }),
  ));
}
