import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select } from '@ngrx/store';
import {
  EndHourAmended,
  EndHourArrowsToggled,
  EndMinuteAmended,
  EndMinuteArrowsToggled,
  StartHourAmended,
  StartHourArrowsToggled,
  StartMinuteAmended,
  StartMinuteArrowsToggled,
} from '@pages/pass-finalisation/cat-adi-part3/components/change-start-end-time-modal/change-start-end-time-modal.actions';
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
export class ChangeStartEndTimeModalAnalyticsEffects {
  constructor(
    private analytics: AnalyticsProvider,
    private actions$: Actions,
    private store$: Actions,
    private appConfigProvider: AppConfigProvider // Assuming this is the correct provider for app config
  ) {}

  startHourAmended$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StartHourAmended),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store$.pipe(select(getTests)), this.store$.pipe(select(getTests), select(isPracticeMode)))
        )
      ),
      filter(([, , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      switchMap(([, tests]: [ReturnType<typeof StartHourAmended>, TestsModel, boolean]) => {
        // GA4 Analytics
        this.analytics.logGAEvent(
          GoogleAnalyticsEvents.UPDATED_START_TIME,
          GoogleAnalyticsEventsTitles.INTEGER_KEYED_HOUR,
          GoogleAnalyticsEventsValues.VALUE_ENTERED
        );
        return of(AnalyticRecorded());
      })
    )
  );
  startMinuteAmended$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StartMinuteAmended),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store$.pipe(select(getTests)), this.store$.pipe(select(getTests), select(isPracticeMode)))
        )
      ),
      filter(([, , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      switchMap(([, tests]: [ReturnType<typeof StartMinuteAmended>, TestsModel, boolean]) => {
        // GA4 Analytics
        this.analytics.logGAEvent(
          GoogleAnalyticsEvents.UPDATED_START_TIME,
          GoogleAnalyticsEventsTitles.INTEGER_KEYED_MINUTE,
          GoogleAnalyticsEventsValues.VALUE_ENTERED
        );
        return of(AnalyticRecorded());
      })
    )
  );
  startHourArrows$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StartHourArrowsToggled),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store$.pipe(select(getTests)), this.store$.pipe(select(getTests), select(isPracticeMode)))
        )
      ),
      filter(([, , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      switchMap(([, tests]: [ReturnType<typeof StartHourArrowsToggled>, TestsModel, boolean]) => {
        // GA4 Analytics
        this.analytics.logGAEvent(
          GoogleAnalyticsEvents.UPDATED_START_TIME,
          GoogleAnalyticsEventsTitles.INTEGER_ARROWS_HOUR,
          GoogleAnalyticsEventsValues.COMPLETED
        );
        return of(AnalyticRecorded());
      })
    )
  );
  startMinuteArrows$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StartMinuteArrowsToggled),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store$.pipe(select(getTests)), this.store$.pipe(select(getTests), select(isPracticeMode)))
        )
      ),
      filter(([, , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      switchMap(([, tests]: [ReturnType<typeof StartMinuteArrowsToggled>, TestsModel, boolean]) => {
        // GA4 Analytics
        this.analytics.logGAEvent(
          GoogleAnalyticsEvents.UPDATED_START_TIME,
          GoogleAnalyticsEventsTitles.INTEGER_ARROWS_MINUTE,
          GoogleAnalyticsEventsValues.COMPLETED
        );
        return of(AnalyticRecorded());
      })
    )
  );

  endHourAmended$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EndHourAmended),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store$.pipe(select(getTests)), this.store$.pipe(select(getTests), select(isPracticeMode)))
        )
      ),
      filter(([, , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      switchMap(([, tests]: [ReturnType<typeof EndHourAmended>, TestsModel, boolean]) => {
        // GA4 Analytics
        this.analytics.logGAEvent(
          GoogleAnalyticsEvents.UPDATED_END_TIME,
          GoogleAnalyticsEventsTitles.INTEGER_KEYED_HOUR,
          GoogleAnalyticsEventsValues.VALUE_ENTERED
        );
        return of(AnalyticRecorded());
      })
    )
  );
  endMinuteAmended$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EndMinuteAmended),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store$.pipe(select(getTests)), this.store$.pipe(select(getTests), select(isPracticeMode)))
        )
      ),
      filter(([, , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      switchMap(([, tests]: [ReturnType<typeof EndMinuteAmended>, TestsModel, boolean]) => {
        // GA4 Analytics
        this.analytics.logGAEvent(
          GoogleAnalyticsEvents.UPDATED_END_TIME,
          GoogleAnalyticsEventsTitles.INTEGER_KEYED_MINUTE,
          GoogleAnalyticsEventsValues.VALUE_ENTERED
        );
        return of(AnalyticRecorded());
      })
    )
  );
  endHourArrows$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EndHourArrowsToggled),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store$.pipe(select(getTests)), this.store$.pipe(select(getTests), select(isPracticeMode)))
        )
      ),
      filter(([, , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      switchMap(([, tests]: [ReturnType<typeof EndHourArrowsToggled>, TestsModel, boolean]) => {
        // GA4 Analytics
        this.analytics.logGAEvent(
          GoogleAnalyticsEvents.UPDATED_END_TIME,
          GoogleAnalyticsEventsTitles.INTEGER_ARROWS_HOUR,
          GoogleAnalyticsEventsValues.COMPLETED
        );
        return of(AnalyticRecorded());
      })
    )
  );
  endMinuteArrows$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EndMinuteArrowsToggled),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store$.pipe(select(getTests)), this.store$.pipe(select(getTests), select(isPracticeMode)))
        )
      ),
      filter(([, , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      switchMap(([, tests]: [ReturnType<typeof EndMinuteArrowsToggled>, TestsModel, boolean]) => {
        // GA4 Analytics
        this.analytics.logGAEvent(
          GoogleAnalyticsEvents.UPDATED_END_TIME,
          GoogleAnalyticsEventsTitles.INTEGER_ARROWS_MINUTE,
          GoogleAnalyticsEventsValues.COMPLETED
        );
        return of(AnalyticRecorded());
      })
    )
  );
}
