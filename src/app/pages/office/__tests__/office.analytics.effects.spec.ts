import { TestBed, waitForAsync } from '@angular/core/testing';
import { ReplaySubject } from 'rxjs';
import { Store, StoreModule } from '@ngrx/store';
import { provideMockActions } from '@ngrx/effects/testing';
import * as catAMod1TestSummaryActions from '@store/tests/test-summary/cat-a-mod1/test-summary.cat-a-mod1.actions';
import * as catAMod2TestSummaryActions from '@store/tests/test-summary/cat-a-mod2/test-summary.cat-a-mod2.actions';
import * as testSummaryActions from '@store/tests/test-summary/test-summary.actions';
import { Application } from '@dvsa/mes-journal-schema';
import { testsReducer } from '@store/tests/tests.reducer';
import * as testsActions from '@store/tests/tests.actions';
import { PopulateCandidateDetails } from '@store/tests/journal-data/common/candidate/candidate.actions';
import * as applicationReferenceActions
  from '@store/tests/journal-data/common/application-reference/application-reference.actions';
import * as activityCodeActions from '@store/tests/activity-code/activity-code.actions';
import { candidateMock } from '@store/tests/__mocks__/tests.mock';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { PopulateTestCategory } from '@store/tests/category/category.actions';
import { CircuitType } from '@shared/models/circuit-type';
import { ActivityCodes } from '@shared/models/activity-codes';
import { end2endPracticeSlotId } from '@shared/mocks/test-slot-ids.mock';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import { StoreModel } from '@shared/models/store.model';
import {
  AnalyticsDimensionIndices,
  AnalyticsErrorTypes,
  AnalyticsEventCategories,
  AnalyticsEvents,
  AnalyticsScreenNames,
} from '@providers/analytics/analytics.model';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticsProviderMock } from '@providers/analytics/__mocks__/analytics.mock';
import { MarkAsNonRekey } from '@store/tests/rekey/rekey.actions';
import { AppConfigProviderMock } from '@providers/app-config/__mocks__/app-config.mock';
import { AppConfigProvider } from '@providers/app-config/app-config';
import * as officeActions from '../office.actions';
import { OfficeAnalyticsEffects } from '../office.analytics.effects';
import * as fakeJournalActions from '../../fake-journal/fake-journal.actions';

