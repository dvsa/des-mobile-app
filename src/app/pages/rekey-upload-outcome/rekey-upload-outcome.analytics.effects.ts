import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, withLatestFrom, concatMap } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';

import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticsScreenNames } from '@providers/analytics/analytics.model';
import { StoreModel } from '@shared/models/store.model';
import { getTests } from '@store/tests/tests.reducer';
import { formatAnalyticsText } from '@shared/helpers/format-analytics-text';
import { TestsModel } from '@store/tests/tests.model';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import {
  RekeyUploadOutcomeViewDidEnter,
} from './rekey-upload-outcome.actions';

@Injectable()
export class RekeyUploadOutcomeAnalyticsEffects {
  constructor(
    private analytics: AnalyticsProvider,
    private actions$: Actions,
    private store$: Store<StoreModel>,
  ) {
  }

  rekeyUploadedViewDidEnter$ = createEffect(() => this.actions$.pipe(
    ofType(RekeyUploadOutcomeViewDidEnter),
    concatMap((action) => of(action).pipe(
      withLatestFrom(
        this.store$.pipe(
          select(getTests),
        ),
      ),
    )),
    switchMap(([, tests]: [ReturnType<typeof RekeyUploadOutcomeViewDidEnter>, TestsModel]) => {
      const screenName = formatAnalyticsText(AnalyticsScreenNames.REKEY_UPLOADED, tests);
      this.analytics.setCurrentPage(screenName);
      return of(AnalyticRecorded());
    }),
  ));
}
