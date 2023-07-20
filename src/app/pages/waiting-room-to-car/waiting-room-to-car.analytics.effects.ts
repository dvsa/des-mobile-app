import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { of } from 'rxjs';
import {
  concatMap, filter, switchMap, withLatestFrom,
} from 'rxjs/operators';
import { CategoryCode } from '@dvsa/mes-test-schema/categories/common';

import { AnalyticsProvider } from '@providers/analytics/analytics';
import {
  AnalyticsDimensionIndices,
  AnalyticsErrorTypes,
  AnalyticsEventCategories,
  AnalyticsEvents,
  AnalyticsScreenNames,
} from '@providers/analytics/analytics.model';
import {
  GetMotStatus,
  GetMotStatusFailure,
  MotInvalidModalOpened,
  MotVRNAmendedPopup,
  MotVRNConfirmed,
  VRNBlurred,
  WaitingRoomToCarBikeCategoryChanged,
  WaitingRoomToCarBikeCategorySelected,
  WaitingRoomToCarError,
  WaitingRoomToCarValidationError,
  WaitingRoomToCarViewBikeCategoryModal,
  WaitingRoomToCarViewDidEnter,
} from '@pages/waiting-room-to-car/waiting-room-to-car.actions';
import { StoreModel } from '@shared/models/store.model';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest, getJournalData, isPracticeMode } from '@store/tests/tests.selector';
import { getCandidate } from '@store/tests/journal-data/common/candidate/candidate.reducer';
import { getCandidateId } from '@store/tests/journal-data/common/candidate/candidate.selector';
import { AnalyticNotRecorded, AnalyticRecorded } from '@providers/analytics/analytics.actions';
import { TestsModel } from '@store/tests/tests.model';
import {
  getApplicationReference,
} from '@store/tests/journal-data/common/application-reference/application-reference.reducer';
import {
  getApplicationNumber,
} from '@store/tests/journal-data/common/application-reference/application-reference.selector';
import { getTestCategory } from '@store/tests/category/category.reducer';
import { formatAnalyticsText } from '@shared/helpers/format-analytics-text';
import * as vehicleDetailsActions from '@store/tests/vehicle-details/vehicle-details.actions';
import {
  AlternativeMotEvidenceDetailsChanged,
  AlternativeMotEvidenceProvidedChanged,
  DualControlsToggledNo,
  DualControlsToggledYes,
  MotStatusChanged,
} from '@store/tests/vehicle-details/vehicle-details.actions';
import { getVehicleDetails } from '@store/tests/vehicle-details/cat-adi-part3/vehicle-details.cat-adi-part3.reducer';
import { getDualControls } from '@store/tests/vehicle-details/cat-adi-part3/vehicle-details.cat-adi-part3.selector';
import {
  PDILogbook,
  TraineeLicence,
} from '@store/tests/trainer-details/cat-adi-part3/trainer-details.cat-adi-part3.actions';
import { getTrainerDetails } from '@store/tests/trainer-details/cat-adi-part3/trainer-details.cat-adi-part3.reducer';
import {
  getPDILogbook,
  getTraineeLicence,
} from '@store/tests/trainer-details/cat-adi-part3/trainer-details.cat-adi-part3.selector';
import {
  OrditTrainedChanged,
  TrainerRegistrationNumberChanged,
} from '@store/tests/trainer-details/cat-adi-part2/trainer-details.cat-adi-part2.actions';
import {
  getOrditTrained,
  getTrainerRegistrationNumber,
} from '@store/tests/trainer-details/cat-adi-part2/trainer-details.cat-adi-part2.selector';
import {
  getAlternativeMotEvidenceDetails,
  getAlternativeMotEvidenceProvided,
  getMotStatus,
} from '@store/tests/vehicle-details/vehicle-details.selector';
import { Router } from '@angular/router';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { ERROR_MSGS } from '@providers/mot-details/mot-details';

@Injectable()
export class WaitingRoomToCarAnalyticsEffects {

  private classPrefix: string = '/WaitingRoomToCar';

  constructor(
    public analytics: AnalyticsProvider,
    private actions$: Actions,
    private store$: Store<StoreModel>,
    private router: Router,
    private appConfigProvider: AppConfigProvider,
  ) {
  }

