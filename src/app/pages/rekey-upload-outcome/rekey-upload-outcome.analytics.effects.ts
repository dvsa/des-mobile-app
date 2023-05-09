import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import {
  concatMap, filter, switchMap, withLatestFrom,
} from 'rxjs/operators';
import { select, Store } from '@ngrx/store';

import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticsScreenNames } from '@providers/analytics/analytics.model';
import { StoreModel } from '@shared/models/store.model';
import { getTests } from '@store/tests/tests.reducer';
import { formatAnalyticsText } from '@shared/helpers/format-analytics-text';
import { TestsModel } from '@store/tests/tests.model';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { isPracticeMode } from '@store/tests/tests.selector';
import { RekeyUploadOutcomeViewDidEnter } from './rekey-upload-outcome.actions';

@Injectable()
export class RekeyUploadOutcomeAnalyticsEffects {
  constructor(
    private analytics: AnalyticsProvider,
    private actions$: Actions,
    private store$: Store<StoreModel>,
    private appConfigProvider: AppConfigProvider,
  ) {
  }

  rekeyUploadedViewDidEnter$ = createEffect(() => this.actions$.pipe(
    ofType(RekeyUploadOutcomeViewDidEnter),
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
    switchMap(([, tests]: [ReturnType<typeof RekeyUploadOutcomeViewDidEnter>, TestsModel, boolean]) => {
      const screenName = formatAnalyticsText(AnalyticsScreenNames.REKEY_UPLOADED, tests);
      this.analytics.setCurrentPage(screenName);
      return of(AnalyticRecorded());
    }),
  ));
}
