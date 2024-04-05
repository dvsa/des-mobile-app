import { of } from 'rxjs';
import {
  Actions, createEffect, ofType,
} from '@ngrx/effects';
import { concatMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import {
  AnalyticsEventCategories,
  AnalyticsScreenNames, GoogleAnalyticsEvents, GoogleAnalyticsEventsTitles, GoogleAnalyticsEventsValues,
} from '@providers/analytics/analytics.model';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { StoreModel } from '@shared/models/store.model';
import { getTests } from '@store/tests/tests.reducer';
import { TestsModel } from '@store/tests/tests.model';
import { analyticsEventTypePrefix, formatAnalyticsText } from '@shared/helpers/format-analytics-text';
import {
  ShowMeQuestionOutcomeChanged,
  ShowMeQuestionSelected,
  TellMeQuestionOutcomeChanged,
  TellMeQuestionSelected,
} from '@store/tests/test-data/cat-c/vehicle-checks/vehicle-checks.cat-c.action';
import {
  VehicleChecksViewDidEnter,
} from './vehicle-checks-modal.cat-c.actions';

@Injectable()
export class VehicleChecksModalCatCAnalyticsEffects {

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
      this.analytics.setCurrentPage(formatAnalyticsText(AnalyticsScreenNames.VEHICLE_CHECKS, tests));
      // GA4 Analytics
      this.analytics.setGACurrentPage(analyticsEventTypePrefix(AnalyticsScreenNames.VEHICLE_CHECKS, tests));
      return of(AnalyticRecorded());
    }),
  ));

  showMeQuestionChanged$ = createEffect(() => this.actions$.pipe(
    ofType(ShowMeQuestionSelected),
    concatMap((action) => of(action).pipe(
      withLatestFrom(
        this.store$.pipe(
          select(getTests),
        ),
      ),
    )),
    switchMap(([action, tests]: [ReturnType<typeof ShowMeQuestionSelected>, TestsModel]) => {
      // TODO - MES-9495 - remove old analytics
      const eventText = `show me question ${action.index + 1} changed`;
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.VEHICLE_CHECKS, tests),
        eventText,
        action.showMeQuestion.code,
      );
      // GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.SHOW_ME_QUESTION + (action.index + 1), tests),
        GoogleAnalyticsEventsTitles.QUESTION_NUMBER,
        action.showMeQuestion.code,
      );
      return of(AnalyticRecorded());
    }),
  ));

  showMeQuestionOutComeChanged$ = createEffect(() => this.actions$.pipe(
    ofType(ShowMeQuestionOutcomeChanged),
    concatMap((action) => of(action).pipe(
      withLatestFrom(
        this.store$.pipe(
          select(getTests),
        ),
      ),
    )),
    switchMap(([action, tests]: [ReturnType<typeof ShowMeQuestionOutcomeChanged>, TestsModel]) => {
      // TODO - MES-9495 - remove old analytics
      const eventText = `show me question ${action.index + 1} outcome changed`;
      const outComeText = action.showMeQuestionOutcome === 'P' ? 'correct' : 'driving fault';
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.VEHICLE_CHECKS, tests),
        eventText,
        outComeText,
      );

      // GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.SHOW_ME_QUESTION + (action.index + 1), tests),
        GoogleAnalyticsEventsTitles.RESULT,
        action.showMeQuestionOutcome === 'P' ?
          GoogleAnalyticsEventsValues.CORRECT : GoogleAnalyticsEventsValues.DRIVING_FAULT,
      );
      return of(AnalyticRecorded());
    }),
  ));

  tellMeQuestionChanged$ = createEffect(() => this.actions$.pipe(
    ofType(TellMeQuestionSelected),
    concatMap((action) => of(action).pipe(
      withLatestFrom(
        this.store$.pipe(
          select(getTests),
        ),
      ),
    )),
    switchMap(([action, tests]: [ReturnType<typeof TellMeQuestionSelected>, TestsModel]) => {
      // TODO - MES-9495 - remove old analytics
      const eventText = `tell me question ${action.index + 1} changed`;
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.VEHICLE_CHECKS, tests),
        eventText,
        action.tellMeQuestion.code,
      );
      // GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.TELL_ME_QUESTION + (action.index + 1), tests),
        GoogleAnalyticsEventsTitles.QUESTION_NUMBER,
        action.tellMeQuestion.code,
      );
      return of(AnalyticRecorded());
    }),
  ));

  tellMeQuestionOutComeChanged$ = createEffect(() => this.actions$.pipe(
    ofType(TellMeQuestionOutcomeChanged),
    concatMap((action) => of(action).pipe(
      withLatestFrom(
        this.store$.pipe(
          select(getTests),
        ),
      ),
    )),
    switchMap(([action, tests]: [ReturnType<typeof TellMeQuestionOutcomeChanged>, TestsModel]) => {
      // TODO - MES-9495 - remove old analytics
      const eventText = `tell me question ${action.index + 1} outcome changed`;
      const outComeText = action.tellMeQuestionOutcome === 'P' ? 'correct' : 'driving fault';
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.VEHICLE_CHECKS, tests),
        eventText,
        outComeText,
      );
      // GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.TELL_ME_QUESTION + (action.index + 1), tests),
        GoogleAnalyticsEventsTitles.RESULT,
        action.tellMeQuestionOutcome === 'P' ?
          GoogleAnalyticsEventsValues.CORRECT : GoogleAnalyticsEventsValues.DRIVING_FAULT,
      );
      return of(AnalyticRecorded());
    }),
  ));
}
