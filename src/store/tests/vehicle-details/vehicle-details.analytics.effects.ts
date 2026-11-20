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
import { getSchoolBike } from '@store/tests/vehicle-details/cat-a-mod2/vehicle-details.cat-a-mod2.selector';
import { getDualControls, getSchoolCar } from '@store/tests/vehicle-details/cat-b/vehicle-details.cat-b.selector';
import {
  DualControlsToggled,
  SchoolBikeToggled,
  SchoolCarToggled,
} from '@store/tests/vehicle-details/vehicle-details.actions';
import { getVehicleDetails } from '@store/tests/vehicle-details/vehicle-details.reducer';
import { of } from 'rxjs';
import { concatMap, filter, map, withLatestFrom } from 'rxjs/operators';

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
      map(([, tests]) =>
        this.recordVehicleDetail(
          tests,
          getSchoolCar(getVehicleDetails(getCurrentTest(tests))),
          GoogleAnalyticsEventsValues.SCHOOL_CAR
        )
      )
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
      map(([, tests]) =>
        this.recordVehicleDetail(
          tests,
          getDualControls(getVehicleDetails(getCurrentTest(tests))),
          GoogleAnalyticsEventsValues.DUAL_CONTROLS
        )
      )
    )
  );

  schoolBikeToggled$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SchoolBikeToggled),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store$.pipe(select(getTests)), this.store$.pipe(select(getTests), select(isPracticeMode)))
        )
      ),
      filter(([, , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      map(([, tests]) =>
        this.recordVehicleDetail(
          tests,
          getSchoolBike(getVehicleDetails(getCurrentTest(tests))),
          GoogleAnalyticsEventsValues.SCHOOL_BIKE
        )
      )
    )
  );

  private recordVehicleDetail(tests: TestsModel, selected: boolean, value: GoogleAnalyticsEventsValues) {
    this.analytics.logGAEvent(
      analyticsEventTypePrefix(GoogleAnalyticsEvents.VEHICLE_DETAILS, tests),
      selected ? GoogleAnalyticsEventsTitles.SELECTION : GoogleAnalyticsEventsTitles.UNSELECTED,
      value
    );
    return AnalyticRecorded();
  }
}
