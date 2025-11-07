import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import {
  GoogleAnalyticsEvents,
  GoogleAnalyticsEventsTitles,
  GoogleAnalyticsEventsValues,
} from '@providers/analytics/analytics.model';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { analyticsEventTypePrefix } from '@shared/helpers/format-analytics-text';
import { StoreModel } from '@shared/models/store.model';
import {
  InstructorAccompanimentConfirmed,
  InterpreterAccompanimentConfirmed,
  OtherAccompanimentConfirmed,
  SupervisorAccompanimentConfirmed,
} from '@store/tests/accompaniment/accompaniment.actions';
import { TestsModel } from '@store/tests/tests.model';
import { getTests } from '@store/tests/tests.reducer';
import { isPracticeMode } from '@store/tests/tests.selector';
import { of } from 'rxjs';
import { concatMap, filter, switchMap, withLatestFrom } from 'rxjs/operators';

@Injectable()
export class AccompanimentAnalyticsEffects {
  constructor(
    private analytics: AnalyticsProvider,
    private actions$: Actions,
    private store$: Store<StoreModel>,
    private appConfigProvider: AppConfigProvider
  ) {}

  instructorAccompanimentConfirmed$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InstructorAccompanimentConfirmed),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store$.pipe(select(getTests)), this.store$.pipe(select(getTests), select(isPracticeMode)))
        )
      ),
      filter(([, , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      switchMap(([, tests]: [ReturnType<typeof InstructorAccompanimentConfirmed>, TestsModel, boolean]) => {
        //GA4 Analytics
        this.analytics.logGAEvent(
          analyticsEventTypePrefix(GoogleAnalyticsEvents.ACCOMPANIED_BY, tests),
          GoogleAnalyticsEventsTitles.SELECTION,
          GoogleAnalyticsEventsValues.INSTRUCTOR
        );
        return of(AnalyticRecorded());
      })
    )
  );

  supervisorAccompanimentConfirmed$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SupervisorAccompanimentConfirmed),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store$.pipe(select(getTests)), this.store$.pipe(select(getTests), select(isPracticeMode)))
        )
      ),
      filter(([, , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      switchMap(([, tests]: [ReturnType<typeof SupervisorAccompanimentConfirmed>, TestsModel, boolean]) => {
        //GA4 Analytics
        this.analytics.logGAEvent(
          analyticsEventTypePrefix(GoogleAnalyticsEvents.ACCOMPANIED_BY, tests),
          GoogleAnalyticsEventsTitles.SELECTION,
          GoogleAnalyticsEventsValues.SUPERVISOR
        );
        return of(AnalyticRecorded());
      })
    )
  );

  otherAccompanimentConfirmed$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OtherAccompanimentConfirmed),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store$.pipe(select(getTests)), this.store$.pipe(select(getTests), select(isPracticeMode)))
        )
      ),
      filter(([, , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      switchMap(([, tests]: [ReturnType<typeof OtherAccompanimentConfirmed>, TestsModel, boolean]) => {
        //GA4 Analytics
        this.analytics.logGAEvent(
          analyticsEventTypePrefix(GoogleAnalyticsEvents.ACCOMPANIED_BY, tests),
          GoogleAnalyticsEventsTitles.SELECTION,
          GoogleAnalyticsEventsValues.OTHER
        );
        return of(AnalyticRecorded());
      })
    )
  );

  interpreterAccompanimentConfirmed$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InterpreterAccompanimentConfirmed),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store$.pipe(select(getTests)), this.store$.pipe(select(getTests), select(isPracticeMode)))
        )
      ),
      filter(([, , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      switchMap(([, tests]: [ReturnType<typeof InterpreterAccompanimentConfirmed>, TestsModel, boolean]) => {
        //GA4 Analytics
        this.analytics.logGAEvent(
          analyticsEventTypePrefix(GoogleAnalyticsEvents.ACCOMPANIED_BY, tests),
          GoogleAnalyticsEventsTitles.SELECTION,
          GoogleAnalyticsEventsValues.INTERPRETER
        );
        return of(AnalyticRecorded());
      })
    )
  );
}
