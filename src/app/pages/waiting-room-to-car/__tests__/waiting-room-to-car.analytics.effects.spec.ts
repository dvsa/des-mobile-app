import { TestBed } from '@angular/core/testing';
import { ReplaySubject } from 'rxjs';
import { Store, StoreModule } from '@ngrx/store';
import { provideMockActions } from '@ngrx/effects/testing';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticsProviderMock } from '@providers/analytics/__mocks__/analytics.mock';
import {
  AnalyticsDimensionIndices,
  AnalyticsErrorTypes,
  AnalyticsEventCategories,
  AnalyticsEvents,
  AnalyticsScreenNames,
} from '@providers/analytics/analytics.model';
import { StoreModel } from '@shared/models/store.model';
import { Application } from '@dvsa/mes-journal-schema';
import { testsReducer } from '@store/tests/tests.reducer';
import * as testsActions from '@store/tests/tests.actions';
import { PopulateCandidateDetails } from '@store/tests/journal-data/common/candidate/candidate.actions';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import * as applicationReferenceActions
  from '@store/tests/journal-data/common/application-reference/application-reference.actions';
import { candidateMock } from '@store/tests/__mocks__/tests.mock';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { PopulateTestCategory } from '@store/tests/category/category.actions';
import { end2endPracticeSlotId } from '@shared/mocks/test-slot-ids.mock';
import * as vehicleDetailsActions from '@store/tests/vehicle-details/vehicle-details.actions';
import {
  AlternativeMotEvidenceDetailsChanged,
  AlternativeMotEvidenceProvidedChanged,
  DualControlsToggledNo,
  DualControlsToggledYes,
  MotStatusChanged,
} from '@store/tests/vehicle-details/vehicle-details.actions';
import {
  PDILogbook,
  TraineeLicence,
} from '@store/tests/trainer-details/cat-adi-part3/trainer-details.cat-adi-part3.actions';
import { Router } from '@angular/router';
import { CAT_B } from '@pages/page-names.constants';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { AppConfigProviderMock } from '@providers/app-config/__mocks__/app-config.mock';
import {
  OrditTrainedChanged,
  TrainerRegistrationNumberChanged,
} from '@store/tests/trainer-details/cat-adi-part2/trainer-details.cat-adi-part2.actions';
import { WaitingRoomToCarAnalyticsEffects } from '../waiting-room-to-car.analytics.effects';
import * as waitingRoomToCarActions from '../waiting-room-to-car.actions';
import {
  GetMotStatus,
  GetMotStatusFailure,
  MotInvalidModalOpened,
  MotVRNAmendedPopup,
  MotVRNConfirmed,
  VRNBlurred,
  WaitingRoomToCarViewBikeCategoryModal,
} from '../waiting-room-to-car.actions';
import * as fakeJournalActions from '../../fake-journal/fake-journal.actions';

