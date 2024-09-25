import { Injectable } from '@angular/core';
import { CategoryCode } from '@dvsa/mes-test-schema/categories/common';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { of } from 'rxjs';
import { concatMap, filter, switchMap, withLatestFrom } from 'rxjs/operators';

import { Router } from '@angular/router';
import { ModalEvent } from '@pages/waiting-room-to-car/components/mot-components/mot-failed-modal/mot-failed-modal.component';
import { MOTAbortedMethod } from '@pages/waiting-room-to-car/components/vehicle-registration/vehicle-registration';
import {
  InvalidMotModalOutcome,
  InvalidMotModalValidationError,
  InvalidMotTerminate,
  MotCallAborted,
  MotFailedModalOpened,
  MotNoEvidenceBannerCancelled,
  MotSearchButtonPressed,
  MotServiceUnavailable,
  WaitingRoomToCarBikeCategoryChanged,
  WaitingRoomToCarBikeCategorySelected,
  WaitingRoomToCarError,
  WaitingRoomToCarValidationError,
  WaitingRoomToCarViewBikeCategoryModal,
  WaitingRoomToCarViewDidEnter,
} from '@pages/waiting-room-to-car/waiting-room-to-car.actions';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticNotRecorded, AnalyticRecorded } from '@providers/analytics/analytics.actions';
import {
  AnalyticsScreenNames,
  GoogleAnalyticsCustomDimension,
  GoogleAnalyticsEvents,
  GoogleAnalyticsEventsTitles,
  GoogleAnalyticsEventsValues,
} from '@providers/analytics/analytics.model';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { MotStatusCodes } from '@providers/mot-history-api/mot-interfaces';
import { analyticsEventTypePrefix } from '@shared/helpers/format-analytics-text';
import { StoreModel } from '@shared/models/store.model';
import { getTestCategory } from '@store/tests/category/category.reducer';
import { getApplicationReference } from '@store/tests/journal-data/common/application-reference/application-reference.reducer';
import { getApplicationNumber } from '@store/tests/journal-data/common/application-reference/application-reference.selector';
import { getCandidate } from '@store/tests/journal-data/common/candidate/candidate.reducer';
import { getCandidateId } from '@store/tests/journal-data/common/candidate/candidate.selector';
import { TestsModel } from '@store/tests/tests.model';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest, getJournalData, isPracticeMode } from '@store/tests/tests.selector';
import {
  OrditTrainedChanged,
  TrainerRegistrationNumberChanged,
} from '@store/tests/trainer-details/cat-adi-part2/trainer-details.cat-adi-part2.actions';
import {
  getOrditTrained,
  getTrainerRegistrationNumber,
} from '@store/tests/trainer-details/cat-adi-part2/trainer-details.cat-adi-part2.selector';
import {
  PDILogbook,
  TraineeLicence,
} from '@store/tests/trainer-details/cat-adi-part3/trainer-details.cat-adi-part3.actions';
import { getTrainerDetails } from '@store/tests/trainer-details/cat-adi-part3/trainer-details.cat-adi-part3.reducer';
import {
  getPDILogbook,
  getTraineeLicence,
} from '@store/tests/trainer-details/cat-adi-part3/trainer-details.cat-adi-part3.selector';
import { getVehicleDetails } from '@store/tests/vehicle-details/cat-adi-part3/vehicle-details.cat-adi-part3.reducer';
import { getDualControls } from '@store/tests/vehicle-details/cat-adi-part3/vehicle-details.cat-adi-part3.selector';
import * as vehicleDetailsActions from '@store/tests/vehicle-details/vehicle-details.actions';
import {
  DualControlsToggledNo,
  DualControlsToggledYes,
  MotEvidenceProvidedToggled,
  MotStatusChanged,
  VehicleRegistrationChanged,
} from '@store/tests/vehicle-details/vehicle-details.actions';
import { getMotStatus } from '@store/tests/vehicle-details/vehicle-details.selector';

@Injectable()
export class WaitingRoomToCarAnalyticsEffects {
  private classPrefix = '/WaitingRoomToCar';

