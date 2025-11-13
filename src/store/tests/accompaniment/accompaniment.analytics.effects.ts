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
  InstructorAccompanimentToggled,
  InterpreterAccompanimentToggled,
  OtherAccompanimentToggled,
  SupervisorAccompanimentToggled,
} from '@store/tests/accompaniment/accompaniment.actions';
import { getAccompaniment } from '@store/tests/accompaniment/accompaniment.reducer';
import {
  getInstructorAccompaniment,
  getInterpreterAccompaniment,
  getOtherAccompaniment,
  getSupervisorAccompaniment,
} from '@store/tests/accompaniment/accompaniment.selector';
import { TestsModel } from '@store/tests/tests.model';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest, isPracticeMode } from '@store/tests/tests.selector';
import { of } from 'rxjs';
import { concatMap, filter, switchMap, take, withLatestFrom } from 'rxjs/operators';

@Injectable()
export class AccompanimentAnalyticsEffects {
  constructor(
    private analytics: AnalyticsProvider,
    private actions$: Actions,
    private store$: Store<StoreModel>,
    private appConfigProvider: AppConfigProvider
  ) {}

  instructorAccompanimentToggled$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InstructorAccompanimentToggled),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store$.pipe(select(getTests)), this.store$.pipe(select(getTests), select(isPracticeMode)))
        )
      ),
      filter(([, , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      switchMap(([, tests]: [ReturnType<typeof InstructorAccompanimentToggled>, TestsModel, boolean]) => {
        this.store$
          .pipe(
            select(getTests),
            select(getCurrentTest),
            select(getAccompaniment),
            select(getInstructorAccompaniment),
            take(1)
          )
          .subscribe((value) => {
            //GA4 Analytics
            this.analytics.logGAEvent(
              analyticsEventTypePrefix(GoogleAnalyticsEvents.ACCOMPANIED_BY, tests),
              value ? GoogleAnalyticsEventsTitles.SELECTION : GoogleAnalyticsEventsTitles.UNSELECTED,
              GoogleAnalyticsEventsValues.INSTRUCTOR
            );
          })
          .unsubscribe();
        return of(AnalyticRecorded());
      })
    )
  );

  supervisorAccompanimentToggled$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SupervisorAccompanimentToggled),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store$.pipe(select(getTests)), this.store$.pipe(select(getTests), select(isPracticeMode)))
        )
      ),
      filter(([, , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      switchMap(([, tests]: [ReturnType<typeof SupervisorAccompanimentToggled>, TestsModel, boolean]) => {
        this.store$
          .pipe(
            select(getTests),
            select(getCurrentTest),
            select(getAccompaniment),
            select(getSupervisorAccompaniment),
            take(1)
          )
          .subscribe((value) => {
            //GA4 Analytics
            this.analytics.logGAEvent(
              analyticsEventTypePrefix(GoogleAnalyticsEvents.ACCOMPANIED_BY, tests),
              value ? GoogleAnalyticsEventsTitles.SELECTION : GoogleAnalyticsEventsTitles.UNSELECTED,
              GoogleAnalyticsEventsValues.SUPERVISOR
            );
          })
          .unsubscribe();
        return of(AnalyticRecorded());
      })
    )
  );

  otherAccompanimentToggled$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OtherAccompanimentToggled),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store$.pipe(select(getTests)), this.store$.pipe(select(getTests), select(isPracticeMode)))
        )
      ),
      filter(([, , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      switchMap(([, tests]: [ReturnType<typeof OtherAccompanimentToggled>, TestsModel, boolean]) => {
        this.store$
          .pipe(
            select(getTests),
            select(getCurrentTest),
            select(getAccompaniment),
            select(getOtherAccompaniment),
            take(1)
          )
          .subscribe((value) => {
            //GA4 Analytics
            this.analytics.logGAEvent(
              analyticsEventTypePrefix(GoogleAnalyticsEvents.ACCOMPANIED_BY, tests),
              value ? GoogleAnalyticsEventsTitles.SELECTION : GoogleAnalyticsEventsTitles.UNSELECTED,
              GoogleAnalyticsEventsValues.OTHER
            );
          })
          .unsubscribe();
        return of(AnalyticRecorded());
      })
    )
  );

  interpreterAccompanimentConfirmed$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InterpreterAccompanimentToggled),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store$.pipe(select(getTests)), this.store$.pipe(select(getTests), select(isPracticeMode)))
        )
      ),
      filter(([, , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      switchMap(([, tests]: [ReturnType<typeof InterpreterAccompanimentToggled>, TestsModel, boolean]) => {
        this.store$
          .pipe(
            select(getTests),
            select(getCurrentTest),
            select(getAccompaniment),
            select(getInterpreterAccompaniment),
            take(1)
          )
          .subscribe((value) => {
            //GA4 Analytics
            this.analytics.logGAEvent(
              analyticsEventTypePrefix(GoogleAnalyticsEvents.ACCOMPANIED_BY, tests),
              value ? GoogleAnalyticsEventsTitles.SELECTION : GoogleAnalyticsEventsTitles.UNSELECTED,
              GoogleAnalyticsEventsValues.INTERPRETER
            );
          })
          .unsubscribe();
        return of(AnalyticRecorded());
      })
    )
  );
}
