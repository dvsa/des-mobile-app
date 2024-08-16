import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import {
  AnalyticsScreenNames,
  GoogleAnalyticsEvents,
  GoogleAnalyticsEventsTitles,
  GoogleAnalyticsEventsValues,
} from '@providers/analytics/analytics.model';
import { analyticsEventTypePrefix } from '@shared/helpers/format-analytics-text';
import { StoreModel } from '@shared/models/store.model';
import {
  BalanceQuestionOutcomeChanged,
  BalanceQuestionSelected,
  SafetyQuestionOutcomeChanged,
  SafetyQuestionSelected,
} from '@store/tests/test-data/cat-a-mod2/safety-and-balance/safety-and-balance.cat-a-mod2.actions';
import { TestsModel } from '@store/tests/tests.model';
import { getTests } from '@store/tests/tests.reducer';
import { of } from 'rxjs';
import { concatMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { VehicleChecksViewDidEnter } from './vehicle-checks-modal.cat-a-mod2.actions';

@Injectable()
export class VehicleChecksModalCatAMod2AnalyticsEffects {
  constructor(
    private analytics: AnalyticsProvider,
    private actions$: Actions,
    private store$: Store<StoreModel>
  ) {}

  vehicleChecksModalViewDidEnter$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VehicleChecksViewDidEnter),
      concatMap((action) => of(action).pipe(withLatestFrom(this.store$.pipe(select(getTests))))),
      switchMap(([, tests]: [ReturnType<typeof VehicleChecksViewDidEnter>, TestsModel]) => {
        // GA4 Analytics
        this.analytics.setGACurrentPage(analyticsEventTypePrefix(AnalyticsScreenNames.VEHICLE_CHECKS, tests));
        return of(AnalyticRecorded());
      })
    )
  );

  safetyQuestionChanged$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SafetyQuestionSelected),
      concatMap((action) => of(action).pipe(withLatestFrom(this.store$.pipe(select(getTests))))),
      switchMap(([action, tests]: [ReturnType<typeof SafetyQuestionSelected>, TestsModel]) => {
        // GA4 Analytics
        this.analytics.logGAEvent(
          analyticsEventTypePrefix(GoogleAnalyticsEvents.SAFETY_QUESTION + (action.index + 1), tests),
          GoogleAnalyticsEventsTitles.QUESTION_NUMBER,
          action.safetyQuestion.code
        );
        return of(AnalyticRecorded());
      })
    )
  );

  safetyQuestionOutcomeChanged$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SafetyQuestionOutcomeChanged),
      concatMap((action) => of(action).pipe(withLatestFrom(this.store$.pipe(select(getTests))))),
      switchMap(([action, tests]: [ReturnType<typeof SafetyQuestionOutcomeChanged>, TestsModel]) => {
        // GA4 Analytics
        this.analytics.logGAEvent(
          analyticsEventTypePrefix(GoogleAnalyticsEvents.SAFETY_QUESTION + (action.index + 1), tests),
          GoogleAnalyticsEventsTitles.RESULT,
          action.safetyQuestionOutcome === 'P'
            ? GoogleAnalyticsEventsValues.CORRECT
            : GoogleAnalyticsEventsValues.DRIVING_FAULT
        );
        return of(AnalyticRecorded());
      })
    )
  );

  balanceQuestionChanged$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BalanceQuestionSelected),
      concatMap((action) => of(action).pipe(withLatestFrom(this.store$.pipe(select(getTests))))),
      switchMap(([action, tests]: [ReturnType<typeof BalanceQuestionSelected>, TestsModel]) => {
        // GA4 Analytics
        this.analytics.logGAEvent(
          analyticsEventTypePrefix(GoogleAnalyticsEvents.BALANCE_QUESTION + (action.index + 1), tests),
          GoogleAnalyticsEventsTitles.QUESTION_NUMBER,
          action.balanceQuestion.code
        );
        return of(AnalyticRecorded());
      })
    )
  );

  balanceQuestionOutcomeChanged$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BalanceQuestionOutcomeChanged),
      concatMap((action) => of(action).pipe(withLatestFrom(this.store$.pipe(select(getTests))))),
      switchMap(([action, tests]: [ReturnType<typeof BalanceQuestionOutcomeChanged>, TestsModel]) => {
        // GA4 Analytics
        this.analytics.logGAEvent(
          analyticsEventTypePrefix(GoogleAnalyticsEvents.BALANCE_QUESTION + (action.index + 1), tests),
          GoogleAnalyticsEventsTitles.RESULT,
          action.balanceQuestionOutcome === 'P'
            ? GoogleAnalyticsEventsValues.CORRECT
            : GoogleAnalyticsEventsValues.DRIVING_FAULT
        );
        return of(AnalyticRecorded());
      })
    )
  );
}