  constructor(
    public analytics: AnalyticsProvider,
    private actions$: Actions,
    private store$: Store<StoreModel>,
    private router: Router,
    private appConfigProvider: AppConfigProvider
  ) {}

  waitingRoomToCarViewDidEnter$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WaitingRoomToCarViewDidEnter),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(
            this.store$.pipe(select(getTests)),
            this.store$.pipe(
              select(getTests),
              select(getCurrentTest),
              select(getJournalData),
              select(getApplicationReference),
              select(getApplicationNumber)
            ),
            this.store$.pipe(
              select(getTests),
              select(getCurrentTest),
              select(getJournalData),
              select(getCandidate),
              select(getCandidateId)
            ),
            this.store$.pipe(select(getTests), select(getCurrentTest), select(getTestCategory)),
            this.store$.pipe(select(getTests), select(isPracticeMode))
          )
        )
      ),
      filter(([, , , , , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      switchMap(
        ([, tests, applicationReference, candidateId, category]: [
          ReturnType<typeof WaitingRoomToCarViewDidEnter>,
          TestsModel,
          string,
          number,
          CategoryCode,
          boolean,
        ]) => {
          //GA4 Analytics
          this.analytics.setGACurrentPage(analyticsEventTypePrefix(AnalyticsScreenNames.WAITING_ROOM_TO_CAR, tests));

          this.analytics.addGACustomDimension(GoogleAnalyticsCustomDimension.CANDIDATE_ID, `${candidateId}`);
          this.analytics.addGACustomDimension(
            GoogleAnalyticsCustomDimension.APPLICATION_REFERENCE,
            applicationReference
          );
          this.analytics.addGACustomDimension(GoogleAnalyticsCustomDimension.TEST_CATEGORY, category);

          return of(AnalyticRecorded());
        }
      )
    )
  );

  waitingRoomToCarError$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WaitingRoomToCarError),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(
            this.store$.pipe(select(getTests)),
            this.store$.pipe(select(getTests), select(getCurrentTest), select(getTestCategory)),
            this.store$.pipe(select(getTests), select(isPracticeMode))
          )
        )
      ),
      filter(([, , , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      switchMap(([action, tests]: [ReturnType<typeof WaitingRoomToCarError>, TestsModel, CategoryCode, boolean]) => {
        // GA4 Analytics
        this.analytics.logGAEvent(
          analyticsEventTypePrefix(GoogleAnalyticsEvents.SUBMIT_FORM_ERROR, tests),
          GoogleAnalyticsEventsTitles.BLANK_FIELD,
          action.errorMessage
        );

        return of(AnalyticRecorded());
      })
    )
  );

  waitingRoomToCarValidationError$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WaitingRoomToCarValidationError),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(
            this.store$.pipe(select(getTests)),
            this.store$.pipe(select(getTests), select(getCurrentTest), select(getTestCategory)),
            this.store$.pipe(select(getTests), select(isPracticeMode))
          )
        )
      ),
      filter(([, , , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      switchMap(
        ([action, tests]: [ReturnType<typeof WaitingRoomToCarValidationError>, TestsModel, CategoryCode, boolean]) => {
          // GA4 Analytics
          this.analytics.logGAEvent(
            analyticsEventTypePrefix(GoogleAnalyticsEvents.VALIDATION_ERROR, tests),
            GoogleAnalyticsEventsTitles.BLANK_FIELD,
            action.errorMessage
          );
          return of(AnalyticRecorded());
        }
      )
    )
  );

  waitingRoomToCarBikeCategoryChanged$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WaitingRoomToCarBikeCategoryChanged),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store$.pipe(select(getTests)), this.store$.pipe(select(getTests), select(isPracticeMode)))
        )
      ),
      filter(([, , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      switchMap(([action, tests]: [ReturnType<typeof WaitingRoomToCarBikeCategoryChanged>, TestsModel, boolean]) => {
        // GA4 Analytics
        this.analytics.logGAEvent(
          analyticsEventTypePrefix(GoogleAnalyticsEvents.BIKE_CATEGORY_CHANGED, tests),
          GoogleAnalyticsEventsTitles.CHANGED_FROM,
          action.initialBikeCategory,
          GoogleAnalyticsEventsTitles.CHANGED_TO,
          action.selectedBikeCategory
        );
        return of(AnalyticRecorded());
      })
    )
  );

  waitingRoomToCarBikeCategorySelected$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WaitingRoomToCarBikeCategorySelected),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store$.pipe(select(getTests)), this.store$.pipe(select(getTests), select(isPracticeMode)))
        )
      ),
      filter(([, , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      switchMap(([action, tests]: [ReturnType<typeof WaitingRoomToCarBikeCategorySelected>, TestsModel, boolean]) => {
        // GA4 Analytics
        this.analytics.logGAEvent(
          analyticsEventTypePrefix(GoogleAnalyticsEvents.BIKE_CATEGORY_SELECTED, tests),
          GoogleAnalyticsEventsTitles.CATEGORY,
          action.bikeCategory
        );
        return of(AnalyticRecorded());
      })
    )
  );

  waitingRoomToCarViewBikeCategoryModal$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WaitingRoomToCarViewBikeCategoryModal),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store$.pipe(select(getTests)), this.store$.pipe(select(getTests), select(isPracticeMode)))
        )
      ),
      filter(([, , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      switchMap(([, tests]: [ReturnType<typeof WaitingRoomToCarViewBikeCategoryModal>, TestsModel, boolean]) => {
        // GA4 Analytics
        this.analytics.logGAEvent(
          analyticsEventTypePrefix(GoogleAnalyticsEvents.NAVIGATION, tests),
          GoogleAnalyticsEventsTitles.OPENED,
          GoogleAnalyticsEventsValues.BIKE_CATEGORY_MODAL
        );
        return of(AnalyticRecorded());
      })
    )
  );

  waitingRoomToCarDualControlsChanged$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DualControlsToggledYes, DualControlsToggledNo),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(
            this.store$.pipe(select(getTests)),
            this.store$.pipe(
              select(getTests),
              select(getCurrentTest),
              select(getVehicleDetails),
              select(getDualControls)
            ),
            this.store$.pipe(select(getTests), select(isPracticeMode))
          )
        )
      ),
      filter(([, , , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      switchMap(
        ([, tests, dualControls]: [
          ReturnType<typeof DualControlsToggledYes | typeof DualControlsToggledNo>,
          TestsModel,
          boolean,
          boolean,
        ]) => {
          // GA4 Analytics
          this.analytics.logGAEvent(
            analyticsEventTypePrefix(GoogleAnalyticsEvents.DUAL_CONTROLS, tests),
            GoogleAnalyticsEventsTitles.SELECTION,
            dualControls ? GoogleAnalyticsEventsValues.YES : GoogleAnalyticsEventsValues.NO
          );
          return of(AnalyticRecorded());
        }
      )
    )
  );

  waitingRoomToCarTransmissionChanged$ = createEffect(() =>
    this.actions$.pipe(
      ofType(vehicleDetailsActions.GearboxCategoryChanged),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store$.pipe(select(getTests)), this.store$.pipe(select(getTests), select(isPracticeMode)))
        )
      ),
      filter(([, , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      concatMap(
        ([{ gearboxCategory }, tests]: [
          ReturnType<typeof vehicleDetailsActions.GearboxCategoryChanged>,
          TestsModel,
          boolean,
        ]) => {
          // Check current URL begins with WRTC prefix before recording analytic to stop duplicated events.
          if (this.router.url?.startsWith(this.classPrefix)) {
            // GA4 Analytics
            this.analytics.logGAEvent(
              analyticsEventTypePrefix(GoogleAnalyticsEvents.SET_TRANSMISSION, tests),
              GoogleAnalyticsEventsTitles.TRANSMISSION_TYPE,
              gearboxCategory
            );
            return of(AnalyticRecorded());
          }
          return of(AnalyticNotRecorded());
        }
      )
    )
  );

  waitingRoomToCarPDILogbookChanged$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PDILogbook),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(
            this.store$.pipe(select(getTests)),
            this.store$.pipe(
              select(getTests),
              select(getCurrentTest),
              select(getTrainerDetails),
              select(getPDILogbook)
            ),
            this.store$.pipe(select(getTests), select(isPracticeMode))
          )
        )
      ),
      filter(([, , , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      switchMap(([, tests, pdiLogBook]: [ReturnType<typeof PDILogbook>, TestsModel, boolean, boolean]) => {
        // GA4 Analytics
        this.analytics.logGAEvent(
          analyticsEventTypePrefix(GoogleAnalyticsEvents.PDI_LOGBOOK, tests),
          GoogleAnalyticsEventsTitles.SELECTION,
          pdiLogBook ? GoogleAnalyticsEventsValues.YES : GoogleAnalyticsEventsValues.NO
        );
        return of(AnalyticRecorded());
      })
    )
  );

  waitingRoomToCarTraineeLicenceChanged$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TraineeLicence),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(
            this.store$.pipe(select(getTests)),
            this.store$.pipe(
              select(getTests),
              select(getCurrentTest),
              select(getTrainerDetails),
              select(getTraineeLicence)
            ),
            this.store$.pipe(select(getTests), select(isPracticeMode))
          )
        )
      ),
      filter(([, , , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      switchMap(([, tests, traineeLicence]: [ReturnType<typeof TraineeLicence>, TestsModel, boolean, boolean]) => {
        // GA4 Analytics
        this.analytics.logGAEvent(
          analyticsEventTypePrefix(GoogleAnalyticsEvents.TRAINEE_LICENCE, tests),
          GoogleAnalyticsEventsTitles.SELECTION,
          traineeLicence ? GoogleAnalyticsEventsValues.YES : GoogleAnalyticsEventsValues.NO
        );
        return of(AnalyticRecorded());
      })
    )
  );

  waitingRoomToCarOrditTrainedChanged$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrditTrainedChanged),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(
            this.store$.pipe(select(getTests)),
            this.store$.pipe(
              select(getTests),
              select(getCurrentTest),
              select(getTrainerDetails),
              select(getOrditTrained)
            ),
            this.store$.pipe(select(getTests), select(isPracticeMode))
          )
        )
      ),
      filter(([, , , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      switchMap(([, tests, orditTrained]: [ReturnType<typeof OrditTrainedChanged>, TestsModel, boolean, boolean]) => {
        // GA4 Analytics
        this.analytics.logGAEvent(
          analyticsEventTypePrefix(GoogleAnalyticsEvents.ORDIT_TRAINER, tests),
          GoogleAnalyticsEventsTitles.SELECTION,
          orditTrained ? GoogleAnalyticsEventsValues.YES : GoogleAnalyticsEventsValues.NO
        );
        return of(AnalyticRecorded());
      })
    )
  );

  waitingRoomToCarTrainerRegistrationNumberChanged$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TrainerRegistrationNumberChanged),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(
            this.store$.pipe(select(getTests)),
            this.store$.pipe(
              select(getTests),
              select(getCurrentTest),
              select(getTrainerDetails),
              select(getTrainerRegistrationNumber)
            ),
            this.store$.pipe(select(getTests), select(isPracticeMode))
          )
        )
      ),
      filter(([, , , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      switchMap(([, tests]: [ReturnType<typeof TrainerRegistrationNumberChanged>, TestsModel, number, boolean]) => {
        // GA4 Analytics
        this.analytics.logGAEvent(
          analyticsEventTypePrefix(GoogleAnalyticsEvents.TRAINER_REG_NUMBER, tests),
          GoogleAnalyticsEventsTitles.SELECTION,
          GoogleAnalyticsEventsValues.TRAINER_ID_ENTERED
        );
        return of(AnalyticRecorded());
      })
    )
  );

  motStatusChanged$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MotStatusChanged),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(
            this.store$.pipe(select(getTests)),
            this.store$.pipe(select(getTests), select(getCurrentTest), select(getVehicleDetails), select(getMotStatus)),
            this.store$.pipe(select(getTests), select(isPracticeMode))
          )
        )
      ),
      filter(([, , , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      switchMap(([, tests, motStatus]: [ReturnType<typeof MotStatusChanged>, TestsModel, MotStatusCodes, boolean]) => {
        // GA4 Analytics
        this.analytics.logGAEvent(
          analyticsEventTypePrefix(GoogleAnalyticsEvents.MOT_CHECK, tests),
          GoogleAnalyticsEventsTitles.MOT_STATUS,
          motStatus == MotStatusCodes.AGE_EXEMPTION ? MotStatusCodes.NO_DETAILS : motStatus
        );
        return of(AnalyticRecorded());
      })
    )
  );

  motCallAborted$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MotCallAborted),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store$.pipe(select(getTests)), this.store$.pipe(select(getTests), select(isPracticeMode)))
        )
      ),
      filter(([, , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      switchMap(([{ method }, tests]: [ReturnType<typeof MotCallAborted>, TestsModel, boolean]) => {
        let abortMethod = GoogleAnalyticsEventsValues.UNKNOWN;

        switch (method) {
          case MOTAbortedMethod.END_TEST:
            abortMethod = GoogleAnalyticsEventsValues.END_TEST_SELECTED;
            break;
          case MOTAbortedMethod.VRN_CHANGED:
            abortMethod = GoogleAnalyticsEventsValues.VRN_EDITED;
            break;
          case MOTAbortedMethod.NAVIGATION:
            abortMethod = GoogleAnalyticsEventsValues.NAVIGATION;
            break;
        }
        // GA4 Analytics
        this.analytics.logGAEvent(
          analyticsEventTypePrefix(GoogleAnalyticsEvents.MOT_CHECK, tests),
          GoogleAnalyticsEventsTitles.CHECK_CANCELLED,
          abortMethod
        );
        return of(AnalyticRecorded());
      })
    )
  );

  motServiceUnavailable$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MotServiceUnavailable),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store$.pipe(select(getTests)), this.store$.pipe(select(getTests), select(isPracticeMode)))
        )
      ),
      filter(([, , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      switchMap(([{ statusCode }, tests]: [ReturnType<typeof MotServiceUnavailable>, TestsModel, boolean]) => {
        // GA4 Analytics
        this.analytics.logGAEvent(
          analyticsEventTypePrefix(GoogleAnalyticsEvents.MOT_CHECK, tests),
          GoogleAnalyticsEventsTitles.API_UNAVAILABLE,
          statusCode.toString()
        );
        return of(AnalyticRecorded());
      })
    )
  );

  motFailedModalOpened$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MotFailedModalOpened),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store$.pipe(select(getTests)), this.store$.pipe(select(getTests), select(isPracticeMode)))
        )
      ),
      filter(([, , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      switchMap(([, tests]: [ReturnType<typeof MotFailedModalOpened>, TestsModel, boolean]) => {
        // GA4 Analytics
        this.analytics.logGAEvent(
          analyticsEventTypePrefix(GoogleAnalyticsEvents.MOT_CHECK, tests),
          GoogleAnalyticsEventsTitles.EXPIRED_POPUP,
          GoogleAnalyticsEventsValues.DISPLAYED
        );
        return of(AnalyticRecorded());
      })
    )
  );

  motFailedModalOutcome$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InvalidMotModalOutcome),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store$.pipe(select(getTests)), this.store$.pipe(select(getTests), select(isPracticeMode)))
        )
      ),
      filter(([, , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      switchMap(([{ modalEvent }, tests]: [ReturnType<typeof InvalidMotModalOutcome>, TestsModel, boolean]) => {
        // GA4 Analytics
        this.analytics.logGAEvent(
          analyticsEventTypePrefix(GoogleAnalyticsEvents.MOT_CHECK, tests),
          GoogleAnalyticsEventsTitles.EXPIRED_POPUP,
          modalEvent == ModalEvent.CONFIRM
            ? GoogleAnalyticsEventsValues.CONFIRMED
            : GoogleAnalyticsEventsValues.CANCELLED
        );
        return of(AnalyticRecorded());
      })
    )
  );

  motEvidenceProvidedToggled$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MotEvidenceProvidedToggled),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store$.pipe(select(getTests)), this.store$.pipe(select(getTests), select(isPracticeMode)))
        )
      ),
      filter(([, , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      switchMap(
        ([{ motEvidenceProvided }, tests]: [ReturnType<typeof MotEvidenceProvidedToggled>, TestsModel, boolean]) => {
          // GA4 Analytics
          this.analytics.logGAEvent(
            analyticsEventTypePrefix(GoogleAnalyticsEvents.MOT_CHECK, tests),
            GoogleAnalyticsEventsTitles.ALT_EVIDENCE_PROVIDED,
            motEvidenceProvided ? GoogleAnalyticsEventsValues.YES : GoogleAnalyticsEventsValues.NO
          );
          return of(AnalyticRecorded());
        }
      )
    )
  );

  motNoEvidenceBannerCancelled$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MotNoEvidenceBannerCancelled),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store$.pipe(select(getTests)), this.store$.pipe(select(getTests), select(isPracticeMode)))
        )
      ),
      filter(([, , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      switchMap(([, tests]: [ReturnType<typeof MotNoEvidenceBannerCancelled>, TestsModel, boolean]) => {
        // GA4 Analytics
        this.analytics.logGAEvent(
          analyticsEventTypePrefix(GoogleAnalyticsEvents.MOT_CHECK, tests),
          GoogleAnalyticsEventsTitles.MOT_WARNING,
          GoogleAnalyticsEventsValues.CANCELLED
        );
        return of(AnalyticRecorded());
      })
    )
  );

  invalidMotTerminate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InvalidMotTerminate),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store$.pipe(select(getTests)), this.store$.pipe(select(getTests), select(isPracticeMode)))
        )
      ),
      filter(([, , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      switchMap(([, tests]: [ReturnType<typeof InvalidMotTerminate>, TestsModel, boolean]) => {
        // GA4 Analytics
        this.analytics.logGAEvent(
          analyticsEventTypePrefix(GoogleAnalyticsEvents.MOT_CHECK, tests),
          GoogleAnalyticsEventsTitles.MOT_WARNING,
          GoogleAnalyticsEventsValues.TERMINATE_TEST
        );
        return of(AnalyticRecorded());
      })
    )
  );

  motFailedModalValidationError$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InvalidMotModalValidationError),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store$.pipe(select(getTests)), this.store$.pipe(select(getTests), select(isPracticeMode)))
        )
      ),
      filter(([, , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      switchMap(([, tests]: [ReturnType<typeof InvalidMotModalValidationError>, TestsModel, boolean]) => {
        // GA4 Analytics
        this.analytics.logGAEvent(
          analyticsEventTypePrefix(GoogleAnalyticsEvents.MOT_CHECK, tests),
          GoogleAnalyticsEventsTitles.EXPIRED_POPUP,
          GoogleAnalyticsEventsValues.VRN_MISMATCH
        );
        return of(AnalyticRecorded());
      })
    )
  );

  motSearchButtonPressed$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MotSearchButtonPressed),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store$.pipe(select(getTests)), this.store$.pipe(select(getTests), select(isPracticeMode)))
        )
      ),
      filter(([, , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      switchMap(([, tests]: [ReturnType<typeof MotSearchButtonPressed>, TestsModel, boolean]) => {
        // GA4 Analytics
        this.analytics.logGAEvent(
          analyticsEventTypePrefix(GoogleAnalyticsEvents.MOT_CHECK, tests),
          GoogleAnalyticsEventsTitles.BUTTON_SELECTION,
          GoogleAnalyticsEventsValues.RETRIEVE_MOT
        );
        return of(AnalyticRecorded());
      })
    )
  );

  vehicleRegistrationChanged$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VehicleRegistrationChanged),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store$.pipe(select(getTests)), this.store$.pipe(select(getTests), select(isPracticeMode)))
        )
      ),
      filter(([, , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      switchMap(([{ isAmended }, tests]: [ReturnType<typeof VehicleRegistrationChanged>, TestsModel, boolean]) => {
        // GA4 Analytics
        this.analytics.logGAEvent(
          analyticsEventTypePrefix(GoogleAnalyticsEvents.VRN_CAPTURE, tests),
          GoogleAnalyticsEventsTitles.OUTCOME,
          isAmended ? GoogleAnalyticsEventsValues.SAVED : GoogleAnalyticsEventsValues.AMENDED
        );
        return of(AnalyticRecorded());
      })
    )
  );
}