describe('OfficeAnalyticsEffects', () => {
  let effects: OfficeAnalyticsEffects;
  let analyticsProviderMock;
  let actions$: ReplaySubject<any>;
  let store$: Store<StoreModel>;
  const screenNamePass = AnalyticsScreenNames.PASS_TEST_SUMMARY;
  const screenNameFail = AnalyticsScreenNames.FAIL_TEST_SUMMARY;
  // eslint-disable-next-line max-len
  const screenNamePracticeModePass = `${AnalyticsEventCategories.PRACTICE_MODE} - ${AnalyticsScreenNames.PASS_TEST_SUMMARY}`;
  // eslint-disable-next-line max-len
  const screenNamePracticeModeFail = `${AnalyticsEventCategories.PRACTICE_MODE} - ${AnalyticsScreenNames.FAIL_TEST_SUMMARY}`;
  const mockApplication: Application = {
    applicationId: 123456,
    bookingSequence: 78,
    checkDigit: 9,
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          tests: testsReducer,
        }),
      ],
      providers: [
        OfficeAnalyticsEffects,
        {
          provide: AnalyticsProvider,
          useClass: AnalyticsProviderMock,
        },
        {
          provide: AppConfigProvider,
          useClass: AppConfigProviderMock,
        },
        provideMockActions(() => actions$),
        Store,
      ],
    });

    actions$ = new ReplaySubject(1);
    effects = TestBed.inject(OfficeAnalyticsEffects);
    analyticsProviderMock = TestBed.inject(AnalyticsProvider);
    store$ = TestBed.inject(Store);
    spyOn(analyticsProviderMock, 'logEvent');
  }));

  describe('officeViewDidEnter', () => {
    it('should call setCurrentPage with pass page and addCustomDimension', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123, TestCategory.B));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(activityCodeActions.SetActivityCode(ActivityCodes.PASS));
      store$.dispatch(applicationReferenceActions.PopulateApplicationReference(mockApplication));
      // ACT
      actions$.next(officeActions.OfficeViewDidEnter());
      // ASSERT
      effects.officeViewDidEnter$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);
        expect(analyticsProviderMock.addCustomDimension)
          .toHaveBeenCalledWith(AnalyticsDimensionIndices.CANDIDATE_ID, '1');
        expect(analyticsProviderMock.addCustomDimension)
          .toHaveBeenCalledWith(AnalyticsDimensionIndices.APPLICATION_REFERENCE, '123456789');
        expect(analyticsProviderMock.setCurrentPage)
          .toHaveBeenCalledWith(screenNamePass);
        done();
      });
    });
    it('should call setCurrentPage with fail page and addCustomDimension', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123, TestCategory.B));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(activityCodeActions.SetActivityCode(ActivityCodes.FAIL));
      store$.dispatch(applicationReferenceActions.PopulateApplicationReference(mockApplication));
      // ACT
      actions$.next(officeActions.OfficeViewDidEnter());
      // ASSERT
      effects.officeViewDidEnter$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);
        expect(analyticsProviderMock.addCustomDimension)
          .toHaveBeenCalledWith(AnalyticsDimensionIndices.CANDIDATE_ID, '1');
        expect(analyticsProviderMock.addCustomDimension)
          .toHaveBeenCalledWith(AnalyticsDimensionIndices.APPLICATION_REFERENCE, '123456789');
        expect(analyticsProviderMock.setCurrentPage)
          .toHaveBeenCalledWith(screenNameFail);
        done();
      });
    });
    it('should call setCurrentPage with pass page, practice mode prefix and addCustomDimension', (done) => {
      // ARRANGE
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(activityCodeActions.SetActivityCode(ActivityCodes.PASS));
      store$.dispatch(applicationReferenceActions.PopulateApplicationReference(mockApplication));
      // ACT
      actions$.next(officeActions.OfficeViewDidEnter());
      // ASSERT
      effects.officeViewDidEnter$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);
        expect(analyticsProviderMock.addCustomDimension)
          .toHaveBeenCalledWith(AnalyticsDimensionIndices.CANDIDATE_ID, '1');
        expect(analyticsProviderMock.addCustomDimension)
          .toHaveBeenCalledWith(AnalyticsDimensionIndices.APPLICATION_REFERENCE, '123456789');
        expect(analyticsProviderMock.setCurrentPage)
          .toHaveBeenCalledWith(screenNamePracticeModePass);
        done();
      });
    });
    it('should call setCurrentPage with fail page, practice mode prefix and addCustomDimension', (done) => {
      // ARRANGE
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(activityCodeActions.SetActivityCode(ActivityCodes.FAIL));
      store$.dispatch(applicationReferenceActions.PopulateApplicationReference(mockApplication));
      // ACT
      actions$.next(officeActions.OfficeViewDidEnter());
      // ASSERT
      effects.officeViewDidEnter$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);
        expect(analyticsProviderMock.addCustomDimension)
          .toHaveBeenCalledWith(AnalyticsDimensionIndices.CANDIDATE_ID, '1');
        expect(analyticsProviderMock.addCustomDimension)
          .toHaveBeenCalledWith(AnalyticsDimensionIndices.APPLICATION_REFERENCE, '123456789');
        expect(analyticsProviderMock.setCurrentPage)
          .toHaveBeenCalledWith(screenNamePracticeModeFail);
        done();
      });
    });
  });

  describe('dateOfTestChangedEffect', () => {
    it('should call the logEvent with the previous and new date text', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123, TestCategory.B));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(applicationReferenceActions.PopulateApplicationReference(mockApplication));

      const previousStartDate = '2020-12-25T08:10:00';
      const customStartDate = '2021-01-19T08:10:00';

      // ACT
      actions$.next(officeActions.TestStartDateChanged(previousStartDate, customStartDate));

      // ASSERT
      effects.testStartDateChanged$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);
        expect(analyticsProviderMock.addCustomDimension)
          .toHaveBeenCalledWith(AnalyticsDimensionIndices.CANDIDATE_ID, '1');
        expect(analyticsProviderMock.addCustomDimension)
          .toHaveBeenCalledWith(AnalyticsDimensionIndices.APPLICATION_REFERENCE, '123456789');

        expect(analyticsProviderMock.logEvent)
          .toHaveBeenCalledWith(
            AnalyticsEventCategories.OFFICE,
            AnalyticsEvents.DATE_OF_TEST_CHANGED,
            'previous date: 2020-12-25T08:10:00; new date: 2021-01-19T08:10:00',
          );
        done();
      });
    });
  });

  describe('savingWriteUpForLaterEffect', () => {
    it('should call logEvent with pass page and addCustomDimension', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123, TestCategory.B));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(activityCodeActions.SetActivityCode(ActivityCodes.PASS));
      store$.dispatch(applicationReferenceActions.PopulateApplicationReference(mockApplication));
      // ACT
      actions$.next(officeActions.SavingWriteUpForLater());
      // ASSERT
      effects.savingWriteUpForLaterEffect$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);
        expect(analyticsProviderMock.addCustomDimension)
          .toHaveBeenCalledWith(AnalyticsDimensionIndices.CANDIDATE_ID, '1');
        expect(analyticsProviderMock.addCustomDimension)
          .toHaveBeenCalledWith(AnalyticsDimensionIndices.APPLICATION_REFERENCE, '123456789');
        expect(analyticsProviderMock.logEvent)
          .toHaveBeenCalledWith(
            AnalyticsEventCategories.POST_TEST,
            AnalyticsEvents.SAVE_WRITE_UP,
            'Pass',
          );
        done();
      });
    });
    it('should call logEvent with fail page and addCustomDimension', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123, TestCategory.B));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(activityCodeActions.SetActivityCode(ActivityCodes.FAIL));
      store$.dispatch(applicationReferenceActions.PopulateApplicationReference(mockApplication));
      // ACT
      actions$.next(officeActions.SavingWriteUpForLater());
      // ASSERT
      effects.savingWriteUpForLaterEffect$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);
        expect(analyticsProviderMock.addCustomDimension)
          .toHaveBeenCalledWith(AnalyticsDimensionIndices.CANDIDATE_ID, '1');
        expect(analyticsProviderMock.addCustomDimension)
          .toHaveBeenCalledWith(AnalyticsDimensionIndices.APPLICATION_REFERENCE, '123456789');
        expect(analyticsProviderMock.logEvent)
          .toHaveBeenCalledWith(
            AnalyticsEventCategories.POST_TEST,
            AnalyticsEvents.SAVE_WRITE_UP,
            'Fail',
          );
        done();
      });
    });
    it('should call logEvent with pass page, practice mode prefix and addCustomDimension', (done) => {
      // ARRANGE
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(activityCodeActions.SetActivityCode(ActivityCodes.PASS));
      store$.dispatch(applicationReferenceActions.PopulateApplicationReference(mockApplication));
      // ACT
      actions$.next(officeActions.SavingWriteUpForLater());
      // ASSERT
      effects.savingWriteUpForLaterEffect$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);
        expect(analyticsProviderMock.addCustomDimension)
          .toHaveBeenCalledWith(AnalyticsDimensionIndices.CANDIDATE_ID, '1');
        expect(analyticsProviderMock.addCustomDimension)
          .toHaveBeenCalledWith(AnalyticsDimensionIndices.APPLICATION_REFERENCE, '123456789');
        expect(analyticsProviderMock.logEvent)
          .toHaveBeenCalledWith(
            `${AnalyticsEventCategories.PRACTICE_MODE} - ${AnalyticsEventCategories.POST_TEST}`,
            `${AnalyticsEventCategories.PRACTICE_MODE} - ${AnalyticsEvents.SAVE_WRITE_UP}`,
            'Pass',
          );
        done();
      });
    });
    it('should call logEvent with fail page, practice mode prefix and addCustomDimension', (done) => {
      // ARRANGE
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(activityCodeActions.SetActivityCode(ActivityCodes.FAIL));
      store$.dispatch(applicationReferenceActions.PopulateApplicationReference(mockApplication));
      // ACT
      actions$.next(officeActions.SavingWriteUpForLater());
      // ASSERT
      effects.savingWriteUpForLaterEffect$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);
        expect(analyticsProviderMock.addCustomDimension)
          .toHaveBeenCalledWith(AnalyticsDimensionIndices.CANDIDATE_ID, '1');
        expect(analyticsProviderMock.addCustomDimension)
          .toHaveBeenCalledWith(AnalyticsDimensionIndices.APPLICATION_REFERENCE, '123456789');
        expect(analyticsProviderMock.logEvent)
          .toHaveBeenCalledWith(
            `${AnalyticsEventCategories.PRACTICE_MODE} - ${AnalyticsEventCategories.POST_TEST}`,
            `${AnalyticsEventCategories.PRACTICE_MODE} - ${AnalyticsEvents.SAVE_WRITE_UP}`,
            'Fail',
          );
        done();
      });
    });
  });

  describe('validationErrorEffect', () => {
    it('should call logError with pass', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123, TestCategory.B));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(activityCodeActions.SetActivityCode(ActivityCodes.PASS));
      // ACT
      actions$.next(officeActions.OfficeValidationError('error message'));
      // ASSERT
      effects.validationErrorEffect$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);
        expect(analyticsProviderMock.logError)
          .toHaveBeenCalledWith(`${AnalyticsErrorTypes.VALIDATION_ERROR} (${screenNamePass})`,
            'error message');
        done();
      });
    });
    it('should call logError with fail', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123, TestCategory.B));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(activityCodeActions.SetActivityCode(ActivityCodes.FAIL));
      // ACT
      actions$.next(officeActions.OfficeValidationError('error message'));
      // ASSERT
      effects.validationErrorEffect$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);
        expect(analyticsProviderMock.logError)
          .toHaveBeenCalledWith(`${AnalyticsErrorTypes.VALIDATION_ERROR} (${screenNameFail})`,
            'error message');
        done();
      });
    });
    it('should call logError with pass, prefixed with practice mode', (done) => {
      // ARRANGE
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(activityCodeActions.SetActivityCode(ActivityCodes.PASS));
      // ACT
      actions$.next(officeActions.OfficeValidationError('error message'));
      // ASSERT
      effects.validationErrorEffect$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);
        expect(analyticsProviderMock.logError)
          .toHaveBeenCalledWith(`${AnalyticsErrorTypes.VALIDATION_ERROR} (${screenNamePracticeModePass})`,
            'error message');
        done();
      });
    });
    it('should call logError with fail, prefixed with practice mode', (done) => {
      // ARRANGE
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(activityCodeActions.SetActivityCode(ActivityCodes.FAIL));
      // ACT
      actions$.next(officeActions.OfficeValidationError('error message'));
      // ASSERT
      effects.validationErrorEffect$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);
        expect(analyticsProviderMock.logError)
          .toHaveBeenCalledWith(`${AnalyticsErrorTypes.VALIDATION_ERROR} (${screenNamePracticeModeFail})`,
            'error message');
        done();
      });
    });
  });

  describe('completeTest', () => {
    it('should log an event COMPLETE_TEST event when the test is not a rekey', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123, TestCategory.B));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(activityCodeActions.SetActivityCode(ActivityCodes.PASS));
      store$.dispatch(applicationReferenceActions.PopulateApplicationReference(mockApplication));
      // ACT
      actions$.next(officeActions.CompleteTest());
      // ASSERT
      effects.completeTest$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);
        expect(analyticsProviderMock.logEvent)
          .toHaveBeenCalledWith(
            AnalyticsEventCategories.POST_TEST,
            AnalyticsEvents.CONFIRM_UPLOAD,
            'Upload confirmed - Pass',
          );
        expect(analyticsProviderMock.addCustomDimension)
          .toHaveBeenCalledWith(AnalyticsDimensionIndices.CANDIDATE_ID, '1');
        expect(analyticsProviderMock.addCustomDimension)
          .toHaveBeenCalledWith(AnalyticsDimensionIndices.APPLICATION_REFERENCE, '123456789');
        done();
      });
    });
  });

  describe('circuitChanged$', () => {
    it('should log a CIRCUIT_TYPE_CHANGED event', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123, TestCategory.EUAM1));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(activityCodeActions.SetActivityCode(ActivityCodes.PASS));
      store$.dispatch(applicationReferenceActions.PopulateApplicationReference(mockApplication));
      store$.dispatch(MarkAsNonRekey());
      // ACT
      actions$.next(catAMod1TestSummaryActions.CircuitTypeChanged(CircuitType.Left));
      // ASSERT
      effects.setCircuit$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);
        expect(analyticsProviderMock.logEvent)
          .toHaveBeenCalledWith(
            AnalyticsEventCategories.OFFICE,
            AnalyticsEvents.CIRCUIT_CHANGED,
            `Circuit type ${CircuitType.Left} selected`,
          );
        done();
      });
    });
  });

  describe('independentDrivingTypeChanged$', () => {
    it('should log a INDEPENDENT_DRIVING_TYPE_CHANGED event', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123, TestCategory.EUAM2));
      store$.dispatch(PopulateTestCategory(TestCategory.EUAM2));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(activityCodeActions.SetActivityCode(ActivityCodes.PASS));
      store$.dispatch(applicationReferenceActions.PopulateApplicationReference(mockApplication));
      store$.dispatch(MarkAsNonRekey());
      // ACT
      actions$.next(testSummaryActions.IndependentDrivingTypeChanged('Sat nav'));
      // ASSERT
      effects.setIndependentDrivingType$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);
        expect(analyticsProviderMock.logEvent)
          .toHaveBeenCalledWith(
            AnalyticsEventCategories.OFFICE,
            AnalyticsEvents.INDEPENDENT_DRIVING_TYPE_CHANGED,
            'Sat nav selected',
          );
        done();
      });
    });
  });

  describe('modeOfTransportChanged$', () => {
    it('should log a MODE_OF_TRANSPORT_CHANGED event', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123, TestCategory.EUAM2));
      store$.dispatch(PopulateTestCategory(TestCategory.EUAM2));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(activityCodeActions.SetActivityCode(ActivityCodes.PASS));
      store$.dispatch(applicationReferenceActions.PopulateApplicationReference(mockApplication));
      // ACT
      actions$.next(catAMod2TestSummaryActions.ModeOfTransportChanged('Car to bike'));
      // ASSERT
      effects.setModeOfTransport$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type)
          .toBe(true);
        expect(analyticsProviderMock.logEvent)
          .toHaveBeenCalledWith(
            AnalyticsEventCategories.OFFICE,
            AnalyticsEvents.MODE_OF_TRANSPORT_CHANGED,
            'Car to bike selected',
          );
        done();
      });
    });
  });
});
