import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select } from '@ngrx/store';
import {
  TestIsTooShortContinue,
  TestIsTooShortReturn,
  TestStartEndTimeConfirmBoxChanged,
  TestStartEndTimeEditButtonPressed,
} from '@pages/pass-finalisation/cat-adi-part3/components/test-start-end-times/test-start-end-times.actions';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import {
  GoogleAnalyticsEvents,
  GoogleAnalyticsEventsTitles,
  GoogleAnalyticsEventsValues,
} from '@providers/analytics/analytics.model';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { TestsModel } from '@store/tests/tests.model';
import { getTests } from '@store/tests/tests.reducer';
import { isPracticeMode } from '@store/tests/tests.selector';
import { of } from 'rxjs';
import { concatMap, filter, switchMap, withLatestFrom } from 'rxjs/operators';

@Injectable()
export class TestStartEndTimesAnalyticsEffects {
  constructor(
    private analytics: AnalyticsProvider,
    private actions$: Actions,
    private store$: Actions,
    private appConfigProvider: AppConfigProvider // Assuming this is the correct provider for app config
  ) {}

  testStartEndTimeEditButtonPressed$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TestStartEndTimeEditButtonPressed),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store$.pipe(select(getTests)), this.store$.pipe(select(getTests), select(isPracticeMode)))
        )
      ),
      filter(([, , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      switchMap(([, tests]: [ReturnType<typeof TestStartEndTimeEditButtonPressed>, TestsModel, boolean]) => {
        // GA4 Analytics
        this.analytics.logGAEvent(
          GoogleAnalyticsEvents.TIME_ON_ROAD,
          GoogleAnalyticsEventsTitles.BUTTON_SELECTION,
          GoogleAnalyticsEventsValues.EDIT
        );
        return of(AnalyticRecorded());
      })
    )
  );

  testIsTooShortContinue$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TestIsTooShortContinue),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store$.pipe(select(getTests)), this.store$.pipe(select(getTests), select(isPracticeMode)))
        )
      ),
      filter(([, , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      switchMap(([, tests]: [ReturnType<typeof TestIsTooShortContinue>, TestsModel, boolean]) => {
        // GA4 Analytics
        this.analytics.logGAEvent(
          GoogleAnalyticsEvents.TIME_ON_ROAD,
          GoogleAnalyticsEventsTitles.FORTY_FIVE_MINS_TIME_WARNING,
          GoogleAnalyticsEventsValues.CONTINUE
        );
        return of(AnalyticRecorded());
      })
    )
  );

  testIsTooShortReturn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TestIsTooShortReturn),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store$.pipe(select(getTests)), this.store$.pipe(select(getTests), select(isPracticeMode)))
        )
      ),
      filter(([, , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      switchMap(([, tests]: [ReturnType<typeof TestIsTooShortReturn>, TestsModel, boolean]) => {
        // GA4 Analytics
        this.analytics.logGAEvent(
          GoogleAnalyticsEvents.TIME_ON_ROAD,
          GoogleAnalyticsEventsTitles.FORTY_FIVE_MINS_TIME_WARNING,
          GoogleAnalyticsEventsValues.RETURN_TO_PREVIOUS
        );
        return of(AnalyticRecorded());
      })
    )
  );

  testStartEndTimeConfirmBoxChanged$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TestStartEndTimeConfirmBoxChanged),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store$.pipe(select(getTests)), this.store$.pipe(select(getTests), select(isPracticeMode)))
        )
      ),
      filter(([, , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      switchMap(
        ([{ selected }, tests]: [ReturnType<typeof TestStartEndTimeConfirmBoxChanged>, TestsModel, boolean]) => {
          // GA4 Analytics
          this.analytics.logGAEvent(
            GoogleAnalyticsEvents.TIME_ON_ROAD,
            GoogleAnalyticsEventsTitles.CONFIRM_DURATION,
            selected ? GoogleAnalyticsEventsValues.SELECTED : GoogleAnalyticsEventsValues.UNSELECTED
          );
          return of(AnalyticRecorded());
        }
      )
    )
  );
}
