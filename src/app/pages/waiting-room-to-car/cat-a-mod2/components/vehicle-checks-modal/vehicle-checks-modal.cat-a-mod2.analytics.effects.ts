import { of } from 'rxjs';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatMap, switchMap, withLatestFrom } from 'rxjs/operators';
import {
  AnalyticsEventCategories,
  AnalyticsScreenNames, GoogleAnalyticsEvents, GoogleAnalyticsEventsTitles, GoogleAnalyticsEventsValues,
} from '@providers/analytics/analytics.model';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { getTests } from '@store/tests/tests.reducer';
import { TestsModel } from '@store/tests/tests.model';
import { analyticsEventTypePrefix, formatAnalyticsText } from '@shared/helpers/format-analytics-text';
import {
  SafetyQuestionOutcomeChanged,
  SafetyQuestionSelected,
  BalanceQuestionOutcomeChanged,
  BalanceQuestionSelected,
} from '@store/tests/test-data/cat-a-mod2/safety-and-balance/safety-and-balance.cat-a-mod2.actions';
import {
  VehicleChecksViewDidEnter,
} from './vehicle-checks-modal.cat-a-mod2.actions';

@Injectable()
export class VehicleChecksModalCatAMod2AnalyticsEffects {

  constructor(
    private analytics: AnalyticsProvider,
    private actions$: Actions,
    private store$: Store<StoreModel>,
  ) {
  }

  vehicleChecksModalViewDidEnter$ = createEffect(() => this.actions$.pipe(
    ofType(VehicleChecksViewDidEnter),
    concatMap((action) => of(action).pipe(
      withLatestFrom(
        this.store$.pipe(
          select(getTests),
        ),
      ),
    )),
    switchMap(([, tests]: [ReturnType<typeof VehicleChecksViewDidEnter>, TestsModel]) => {
      // TODO - MES-9495 - remove old analytics
      this.analytics.setCurrentPage(
        formatAnalyticsText(AnalyticsScreenNames.VEHICLE_CHECKS, tests),
      );
      // GA4 Analytics
      this.analytics.setGACurrentPage(
        analyticsEventTypePrefix(AnalyticsScreenNames.VEHICLE_CHECKS, tests),
      );
      return of(AnalyticRecorded());
    }),
  ));

  safetyQuestionChanged$ = createEffect(() => this.actions$.pipe(
    ofType(SafetyQuestionSelected),
    concatMap((action) => of(action).pipe(
      withLatestFrom(
        this.store$.pipe(
          select(getTests),
        ),
      ),
    )),
    switchMap(([action, tests]: [ReturnType<typeof SafetyQuestionSelected>, TestsModel]) => {
      // TODO - MES-9495 - remove old analytics
      const eventText = `safety question ${action.index + 1} changed`;
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.VEHICLE_CHECKS, tests),
        eventText,
        action.safetyQuestion.code,
      );
      // GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.SAFETY_QUESTION + (action.index + 1), tests),
        GoogleAnalyticsEventsTitles.QUESTION_NUMBER,
        action.safetyQuestion.code,
      );
      return of(AnalyticRecorded());
    }),
  ));

  safetyQuestionOutcomeChanged$ = createEffect(() => this.actions$.pipe(
    ofType(SafetyQuestionOutcomeChanged),
    concatMap((action) => of(action).pipe(
      withLatestFrom(
        this.store$.pipe(
          select(getTests),
        ),
      ),
    )),
    switchMap(([action, tests]: [ReturnType<typeof SafetyQuestionOutcomeChanged>, TestsModel]) => {
      // TODO - MES-9495 - remove old analytics
      const eventText = `safety question ${action.index + 1} outcome changed`;
      const outComeText = action.safetyQuestionOutcome === 'P' ? 'correct' : 'driving fault';
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.VEHICLE_CHECKS, tests),
        eventText,
        outComeText,
      );
      // GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.SAFETY_QUESTION + (action.index + 1), tests),
        GoogleAnalyticsEventsTitles.RESULT,
        action.safetyQuestionOutcome === 'P' ?
          GoogleAnalyticsEventsValues.CORRECT : GoogleAnalyticsEventsValues.DRIVING_FAULT,
      );
      return of(AnalyticRecorded());
    }),
  ));

  balanceQuestionChanged$ = createEffect(() => this.actions$.pipe(
    ofType(BalanceQuestionSelected),
    concatMap((action) => of(action).pipe(
      withLatestFrom(
        this.store$.pipe(
          select(getTests),
        ),
      ),
    )),
    switchMap(([action, tests]: [ReturnType<typeof BalanceQuestionSelected>, TestsModel]) => {
      // TODO - MES-9495 - remove old analytics
      const eventText = `balance question ${action.index + 1} changed`;
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.VEHICLE_CHECKS, tests),
        eventText,
        action.balanceQuestion.code,
      );
      // GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.BALANCE_QUESTION + (action.index + 1), tests),
        GoogleAnalyticsEventsTitles.QUESTION_NUMBER,
        action.balanceQuestion.code,
      );
      return of(AnalyticRecorded());
    }),
  ));

  balanceQuestionOutcomeChanged$ = createEffect(() => this.actions$.pipe(
    ofType(BalanceQuestionOutcomeChanged),
    concatMap((action) => of(action).pipe(
      withLatestFrom(
        this.store$.pipe(
          select(getTests),
        ),
      ),
    )),
    switchMap(([action, tests]: [ReturnType<typeof BalanceQuestionOutcomeChanged>, TestsModel]) => {
      // TODO - MES-9495 - remove old analytics
      const eventText = `balance question ${action.index + 1} outcome changed`;
      const outComeText = action.balanceQuestionOutcome === 'P' ? 'correct' : 'driving fault';
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.VEHICLE_CHECKS, tests),
        eventText,
        outComeText,
      );
      // GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.BALANCE_QUESTION + (action.index + 1), tests),
        GoogleAnalyticsEventsTitles.RESULT,
        action.balanceQuestionOutcome === 'P' ?
          GoogleAnalyticsEventsValues.CORRECT : GoogleAnalyticsEventsValues.DRIVING_FAULT,
      );
      return of(AnalyticRecorded());
    }),
  ));
}
