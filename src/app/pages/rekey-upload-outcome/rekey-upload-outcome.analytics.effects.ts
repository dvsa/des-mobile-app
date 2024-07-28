import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { of } from 'rxjs';
import { concatMap, filter, switchMap, withLatestFrom } from 'rxjs/operators';

import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import { AnalyticsScreenNames } from '@providers/analytics/analytics.model';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { analyticsEventTypePrefix, formatAnalyticsText } from '@shared/helpers/format-analytics-text';
import { StoreModel } from '@shared/models/store.model';
import { TestsModel } from '@store/tests/tests.model';
import { getTests } from '@store/tests/tests.reducer';
import { isPracticeMode } from '@store/tests/tests.selector';
import { RekeyUploadOutcomeViewDidEnter } from './rekey-upload-outcome.actions';

@Injectable()
export class RekeyUploadOutcomeAnalyticsEffects {
  constructor(
    private analytics: AnalyticsProvider,
    private actions$: Actions,
    private store$: Store<StoreModel>,
    private appConfigProvider: AppConfigProvider
  ) {}

  rekeyUploadedViewDidEnter$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RekeyUploadOutcomeViewDidEnter),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store$.pipe(select(getTests)), this.store$.pipe(select(getTests), select(isPracticeMode)))
        )
      ),
      filter(([, , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      switchMap(([, tests]: [ReturnType<typeof RekeyUploadOutcomeViewDidEnter>, TestsModel, boolean]) => {
        // TODO - MES-9495 - remove old analytics
        const screenName = formatAnalyticsText(AnalyticsScreenNames.REKEY_UPLOADED, tests);
        this.analytics.setCurrentPage(screenName);

        // GA4 analytics
        this.analytics.setGACurrentPage(analyticsEventTypePrefix(AnalyticsScreenNames.REKEY_UPLOADED, tests));
        return of(AnalyticRecorded());
      })
    )
  );
}