describe('WaitingRoomToCarAnalyticsEffects', () => {
  let effects: WaitingRoomToCarAnalyticsEffects;
  let analyticsProviderMock: AnalyticsProvider;
  let actions$: ReplaySubject<any>;
  let store$: Store<StoreModel>;
  const screenName = AnalyticsScreenNames.WAITING_ROOM_TO_CAR;
  const screenNamePracticeMode = `${AnalyticsEventCategories.PRACTICE_MODE} - ${screenName}`;
  const mockApplication: Application = {
    applicationId: 123456,
    bookingSequence: 78,
    checkDigit: 9,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          tests: testsReducer,
        }),
      ],
      providers: [
        WaitingRoomToCarAnalyticsEffects,
        {
          provide: AnalyticsProvider,
          useClass: AnalyticsProviderMock,
        },
        {
          provide: Router,
          useValue: { url: `/${CAT_B.WAITING_ROOM_TO_CAR_PAGE}` },
        },
        provideMockActions(() => actions$),
        {
          provide: AppConfigProvider,
          useClass: AppConfigProviderMock,
        },
        Store,
      ],
    });

    actions$ = new ReplaySubject(1);
    effects = TestBed.inject(WaitingRoomToCarAnalyticsEffects);
    analyticsProviderMock = TestBed.inject(AnalyticsProvider);
    store$ = TestBed.inject(Store);
    spyOn(analyticsProviderMock, 'logEvent');
  });

  describe('waitingRoomToCarViewDidEnter', () => {
    it('should call setCurrentPage, addCustomDimension and category', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123, TestCategory.B));
      store$.dispatch(PopulateTestCategory(TestCategory.B));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(applicationReferenceActions.PopulateApplicationReference(mockApplication));
      // ACT
      actions$.next(waitingRoomToCarActions.WaitingRoomToCarViewDidEnter());
      // ASSERT
      effects.waitingRoomToCarViewDidEnter$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);
        expect(analyticsProviderMock.addCustomDimension)
          .toHaveBeenCalledWith(AnalyticsDimensionIndices.CANDIDATE_ID, '1');
        expect(analyticsProviderMock.addCustomDimension)
          .toHaveBeenCalledWith(AnalyticsDimensionIndices.APPLICATION_REFERENCE, '123456789');
        expect(analyticsProviderMock.addCustomDimension)
          .toHaveBeenCalledWith(AnalyticsDimensionIndices.TEST_CATEGORY, 'B');
        expect(analyticsProviderMock.setCurrentPage)
          .toHaveBeenCalledWith(screenName);
        done();
      });
    });
    it('should call setCurrentPage with practice mode prefix, addCustomDimension and test category', (done) => {
      // ARRANGE
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId, TestCategory.B));
      store$.dispatch(PopulateTestCategory(TestCategory.B));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(applicationReferenceActions.PopulateApplicationReference(mockApplication));
      // ACT
      actions$.next(waitingRoomToCarActions.WaitingRoomToCarViewDidEnter());
      // ASSERT
      effects.waitingRoomToCarViewDidEnter$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);
        expect(analyticsProviderMock.addCustomDimension)
          .toHaveBeenCalledWith(AnalyticsDimensionIndices.CANDIDATE_ID, '1');
        expect(analyticsProviderMock.addCustomDimension)
          .toHaveBeenCalledWith(AnalyticsDimensionIndices.APPLICATION_REFERENCE, '123456789');
        expect(analyticsProviderMock.addCustomDimension)
          .toHaveBeenCalledWith(AnalyticsDimensionIndices.TEST_CATEGORY, 'B');
        expect(analyticsProviderMock.setCurrentPage)
          .toHaveBeenCalledWith(screenNamePracticeMode);
        done();
      });
    });

  });

  describe('waitingRoomToCarError', () => {
    it('should call logError', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123, TestCategory.B));
      store$.dispatch(PopulateTestCategory(TestCategory.B));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      // ACT
      actions$.next(waitingRoomToCarActions.WaitingRoomToCarError('error 123'));
      // ASSERT
      effects.waitingRoomToCarError$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);
        expect(analyticsProviderMock.logError)
          .toHaveBeenCalledWith(
            `${AnalyticsErrorTypes.SUBMIT_FORM_ERROR} (${screenName})`,
            'error 123',
          );
        expect(analyticsProviderMock.addCustomDimension)
          .toHaveBeenCalledWith(AnalyticsDimensionIndices.TEST_CATEGORY, 'B');
        done();
      });
    });
    it('should call logError, prefixed with practice mode', (done) => {
      // ARRANGE
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      store$.dispatch(PopulateTestCategory(TestCategory.B));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      // ACT
      actions$.next(waitingRoomToCarActions.WaitingRoomToCarError('error 123'));
      // ASSERT
      effects.waitingRoomToCarError$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);
        expect(analyticsProviderMock.logError)
          .toHaveBeenCalledWith(`${AnalyticsErrorTypes.SUBMIT_FORM_ERROR} (${screenNamePracticeMode})`,
            'error 123');
        expect(analyticsProviderMock.addCustomDimension)
          .toHaveBeenCalledWith(AnalyticsDimensionIndices.TEST_CATEGORY, 'B');
        done();
      });
    });

  });

  describe('waitingRoomToCarValidationError', () => {
    it('should call logError', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123, TestCategory.B));
      store$.dispatch(PopulateTestCategory(TestCategory.B));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      // ACT
      actions$.next(waitingRoomToCarActions.WaitingRoomToCarValidationError('formControl1'));
      // ASSERT
      effects.waitingRoomToCarValidationError$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);
        expect(analyticsProviderMock.logError)
          .toHaveBeenCalledWith(`${AnalyticsErrorTypes.VALIDATION_ERROR} (${screenName})`,
            'formControl1');
        expect(analyticsProviderMock.addCustomDimension)
          .toHaveBeenCalledWith(AnalyticsDimensionIndices.TEST_CATEGORY, 'B');
        done();
      });
    });
    it('should call logError, prefixed with practice mode', (done) => {
      // ARRANGE
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      store$.dispatch(PopulateTestCategory(TestCategory.B));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      // ACT
      actions$.next(waitingRoomToCarActions.WaitingRoomToCarValidationError('formControl1'));
      // ASSERT
      effects.waitingRoomToCarValidationError$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);
        expect(analyticsProviderMock.logError)
          .toHaveBeenCalledWith(`${AnalyticsErrorTypes.VALIDATION_ERROR} (${screenNamePracticeMode})`,
            'formControl1');
        expect(analyticsProviderMock.addCustomDimension)
          .toHaveBeenCalledWith(AnalyticsDimensionIndices.TEST_CATEGORY, 'B');
        done();
      });
    });
  });

  describe('waitingRoomToCarDualControlsChanged$', () => {
    it('should record an analytic when dual controls is changed to Yes', () => {
      // ARRANGE
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      store$.dispatch(PopulateTestCategory(TestCategory.ADI3));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(DualControlsToggledYes());
      // ACT
      actions$.next(DualControlsToggledYes());
      // ASSERT
      effects.waitingRoomToCarDualControlsChanged$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);
        expect(analyticsProviderMock.logEvent)
          .toHaveBeenCalledWith(
            `${AnalyticsEventCategories.PRACTICE_MODE} - ${AnalyticsEventCategories.WAITING_ROOM_TO_CAR}`,
            `${AnalyticsEventCategories.PRACTICE_MODE} - ${AnalyticsEvents.DUAL_CONTROLS_CHANGED}`,
            'dual controls changed to Yes',
          );
      });
    });
    it('should record an analytic when dual controls is changed to No', () => {
      // ARRANGE
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      store$.dispatch(PopulateTestCategory(TestCategory.ADI3));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(DualControlsToggledNo());
      // ACT
      actions$.next(DualControlsToggledNo());
      // ASSERT
      effects.waitingRoomToCarDualControlsChanged$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);
        expect(analyticsProviderMock.logEvent)
          .toHaveBeenCalledWith(
            `${AnalyticsEventCategories.PRACTICE_MODE} - ${AnalyticsEventCategories.WAITING_ROOM_TO_CAR}`,
            `${AnalyticsEventCategories.PRACTICE_MODE} - ${AnalyticsEvents.DUAL_CONTROLS_CHANGED}`,
            'dual controls changed to No',
          );
      });
    });
  });

  describe('waitingRoomToCarTransmissionChanged$', () => {
    it('should record an analytic when transmission is changed to Automatic', () => {
      // ARRANGE
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      store$.dispatch(PopulateTestCategory(TestCategory.ADI3));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(vehicleDetailsActions.GearboxCategoryChanged('Automatic'));
      // ACT
      actions$.next(vehicleDetailsActions.GearboxCategoryChanged('Automatic'));
      // ASSERT
      effects.waitingRoomToCarTransmissionChanged$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);
        expect(analyticsProviderMock.logEvent)
          .toHaveBeenCalledWith(
            `${AnalyticsEventCategories.PRACTICE_MODE} - ${AnalyticsEventCategories.WAITING_ROOM_TO_CAR}`,
            `${AnalyticsEventCategories.PRACTICE_MODE} - ${AnalyticsEvents.GEARBOX_CATEGORY_CHANGED}`,
            'Automatic',
          );
      });
    });
    it('should record an analytic when transmission is changed to Manual', () => {
      // ARRANGE
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      store$.dispatch(PopulateTestCategory(TestCategory.ADI3));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(vehicleDetailsActions.GearboxCategoryChanged('Manual'));
      // ACT
      actions$.next(vehicleDetailsActions.GearboxCategoryChanged('Manual'));
      // ASSERT
      effects.waitingRoomToCarTransmissionChanged$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);
        expect(analyticsProviderMock.logEvent)
          .toHaveBeenCalledWith(
            `${AnalyticsEventCategories.PRACTICE_MODE} - ${AnalyticsEventCategories.WAITING_ROOM_TO_CAR}`,
            `${AnalyticsEventCategories.PRACTICE_MODE} - ${AnalyticsEvents.GEARBOX_CATEGORY_CHANGED}`,
            'Manual',
          );
      });
    });
  });

  describe('waitingRoomToCarPDILogbookChanged$', () => {
    it('should record an analytic when pdiLogbook is changed to Yes', () => {
      // ARRANGE
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      store$.dispatch(PopulateTestCategory(TestCategory.ADI3));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(PDILogbook(true));
      // ACT
      actions$.next(PDILogbook(true));
      // ASSERT
      effects.waitingRoomToCarPDILogbookChanged$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);
        expect(analyticsProviderMock.logEvent)
          .toHaveBeenCalledWith(
            `${AnalyticsEventCategories.PRACTICE_MODE} - ${AnalyticsEventCategories.WAITING_ROOM_TO_CAR}`,
            `${AnalyticsEventCategories.PRACTICE_MODE} - ${AnalyticsEvents.PDI_LOGBOOK_CHANGED}`,
            'pdi logbook changed to Yes',
          );
      });
    });
    it('should record an analytic when pdiLogbook is changed to No', () => {
      // ARRANGE
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      store$.dispatch(PopulateTestCategory(TestCategory.ADI3));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(PDILogbook(false));
      // ACT
      actions$.next(PDILogbook(false));
      // ASSERT
      effects.waitingRoomToCarPDILogbookChanged$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);
        expect(analyticsProviderMock.logEvent)
          .toHaveBeenCalledWith(
            `${AnalyticsEventCategories.PRACTICE_MODE} - ${AnalyticsEventCategories.WAITING_ROOM_TO_CAR}`,
            `${AnalyticsEventCategories.PRACTICE_MODE} - ${AnalyticsEvents.PDI_LOGBOOK_CHANGED}`,
            'pdi logbook changed to No',
          );
      });
    });
  });

  describe('waitingRoomToCarTraineeLicenceChanged$', () => {
    it('should record an analytic when traineeLicence is changed to Yes', () => {
      // ARRANGE
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      store$.dispatch(PopulateTestCategory(TestCategory.ADI3));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(TraineeLicence(true));
      // ACT
      actions$.next(TraineeLicence(true));
      // ASSERT
      effects.waitingRoomToCarTraineeLicenceChanged$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);
        expect(analyticsProviderMock.logEvent)
          .toHaveBeenCalledWith(
            `${AnalyticsEventCategories.PRACTICE_MODE} - ${AnalyticsEventCategories.WAITING_ROOM_TO_CAR}`,
            `${AnalyticsEventCategories.PRACTICE_MODE} - ${AnalyticsEvents.TRAINEE_LICENCE_CHANGED}`,
            'trainee licence changed to Yes',
          );
      });
    });
    it('should record an analytic when traineeLicence is changed to No', () => {
      // ARRANGE
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      store$.dispatch(PopulateTestCategory(TestCategory.ADI3));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(TraineeLicence(false));
      // ACT
      actions$.next(TraineeLicence(false));
      // ASSERT
      effects.waitingRoomToCarTraineeLicenceChanged$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);
        expect(analyticsProviderMock.logEvent)
          .toHaveBeenCalledWith(
            `${AnalyticsEventCategories.PRACTICE_MODE} - ${AnalyticsEventCategories.WAITING_ROOM_TO_CAR}`,
            `${AnalyticsEventCategories.PRACTICE_MODE} - ${AnalyticsEvents.TRAINEE_LICENCE_CHANGED}`,
            'trainee licence changed to No',
          );
      });
    });
  });
  describe('waitingRoomToCarViewBikeCategoryModal', () => {
    it('should record an analytic when waitingRoomToCarViewBikeCategoryModal fires', () => {
      // ARRANGE
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      store$.dispatch(PopulateTestCategory(TestCategory.ADI3));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      // ACT
      actions$.next(WaitingRoomToCarViewBikeCategoryModal());
      // ASSERT
      effects.waitingRoomToCarViewBikeCategoryModal$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);
        expect(analyticsProviderMock.logEvent)
          .toHaveBeenCalledWith(
            `${AnalyticsEventCategories.PRACTICE_MODE} - ${AnalyticsEventCategories.WAITING_ROOM_TO_CAR}`,
            `${AnalyticsEventCategories.PRACTICE_MODE} - ${AnalyticsEvents.BIKE_CATEGORY_MODAL_TRIGGERED}`,
            'bike category selection modal triggered',
          );
      });
    });
  });
  describe('waitingRoomToCarOrditTrainedChanged$', () => {
    it('should record an analytic when waitingRoomToCarOrditTrainedChanged fires', () => {
      // ARRANGE
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      store$.dispatch(PopulateTestCategory(TestCategory.ADI3));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(OrditTrainedChanged(true));
      // ACT
      actions$.next(OrditTrainedChanged(true));
      // ASSERT
      effects.waitingRoomToCarOrditTrainedChanged$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);
        expect(analyticsProviderMock.logEvent)
          .toHaveBeenCalledWith(
            `${AnalyticsEventCategories.PRACTICE_MODE} - ${AnalyticsEventCategories.WAITING_ROOM_TO_CAR}`,
            `${AnalyticsEventCategories.PRACTICE_MODE} - ${AnalyticsEvents.ORDIT_TRAINED_CHANGED}`,
            'ordit trained changed to Yes',
          );
      });
    });
  });
  describe('waitingRoomToCarTrainerRegistrationNumberChanged$', () => {
    it('should record an analytic when waitingRoomToCarTrainerRegistrationNumberChanged$ fires', () => {
      // ARRANGE
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      store$.dispatch(PopulateTestCategory(TestCategory.ADI3));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(TrainerRegistrationNumberChanged(123));
      // ACT
      actions$.next(TrainerRegistrationNumberChanged(123));
      // ASSERT
      effects.waitingRoomToCarTrainerRegistrationNumberChanged$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);
        expect(analyticsProviderMock.logEvent)
          .toHaveBeenCalledWith(
            `${AnalyticsEventCategories.PRACTICE_MODE} - ${AnalyticsEventCategories.WAITING_ROOM_TO_CAR}`,
            `${AnalyticsEventCategories.PRACTICE_MODE} - ${AnalyticsEvents.TRAINER_REG_NUMBER_CHANGED}`,
            'trainer registration number changed to 123',
          );
      });
    });
  });
  describe('motInvalidModalPresented$', () => {
    it('should record an analytic when motInvalidModalPresented$ fires', () => {
      // ARRANGE
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      store$.dispatch(PopulateTestCategory(TestCategory.ADI3));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      // ACT
      actions$.next(MotInvalidModalOpened());
      // ASSERT
      effects.motInvalidModalPresented$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);
        expect(analyticsProviderMock.logEvent)
          .toHaveBeenCalledWith(
            `${AnalyticsEventCategories.PRACTICE_MODE} - ${AnalyticsEventCategories.WAITING_ROOM_TO_CAR}`,
            `${AnalyticsEventCategories.PRACTICE_MODE} - ${AnalyticsEvents.CHECK_MOT_STATUS}`,
            'VRN Validation Pop up triggered',
          );
      });
    });
  });
  describe('vrnBlur$', () => {
    it('should record an analytic when vrnBlur$ fires', () => {
      // ARRANGE
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      store$.dispatch(PopulateTestCategory(TestCategory.ADI3));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      // ACT
      actions$.next(VRNBlurred());
      // ASSERT
      effects.vrnBlur$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);
        expect(analyticsProviderMock.logEvent)
          .toHaveBeenCalledWith(
            `${AnalyticsEventCategories.PRACTICE_MODE} - ${AnalyticsEventCategories.WAITING_ROOM_TO_CAR}`,
            `${AnalyticsEventCategories.PRACTICE_MODE} - ${AnalyticsEvents.CHECK_MOT_STATUS}`,
            'VRN entered WRTC',
          );
      });
    });
  });
  describe('motVrnAmendedSelected$', () => {
    it('should record an analytic when motVrnAmendedSelected$ fires', () => {
      // ARRANGE
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      store$.dispatch(PopulateTestCategory(TestCategory.ADI3));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      // ACT
      actions$.next(MotVRNAmendedPopup());
      // ASSERT
      effects.motVrnAmendedSelected$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);
        expect(analyticsProviderMock.logEvent)
          .toHaveBeenCalledWith(
            `${AnalyticsEventCategories.PRACTICE_MODE} - ${AnalyticsEventCategories.WAITING_ROOM_TO_CAR}`,
            `${AnalyticsEventCategories.PRACTICE_MODE} - ${AnalyticsEvents.CHECK_MOT_STATUS}`,
            'VRN Amended on pop up',
          );
      });
    });
  });
  describe('motButtonPressed', () => {
    it('should record an analytic when motButtonPressed fires', () => {
      // ARRANGE
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      store$.dispatch(PopulateTestCategory(TestCategory.ADI3));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      // ACT
      actions$.next(GetMotStatus());
      // ASSERT
      effects.motButtonPressed$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);
        expect(analyticsProviderMock.logEvent)
          .toHaveBeenCalledWith(
            `${AnalyticsEventCategories.PRACTICE_MODE} - ${AnalyticsEventCategories.WAITING_ROOM_TO_CAR}`,
            `${AnalyticsEventCategories.PRACTICE_MODE} - ${AnalyticsEvents.CHECK_MOT_STATUS}`,
            'MOT Button pressed',
          );
      });
    });
  });
  describe('motStatusChanged', () => {
    it('should record an analytic when motStatusChanged$ fires', () => {
      // ARRANGE
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      store$.dispatch(PopulateTestCategory(TestCategory.ADI3));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(MotStatusChanged('Valid'));
      // ACT
      actions$.next(MotStatusChanged('Valid'));
      // ASSERT
      effects.motStatusChanged$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);
        expect(analyticsProviderMock.logEvent)
          .toHaveBeenCalledWith(
            `${AnalyticsEventCategories.PRACTICE_MODE} - ${AnalyticsEventCategories.WAITING_ROOM_TO_CAR}`,
            `${AnalyticsEventCategories.PRACTICE_MODE} - ${AnalyticsEvents.MOT_STATUS_CHANGED}`,
            'mot status: Valid',
          );
      });
    });
  });
  describe('motResponseError', () => {
    it('should record an analytic when motResponseError$ fires', () => {
      // ARRANGE
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      store$.dispatch(PopulateTestCategory(TestCategory.ADI3));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      // ACT
      actions$.next(GetMotStatusFailure(new Error('Some error')));
      // ASSERT
      effects.motResponseError$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);
        expect(analyticsProviderMock.logEvent)
          .toHaveBeenCalledWith(
            `${AnalyticsEventCategories.PRACTICE_MODE} - ${AnalyticsEventCategories.WAITING_ROOM_TO_CAR}`,
            `${AnalyticsEventCategories.PRACTICE_MODE} - ${AnalyticsEvents.MOT_STATUS_CHANGED}`,
            'MOT Status: Some error',
          );
      });
    });
  });
  describe('motInvalidConfirmSelected$', () => {
    it('should record an analytic when motInvalidConfirmSelected$ fires', () => {
      // ARRANGE
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      store$.dispatch(PopulateTestCategory(TestCategory.ADI3));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      // ACT
      actions$.next(MotVRNConfirmed());
      // ASSERT
      effects.motInvalidConfirmSelected$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);
        expect(analyticsProviderMock.logEvent)
          .toHaveBeenCalledWith(
            `${AnalyticsEventCategories.PRACTICE_MODE} - ${AnalyticsEventCategories.WAITING_ROOM_TO_CAR}`,
            `${AnalyticsEventCategories.PRACTICE_MODE} - ${AnalyticsEvents.CHECK_MOT_STATUS}`,
            'VRN Validation confirmed',
          );
      });
    });
  });
  describe('alternativeMotEvidenceProvidedChanged$', () => {
    it('should record an analytic when alternativeMotEvidenceDetailsChanged fires', () => {
      // ARRANGE
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      store$.dispatch(PopulateTestCategory(TestCategory.ADI3));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      // ACT
      actions$.next(AlternativeMotEvidenceProvidedChanged(true));
      // ASSERT
      effects.alternativeMotEvidenceProvidedChanged$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);
        expect(analyticsProviderMock.logEvent)
          .toHaveBeenCalledWith(
            `${AnalyticsEventCategories.PRACTICE_MODE} - ${AnalyticsEventCategories.WAITING_ROOM_TO_CAR}`,
            `${AnalyticsEventCategories.PRACTICE_MODE} - ${AnalyticsEvents.CHECK_MOT_STATUS}`,
            'No Alternative MOT evidence provided',
          );
      });
    });
  });
  describe('alternativeMotEvidenceDetailsChanged$', () => {
    it('should record an analytic when alternativeMotEvidenceDetailsChanged fires', () => {
      // ARRANGE
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      store$.dispatch(PopulateTestCategory(TestCategory.ADI3));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      // ACT
      actions$.next(AlternativeMotEvidenceDetailsChanged('some detail'));
      // ASSERT
      effects.alternativeMotEvidenceDetailsChanged$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);
        expect(analyticsProviderMock.logEvent)
          .toHaveBeenCalledWith(
            `${AnalyticsEventCategories.PRACTICE_MODE} - ${AnalyticsEventCategories.WAITING_ROOM_TO_CAR}`,
            `${AnalyticsEventCategories.PRACTICE_MODE} - ${AnalyticsEvents.CHECK_MOT_STATUS}`,
            'None',
          );
      });
    });
  });
});
