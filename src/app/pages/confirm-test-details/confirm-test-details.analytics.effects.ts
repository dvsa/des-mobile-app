import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { concatMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import {
  AnalyticsEventCategories, AnalyticsEvents,
  AnalyticsScreenNames,
} from '@providers/analytics/analytics.model';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import {
  BackButtonClick,
  BackToDebrief,
  ConfirmTestDetailsViewDidEnter,
} from '@pages/confirm-test-details/confirm-test-details.actions';
import { formatAnalyticsText } from '@shared/helpers/format-analytics-text';
import { select, Store } from '@ngrx/store';
import { getTests } from '@store/tests/tests.reducer';
import { StoreModel } from '@shared/models/store.model';
import { TestsModel } from '@store/tests/tests.model';

@Injectable()
export class ConfirmTestDetailsAnalyticsEffects {

  constructor(
    public analytics: AnalyticsProvider,
    private actions$: Actions,
    private store$: Store<StoreModel>,
  ) {
  }

  confirmTestDetailsView$ = createEffect(() => this.actions$.pipe(
    ofType(ConfirmTestDetailsViewDidEnter),
    switchMap(() => {
      this.analytics.setCurrentPage(AnalyticsScreenNames.CONFIRM_TEST_DETAILS);
      return of(AnalyticRecorded());
    }),
  ));

  backToDebriefClicked$ = createEffect(() => this.actions$.pipe(
    ofType(BackToDebrief),
    concatMap((action) => of(action).pipe(
      withLatestFrom(
        this.store$.pipe(
          select(getTests),
        ),
      ),
    )),
    concatMap(([, tests]: [ReturnType<typeof BackToDebrief>, TestsModel]) => {
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.NAVIGATION, tests),
        formatAnalyticsText(AnalyticsEvents.BACK, tests),
        'Back to debrief',
      );
      return of(AnalyticRecorded());
    }),
  ));

  backButtonClicked$ = createEffect(() => this.actions$.pipe(
    ofType(BackButtonClick),
    concatMap((action) => of(action).pipe(
      withLatestFrom(
        this.store$.pipe(
          select(getTests),
        ),
      ),
    )),
    concatMap(([, tests]: [ReturnType<typeof BackButtonClick>, TestsModel]) => {
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.NAVIGATION, tests),
        formatAnalyticsText(AnalyticsEvents.BACK, tests),
        'Back to finalise outcome',
      );
      return of(AnalyticRecorded());
    }),
  ));
}