  waitingRoomToCarViewDidEnter$ = createEffect(() => this.actions$.pipe(
    ofType(WaitingRoomToCarViewDidEnter),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(getCurrentTest),
            select(getJournalData),
            select(getApplicationReference),
            select(getApplicationNumber),
          ),
          this.store$.pipe(
            select(getTests),
            select(getCurrentTest),
            select(getJournalData),
            select(getCandidate),
            select(getCandidateId),
          ),
          this.store$.pipe(
            select(getTests),
            select(getCurrentTest),
            select(getTestCategory),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , , , , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    switchMap((
      [, tests, applicationReference, candidateId, category]:
      [ReturnType<typeof WaitingRoomToCarViewDidEnter>, TestsModel, string, number, CategoryCode, boolean],
    ) => {
      this.analytics.addCustomDimension(AnalyticsDimensionIndices.CANDIDATE_ID, `${candidateId}`);
      this.analytics.addCustomDimension(AnalyticsDimensionIndices.APPLICATION_REFERENCE, applicationReference);
      this.analytics.addCustomDimension(AnalyticsDimensionIndices.TEST_CATEGORY, category);
      this.analytics.setCurrentPage(
        formatAnalyticsText(AnalyticsScreenNames.WAITING_ROOM_TO_CAR, tests),
      );
      return of(AnalyticRecorded());
    }),
  ));

  waitingRoomToCarError$ = createEffect(() => this.actions$.pipe(
    ofType(WaitingRoomToCarError),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(getCurrentTest),
            select(getTestCategory),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    switchMap((
      [action, tests, category]: [ReturnType<typeof WaitingRoomToCarError>, TestsModel, CategoryCode, boolean],
    ) => {
      const screenName = formatAnalyticsText(AnalyticsScreenNames.WAITING_ROOM_TO_CAR, tests);
      this.analytics.addCustomDimension(AnalyticsDimensionIndices.TEST_CATEGORY, category);
      this.analytics.logError(
        `${AnalyticsErrorTypes.SUBMIT_FORM_ERROR} (${screenName})`,
        action.errorMessage,
      );
      return of(AnalyticRecorded());
    }),
  ));

  waitingRoomToCarValidationError$ = createEffect(() => this.actions$.pipe(
    ofType(WaitingRoomToCarValidationError),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(getCurrentTest),
            select(getTestCategory),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    switchMap((
      [action, tests, category]:
      [ReturnType<typeof WaitingRoomToCarValidationError>, TestsModel, CategoryCode, boolean],
    ) => {
      const screenName = formatAnalyticsText(AnalyticsScreenNames.WAITING_ROOM_TO_CAR, tests);
      this.analytics.addCustomDimension(AnalyticsDimensionIndices.TEST_CATEGORY, category);
      this.analytics.logError(
        `${AnalyticsErrorTypes.VALIDATION_ERROR} (${screenName})`,
        action.errorMessage,
      );
      return of(AnalyticRecorded());
    }),
  ));

