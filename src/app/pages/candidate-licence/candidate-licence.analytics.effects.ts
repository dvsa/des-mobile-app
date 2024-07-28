import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { CandidateLicenceViewDidEnter } from '@pages/candidate-licence/candidate-licence.actions';
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
import { concatMap, filter, switchMap, withLatestFrom } from 'rxjs/operators';

@Injectable()
export class CandidateLicenceAnalyticsEffects {
  constructor(
    public analytics: AnalyticsProvider,
    private actions$: Actions,
    private store$: Store<StoreModel>,
    private appConfigProvider: AppConfigProvider
  ) {}

  candidateLicenceInfoViewDidEnter$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CandidateLicenceViewDidEnter),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store$.pipe(select(getTests)), this.store$.pipe(select(getTests), select(isPracticeMode)))
        )
      ),
      filter(([, practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      switchMap(([, tests]: [ReturnType<typeof CandidateLicenceViewDidEnter>, TestsModel, boolean]) => {
        // TODO - MES-9495 - remove old analytics
        const screenName = formatAnalyticsText(AnalyticsScreenNames.CANDIDATE_LICENCE_INFO, tests);
        this.analytics.setCurrentPage(screenName);

        // GA4 Analytics
        this.analytics.setGACurrentPage(analyticsEventTypePrefix(AnalyticsScreenNames.CANDIDATE_LICENCE_INFO, tests));
        return of(AnalyticRecorded());
      })
    )
  );
}
