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
import { TestsModel } from '@store/tests/tests.model';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest, isPracticeMode } from '@store/tests/tests.selector';
import { getDualControls, getSchoolCar } from '@store/tests/vehicle-details/cat-b/vehicle-details.cat-b.selector';
import { DualControlsToggled, SchoolCarToggled } from '@store/tests/vehicle-details/vehicle-details.actions';
import { getVehicleDetails } from '@store/tests/vehicle-details/vehicle-details.reducer';
import { of } from 'rxjs';
import { concatMap, filter, switchMap, take, withLatestFrom } from 'rxjs/operators';

@Injectable()
export class VehicleDetailsAnalyticsEffects {
  constructor(
    private analytics: AnalyticsProvider,
    private actions$: Actions,
    private store$: Store<StoreModel>,
    private appConfigProvider: AppConfigProvider
  ) {}

  schoolCarConfirmed$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SchoolCarToggled),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store$.pipe(select(getTests)), this.store$.pipe(select(getTests), select(isPracticeMode)))
        )
      ),
      filter(([, , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      switchMap(([, tests]: [ReturnType<typeof SchoolCarToggled>, TestsModel, boolean]) => {
        this.store$
          .pipe(select(getTests), select(getCurrentTest), select(getVehicleDetails), select(getSchoolCar), take(1))
          .subscribe((value) => {
            //GA4 Analytics
            this.analytics.logGAEvent(
              analyticsEventTypePrefix(GoogleAnalyticsEvents.VEHICLE_DETAILS, tests),
              value ? GoogleAnalyticsEventsTitles.SELECTION : GoogleAnalyticsEventsTitles.UNSELECTED,
              GoogleAnalyticsEventsValues.SCHOOL_CAR
            );
          })
          .unsubscribe();
        return of(AnalyticRecorded());
      })
    )
  );

  dualControlsToggled$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DualControlsToggled),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store$.pipe(select(getTests)), this.store$.pipe(select(getTests), select(isPracticeMode)))
        )
      ),
      filter(([, , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      switchMap(([, tests]: [ReturnType<typeof DualControlsToggled>, TestsModel, boolean]) => {
        this.store$
          .pipe(select(getTests), select(getCurrentTest), select(getVehicleDetails), select(getDualControls), take(1))
          .subscribe((value) => {
            //GA4 Analytics
            this.analytics.logGAEvent(
              analyticsEventTypePrefix(GoogleAnalyticsEvents.VEHICLE_DETAILS, tests),
              value ? GoogleAnalyticsEventsTitles.SELECTION : GoogleAnalyticsEventsTitles.UNSELECTED,
              GoogleAnalyticsEventsValues.DUAL_CONTROLS
            );
          })
          .unsubscribe();
        return of(AnalyticRecorded());
      })
    )
  );
}