  waitingRoomToCarBikeCategoryChanged$ = createEffect(() => this.actions$.pipe(
    ofType(WaitingRoomToCarBikeCategoryChanged),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    switchMap((
      [action, tests]:
      [ReturnType<typeof WaitingRoomToCarBikeCategoryChanged>, TestsModel, boolean],
    ) => {
      this.analytics.addCustomDimension(AnalyticsDimensionIndices.TEST_CATEGORY, action.selectedBikeCategory);
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.WAITING_ROOM_TO_CAR, tests),
        formatAnalyticsText(AnalyticsEvents.BIKE_CATEGORY_CHANGED, tests),
        `bike category changed to ${action.initialBikeCategory} from ${action.selectedBikeCategory}`,
      );
      return of(AnalyticRecorded());
    }),
  ));

  waitingRoomToCarBikeCategorySelected$ = createEffect(() => this.actions$.pipe(
    ofType(WaitingRoomToCarBikeCategorySelected),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    switchMap((
      [action, tests]:
      [ReturnType<typeof WaitingRoomToCarBikeCategorySelected>, TestsModel, boolean],
    ) => {
      this.analytics.addCustomDimension(AnalyticsDimensionIndices.TEST_CATEGORY, action.bikeCategory);
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.WAITING_ROOM_TO_CAR, tests),
        formatAnalyticsText(AnalyticsEvents.BIKE_CATEGORY_SELECTED, tests),
        `bike category ${action.bikeCategory} selected`,
      );
      return of(AnalyticRecorded());
    }),
  ));

  waitingRoomToCarViewBikeCategoryModal$ = createEffect(() => this.actions$.pipe(
    ofType(WaitingRoomToCarViewBikeCategoryModal),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    switchMap((
      [, tests]:
      [ReturnType<typeof WaitingRoomToCarViewBikeCategoryModal>, TestsModel, boolean],
    ) => {
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.WAITING_ROOM_TO_CAR, tests),
        formatAnalyticsText(AnalyticsEvents.BIKE_CATEGORY_MODAL_TRIGGERED, tests),
        'bike category selection modal triggered',
      );
      return of(AnalyticRecorded());
    }),
  ));

  waitingRoomToCarDualControlsChanged$ = createEffect(() => this.actions$.pipe(
    ofType(
      DualControlsToggledYes,
      DualControlsToggledNo,
    ),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(getCurrentTest),
            select(getVehicleDetails),
            select(getDualControls),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    switchMap((
      [, tests, dualControls]:
      [ReturnType<typeof DualControlsToggledYes | typeof DualControlsToggledNo>, TestsModel, boolean, boolean],
    ) => {
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.WAITING_ROOM_TO_CAR, tests),
        formatAnalyticsText(AnalyticsEvents.DUAL_CONTROLS_CHANGED, tests),
        `dual controls changed to ${dualControls ? 'Yes' : 'No'}`,
      );
      return of(AnalyticRecorded());
    }),
  ));

  waitingRoomToCarTransmissionChanged$ = createEffect(() => this.actions$.pipe(
    ofType(vehicleDetailsActions.GearboxCategoryChanged),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    concatMap((
      [{ gearboxCategory }, tests]:
      [ReturnType<typeof vehicleDetailsActions.GearboxCategoryChanged>, TestsModel, boolean],
    ) => {
      // Check current URL begins with WRTC prefix before recording analytic to stop duplicated events.
      if (this.router.url?.startsWith(this.classPrefix)) {
        this.analytics.logEvent(
          formatAnalyticsText(AnalyticsEventCategories.WAITING_ROOM_TO_CAR, tests),
          formatAnalyticsText(AnalyticsEvents.GEARBOX_CATEGORY_CHANGED, tests),
          gearboxCategory,
        );
        return of(AnalyticRecorded());
      }
      return of(AnalyticNotRecorded());
    }),
  ));

  waitingRoomToCarPDILogbookChanged$ = createEffect(() => this.actions$.pipe(
    ofType(PDILogbook),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(getCurrentTest),
            select(getTrainerDetails),
            select(getPDILogbook),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    switchMap((
      [, tests, pdiLogBook]:
      [ReturnType<typeof PDILogbook>, TestsModel, boolean, boolean],
    ) => {
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.WAITING_ROOM_TO_CAR, tests),
        formatAnalyticsText(AnalyticsEvents.PDI_LOGBOOK_CHANGED, tests),
        `pdi logbook changed to ${pdiLogBook ? 'Yes' : 'No'}`,
      );
      return of(AnalyticRecorded());
    }),
  ));

  waitingRoomToCarTraineeLicenceChanged$ = createEffect(() => this.actions$.pipe(
    ofType(TraineeLicence),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(getCurrentTest),
            select(getTrainerDetails),
            select(getTraineeLicence),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    switchMap((
      [, tests, traineeLicence]:
      [ReturnType<typeof TraineeLicence>, TestsModel, boolean, boolean],
    ) => {
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.WAITING_ROOM_TO_CAR, tests),
        formatAnalyticsText(AnalyticsEvents.TRAINEE_LICENCE_CHANGED, tests),
        `trainee licence changed to ${traineeLicence ? 'Yes' : 'No'}`,
      );
      return of(AnalyticRecorded());
    }),
  ));

  waitingRoomToCarOrditTrainedChanged$ = createEffect(() => this.actions$.pipe(
    ofType(OrditTrainedChanged),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(getCurrentTest),
            select(getTrainerDetails),
            select(getOrditTrained),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    switchMap((
      [, tests, orditTrained]:
      [ReturnType<typeof OrditTrainedChanged>, TestsModel, boolean, boolean],
    ) => {
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.WAITING_ROOM_TO_CAR, tests),
        formatAnalyticsText(AnalyticsEvents.ORDIT_TRAINED_CHANGED, tests),
        `ordit trained changed to ${orditTrained ? 'Yes' : 'No'}`,
      );
      return of(AnalyticRecorded());
    }),
  ));

  waitingRoomToCarTrainerRegistrationNumberChanged$ = createEffect(() => this.actions$.pipe(
    ofType(TrainerRegistrationNumberChanged),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(getCurrentTest),
            select(getTrainerDetails),
            select(getTrainerRegistrationNumber),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    switchMap((
      [, tests, trainerRegistrationNumber]:
      [ReturnType<typeof TrainerRegistrationNumberChanged>, TestsModel, number, boolean],
    ) => {
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.WAITING_ROOM_TO_CAR, tests),
        formatAnalyticsText(AnalyticsEvents.TRAINER_REG_NUMBER_CHANGED, tests),
        `trainer registration number changed to ${trainerRegistrationNumber}`,
      );
      return of(AnalyticRecorded());
    }),
  ));

  motButtonPressed$ = createEffect(() => this.actions$.pipe(
    ofType(GetMotStatus),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    switchMap((
      [, tests]:
      [ReturnType<typeof GetMotStatus>, TestsModel, boolean],
    ) => {
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.WAITING_ROOM_TO_CAR, tests),
        formatAnalyticsText(AnalyticsEvents.CHECK_MOT_STATUS, tests),
        'MOT Button pressed',
      );
      return of(AnalyticRecorded());
    }),
  ));

  motStatusChanged$ = createEffect(() => this.actions$.pipe(
    ofType(MotStatusChanged),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(getCurrentTest),
            select(getVehicleDetails),
            select(getMotStatus),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    switchMap((
      [, tests, motStatus]:
      [ReturnType<typeof MotStatusChanged>, TestsModel, string, boolean],
    ) => {
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.WAITING_ROOM_TO_CAR, tests),
        formatAnalyticsText(AnalyticsEvents.MOT_STATUS_CHANGED, tests),
        `mot status: ${motStatus}`,
      );
      return of(AnalyticRecorded());
    }),
  ));

  motResponseError$ = createEffect(() => this.actions$.pipe(
    ofType(GetMotStatusFailure),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    switchMap((
      [{ err }, tests]:
      [ReturnType<typeof GetMotStatusFailure>, TestsModel, boolean],
    ) => {
      const errorMessage = ERROR_MSGS[err.message]?.msg || err.message;
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.WAITING_ROOM_TO_CAR, tests),
        formatAnalyticsText(AnalyticsEvents.MOT_STATUS_CHANGED, tests),
        `MOT Status: ${errorMessage}`,
      );
      return of(AnalyticRecorded());
    }),
  ));

  motInvalidModalPresented$ = createEffect(() => this.actions$.pipe(
    ofType(MotInvalidModalOpened),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    switchMap((
      [, tests]:
      [ReturnType<typeof MotInvalidModalOpened>, TestsModel, boolean],
    ) => {
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.WAITING_ROOM_TO_CAR, tests),
        formatAnalyticsText(AnalyticsEvents.CHECK_MOT_STATUS, tests),
        'VRN Validation Pop up triggered',
      );
      return of(AnalyticRecorded());
    }),
  ));

  motInvalidConfirmSelected$ = createEffect(() => this.actions$.pipe(
    ofType(MotVRNConfirmed),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    switchMap((
      [, tests]:
      [ReturnType<typeof MotVRNConfirmed>, TestsModel, boolean],
    ) => {
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.WAITING_ROOM_TO_CAR, tests),
        formatAnalyticsText(AnalyticsEvents.CHECK_MOT_STATUS, tests),
        'VRN Validation confirmed',
      );
      return of(AnalyticRecorded());
    }),
  ));

  motVrnAmendedSelected$ = createEffect(() => this.actions$.pipe(
    ofType(MotVRNAmendedPopup),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    switchMap((
      [, tests]:
      [ReturnType<typeof MotVRNAmendedPopup>, TestsModel, boolean],
    ) => {
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.WAITING_ROOM_TO_CAR, tests),
        formatAnalyticsText(AnalyticsEvents.CHECK_MOT_STATUS, tests),
        'VRN Amended on pop up',
      );
      return of(AnalyticRecorded());
    }),
  ));

  vrnBlur$ = createEffect(() => this.actions$.pipe(
    ofType(VRNBlurred),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    switchMap((
      [, tests]:
      [ReturnType<typeof VRNBlurred>, TestsModel, boolean],
    ) => {
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.WAITING_ROOM_TO_CAR, tests),
        formatAnalyticsText(AnalyticsEvents.CHECK_MOT_STATUS, tests),
        'VRN entered WRTC',
      );
      return of(AnalyticRecorded());
    }),
  ));

  alternativeMotEvidenceProvidedChanged$ = createEffect(() => this.actions$.pipe(
    ofType(AlternativeMotEvidenceProvidedChanged),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(getCurrentTest),
            select(getVehicleDetails),
            select(getAlternativeMotEvidenceProvided),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    switchMap((
      [, tests, altMotEvidenceProvided]:
      [ReturnType<typeof AlternativeMotEvidenceProvidedChanged>, TestsModel, boolean, boolean],
    ) => {
      const msg = 'Alternative MOT evidence provided';
      const label = altMotEvidenceProvided ? msg : `No ${msg}`;

      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.WAITING_ROOM_TO_CAR, tests),
        formatAnalyticsText(AnalyticsEvents.CHECK_MOT_STATUS, tests),
        label,
      );
      return of(AnalyticRecorded());
    }),
  ));

  alternativeMotEvidenceDetailsChanged$ = createEffect(() => this.actions$.pipe(
    ofType(AlternativeMotEvidenceDetailsChanged),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(getCurrentTest),
            select(getVehicleDetails),
            select(getAlternativeMotEvidenceDetails),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    switchMap((
      [, tests, altMotEvidenceDetails]:
      [ReturnType<typeof AlternativeMotEvidenceDetailsChanged>, TestsModel, string, boolean],
    ) => {
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.WAITING_ROOM_TO_CAR, tests),
        formatAnalyticsText(AnalyticsEvents.CHECK_MOT_STATUS, tests),
        altMotEvidenceDetails || 'None',
      );
      return of(AnalyticRecorded());
    }),
  ));
}
