import { TestBed } from '@angular/core/testing';
import { Application } from '@dvsa/mes-journal-schema';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store, StoreModule } from '@ngrx/store';
import { AnalyticsProviderMock } from '@providers/analytics/__mocks__/analytics.mock';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import {
  AnalyticsScreenNames,
  GoogleAnalyticsCustomDimension,
  GoogleAnalyticsEventPrefix,
  GoogleAnalyticsEvents,
  GoogleAnalyticsEventsTitles,
  GoogleAnalyticsEventsValues,
} from '@providers/analytics/analytics.model';
import { AppConfigProviderMock } from '@providers/app-config/__mocks__/app-config.mock';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { end2endPracticeSlotId } from '@shared/mocks/test-slot-ids.mock';
import { ActivityCodes } from '@shared/models/activity-codes';
import { CircuitType } from '@shared/models/circuit-type';
import { StoreModel } from '@shared/models/store.model';
import { candidateMock } from '@store/tests/__mocks__/tests.mock';
import * as activityCodeActions from '@store/tests/activity-code/activity-code.actions';
import { PopulateTestCategory } from '@store/tests/category/category.actions';
import * as applicationReferenceActions from '@store/tests/journal-data/common/application-reference/application-reference.actions';
import { PopulateCandidateDetails } from '@store/tests/journal-data/common/candidate/candidate.actions';
import { MarkAsNonRekey } from '@store/tests/rekey/rekey.actions';
import * as catAMod1TestSummaryActions from '@store/tests/test-summary/cat-a-mod1/test-summary.cat-a-mod1.actions';
import * as catAMod2TestSummaryActions from '@store/tests/test-summary/cat-a-mod2/test-summary.cat-a-mod2.actions';
import * as testSummaryActions from '@store/tests/test-summary/test-summary.actions';
import * as testsActions from '@store/tests/tests.actions';
import { testsReducer } from '@store/tests/tests.reducer';
import { ReplaySubject, firstValueFrom } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';
import * as fakeJournalActions from '../../fake-journal/fake-journal.actions';
import * as officeActions from '../office.actions';
import { OfficeAnalyticsEffects } from '../office.analytics.effects';

describe('OfficeAnalyticsEffects', () => {
  let effects: OfficeAnalyticsEffects;
  let analyticsProviderMock: AnalyticsProvider;
  let actions$: ReplaySubject<Action>;
  let store$: Store<StoreModel>;
  const screenNamePass = AnalyticsScreenNames.PASS_TEST_SUMMARY;
  const screenNameFail = AnalyticsScreenNames.FAIL_TEST_SUMMARY;
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
  });

  describe('officeViewDidEnter', () => {
    it('should call setCurrentPage with pass page and addCustomDimension', async () => {
      store$.dispatch(testsActions.StartTest(123, TestCategory.B));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(activityCodeActions.SetActivityCode(ActivityCodes.PASS));
      store$.dispatch(applicationReferenceActions.PopulateApplicationReference(mockApplication));
      actions$.next(officeActions.OfficeViewDidEnter());
      const result = await firstValueFrom(effects.officeViewDidEnter$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.addGACustomDimension).toHaveBeenCalledWith(
        GoogleAnalyticsCustomDimension.CANDIDATE_ID,
        '1'
      );
      expect(analyticsProviderMock.addGACustomDimension).toHaveBeenCalledWith(
        GoogleAnalyticsCustomDimension.APPLICATION_REFERENCE,
        '123456789'
      );
      expect(analyticsProviderMock.setGACurrentPage).toHaveBeenCalledWith(screenNamePass);
    });
    it('should call setCurrentPage with fail page and addCustomDimension', async () => {
      store$.dispatch(testsActions.StartTest(123, TestCategory.B));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(activityCodeActions.SetActivityCode(ActivityCodes.FAIL));
      store$.dispatch(applicationReferenceActions.PopulateApplicationReference(mockApplication));
      actions$.next(officeActions.OfficeViewDidEnter());
      const result = await firstValueFrom(effects.officeViewDidEnter$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.addGACustomDimension).toHaveBeenCalledWith(
        GoogleAnalyticsCustomDimension.CANDIDATE_ID,
        '1'
      );
      expect(analyticsProviderMock.addGACustomDimension).toHaveBeenCalledWith(
        GoogleAnalyticsCustomDimension.APPLICATION_REFERENCE,
        '123456789'
      );
      expect(analyticsProviderMock.setGACurrentPage).toHaveBeenCalledWith(screenNameFail);
    });
    it('should call setCurrentPage with pass page, practice mode prefix and addCustomDimension', async () => {
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(activityCodeActions.SetActivityCode(ActivityCodes.PASS));
      store$.dispatch(applicationReferenceActions.PopulateApplicationReference(mockApplication));
      actions$.next(officeActions.OfficeViewDidEnter());
      const result = await firstValueFrom(effects.officeViewDidEnter$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.addGACustomDimension).toHaveBeenCalledWith(
        GoogleAnalyticsCustomDimension.CANDIDATE_ID,
        '1'
      );
      expect(analyticsProviderMock.addGACustomDimension).toHaveBeenCalledWith(
        GoogleAnalyticsCustomDimension.APPLICATION_REFERENCE,
        '123456789'
      );
      expect(analyticsProviderMock.setGACurrentPage).toHaveBeenCalledWith(
        `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${screenNamePass}`
      );
    });
    it('should call setCurrentPage with fail page, practice mode prefix and addCustomDimension', async () => {
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(activityCodeActions.SetActivityCode(ActivityCodes.FAIL));
      store$.dispatch(applicationReferenceActions.PopulateApplicationReference(mockApplication));
      actions$.next(officeActions.OfficeViewDidEnter());
      const result = await firstValueFrom(effects.officeViewDidEnter$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.addGACustomDimension).toHaveBeenCalledWith(
        GoogleAnalyticsCustomDimension.CANDIDATE_ID,
        '1'
      );
      expect(analyticsProviderMock.addGACustomDimension).toHaveBeenCalledWith(
        GoogleAnalyticsCustomDimension.APPLICATION_REFERENCE,
        '123456789'
      );
      expect(analyticsProviderMock.setGACurrentPage).toHaveBeenCalledWith(
        `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${screenNameFail}`
      );
    });
  });

  describe('TestStartDateChanged', () => {
    it('should call the logEvent with the previous and new date text', async () => {
      store$.dispatch(testsActions.StartTest(123, TestCategory.B));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(applicationReferenceActions.PopulateApplicationReference(mockApplication));
      const previousStartDate = '2020-12-25T08:10:00';
      const customStartDate = '2021-01-19T08:10:00';
      actions$.next(officeActions.TestStartDateChanged(previousStartDate, customStartDate));
      const result = await firstValueFrom(effects.testStartDateChanged$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.addGACustomDimension).toHaveBeenCalledWith(
        GoogleAnalyticsCustomDimension.CANDIDATE_ID,
        '1'
      );
      expect(analyticsProviderMock.addGACustomDimension).toHaveBeenCalledWith(
        GoogleAnalyticsCustomDimension.APPLICATION_REFERENCE,
        '123456789'
      );
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.DATE_OF_TEST,
        GoogleAnalyticsEventsTitles.CHANGED_FROM,
        '2020-12-25T08:10:00',
        GoogleAnalyticsEventsTitles.CHANGED_TO,
        '2021-01-19T08:10:00'
      );
    });
  });

  describe('savingWriteUpForLaterEffect', () => {
    it('should call logEvent with pass page and addCustomDimension', async () => {
      store$.dispatch(testsActions.StartTest(123, TestCategory.B));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(activityCodeActions.SetActivityCode(ActivityCodes.PASS));
      store$.dispatch(applicationReferenceActions.PopulateApplicationReference(mockApplication));
      actions$.next(officeActions.SavingWriteUpForLater());
      const result = await firstValueFrom(effects.savingWriteUpForLaterEffect$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.addGACustomDimension).toHaveBeenCalledWith(
        GoogleAnalyticsCustomDimension.CANDIDATE_ID,
        '1'
      );
      expect(analyticsProviderMock.addGACustomDimension).toHaveBeenCalledWith(
        GoogleAnalyticsCustomDimension.APPLICATION_REFERENCE,
        '123456789'
      );
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.SAVE_WRITE_UP,
        GoogleAnalyticsEventsTitles.RESULT,
        GoogleAnalyticsEventsValues.PASS
      );
    });
    it('should call logEvent with fail page and addCustomDimension', async () => {
      store$.dispatch(testsActions.StartTest(123, TestCategory.B));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(activityCodeActions.SetActivityCode(ActivityCodes.FAIL));
      store$.dispatch(applicationReferenceActions.PopulateApplicationReference(mockApplication));
      actions$.next(officeActions.SavingWriteUpForLater());
      const result = await firstValueFrom(effects.savingWriteUpForLaterEffect$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.addGACustomDimension).toHaveBeenCalledWith(
        GoogleAnalyticsCustomDimension.CANDIDATE_ID,
        '1'
      );
      expect(analyticsProviderMock.addGACustomDimension).toHaveBeenCalledWith(
        GoogleAnalyticsCustomDimension.APPLICATION_REFERENCE,
        '123456789'
      );
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.SAVE_WRITE_UP,
        GoogleAnalyticsEventsTitles.RESULT,
        GoogleAnalyticsEventsValues.FAIL
      );
    });
    it('should call logEvent with pass page, practice mode prefix and addCustomDimension', async () => {
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(activityCodeActions.SetActivityCode(ActivityCodes.PASS));
      store$.dispatch(applicationReferenceActions.PopulateApplicationReference(mockApplication));
      actions$.next(officeActions.SavingWriteUpForLater());
      const result = await firstValueFrom(effects.savingWriteUpForLaterEffect$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.addGACustomDimension).toHaveBeenCalledWith(
        GoogleAnalyticsCustomDimension.CANDIDATE_ID,
        '1'
      );
      expect(analyticsProviderMock.addGACustomDimension).toHaveBeenCalledWith(
        GoogleAnalyticsCustomDimension.APPLICATION_REFERENCE,
        '123456789'
      );
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.SAVE_WRITE_UP,
        GoogleAnalyticsEventsTitles.RESULT,
        GoogleAnalyticsEventsValues.PASS
      );
    });
    it('should call logEvent with fail page, practice mode prefix and addCustomDimension', async () => {
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(activityCodeActions.SetActivityCode(ActivityCodes.FAIL));
      store$.dispatch(applicationReferenceActions.PopulateApplicationReference(mockApplication));
      actions$.next(officeActions.SavingWriteUpForLater());
      const result = await firstValueFrom(effects.savingWriteUpForLaterEffect$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.addGACustomDimension).toHaveBeenCalledWith(
        GoogleAnalyticsCustomDimension.CANDIDATE_ID,
        '1'
      );
      expect(analyticsProviderMock.addGACustomDimension).toHaveBeenCalledWith(
        GoogleAnalyticsCustomDimension.APPLICATION_REFERENCE,
        '123456789'
      );
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.SAVE_WRITE_UP,
        GoogleAnalyticsEventsTitles.RESULT,
        GoogleAnalyticsEventsValues.FAIL
      );
    });
  });

  describe('validationErrorEffect', () => {
    it('should call logError with pass with a severity', async () => {
      store$.dispatch(testsActions.StartTest(123, TestCategory.B));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(activityCodeActions.SetActivityCode(ActivityCodes.PASS));
      actions$.next(officeActions.OfficeValidationError('faultComment-simple-dangerous-useOfMirrorsSignalling'));
      const result = await firstValueFrom(effects.validationErrorEffect$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.VALIDATION_ERROR,
        GoogleAnalyticsEventsTitles.BLANK_FIELD,
        'useOfMirrorsSignalling',
        GoogleAnalyticsEventsTitles.SEVERITY,
        GoogleAnalyticsEventsValues.DANGEROUS
      );
    });
    it('should call logError with fail with a severity', async () => {
      store$.dispatch(testsActions.StartTest(123, TestCategory.B));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(activityCodeActions.SetActivityCode(ActivityCodes.FAIL));
      actions$.next(officeActions.OfficeValidationError('faultComment-simple-dangerous-useOfMirrorsSignalling'));
      const result = await firstValueFrom(effects.validationErrorEffect$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.VALIDATION_ERROR,
        GoogleAnalyticsEventsTitles.BLANK_FIELD,
        'useOfMirrorsSignalling',
        GoogleAnalyticsEventsTitles.SEVERITY,
        GoogleAnalyticsEventsValues.DANGEROUS
      );
    });
    it('should call logError with pass without a severity', async () => {
      store$.dispatch(testsActions.StartTest(123, TestCategory.B));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(activityCodeActions.SetActivityCode(ActivityCodes.PASS));
      actions$.next(officeActions.OfficeValidationError('useOfMirrorsSignalling'));
      const result = await firstValueFrom(effects.validationErrorEffect$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.VALIDATION_ERROR,
        GoogleAnalyticsEventsTitles.BLANK_FIELD,
        'useOfMirrorsSignalling'
      );
    });
    it('should call logError with fail without a severity', async () => {
      store$.dispatch(testsActions.StartTest(123, TestCategory.B));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(activityCodeActions.SetActivityCode(ActivityCodes.FAIL));
      actions$.next(officeActions.OfficeValidationError('useOfMirrorsSignalling'));
      const result = await firstValueFrom(effects.validationErrorEffect$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.VALIDATION_ERROR,
        GoogleAnalyticsEventsTitles.BLANK_FIELD,
        'useOfMirrorsSignalling'
      );
    });
    it(
      'should call logError with pass with a an unknown severity ' +
        'if the errorMessage does not follow the required formatting',
      async () => {
        store$.dispatch(testsActions.StartTest(123, TestCategory.B));
        store$.dispatch(PopulateCandidateDetails(candidateMock));
        store$.dispatch(activityCodeActions.SetActivityCode(ActivityCodes.PASS));
        actions$.next(officeActions.OfficeValidationError('faultComment-simple-useOfMirrorsSignalling'));
        const result = await firstValueFrom(effects.validationErrorEffect$);
        expect(result.type === AnalyticRecorded.type).toBe(true);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.VALIDATION_ERROR,
          GoogleAnalyticsEventsTitles.BLANK_FIELD,
          'useOfMirrorsSignalling',
          GoogleAnalyticsEventsTitles.SEVERITY,
          GoogleAnalyticsEventsValues.UNKNOWN
        );
      }
    );
    it(
      'should call logError with pass with a an unknown severity and control name' +
        'if the errorMessage is an empty string',
      async () => {
        store$.dispatch(testsActions.StartTest(123, TestCategory.B));
        store$.dispatch(PopulateCandidateDetails(candidateMock));
        store$.dispatch(activityCodeActions.SetActivityCode(ActivityCodes.PASS));
        actions$.next(officeActions.OfficeValidationError(''));
        const result = await firstValueFrom(effects.validationErrorEffect$);
        expect(result.type === AnalyticRecorded.type).toBe(true);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.VALIDATION_ERROR,
          GoogleAnalyticsEventsTitles.BLANK_FIELD,
          GoogleAnalyticsEventsValues.UNKNOWN
        );
      }
    );
    it('should call logError with pass, prefixed with practice mode', async () => {
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(activityCodeActions.SetActivityCode(ActivityCodes.PASS));
      actions$.next(officeActions.OfficeValidationError('faultComment-simple-dangerous-useOfMirrorsSignalling'));
      const result = await firstValueFrom(effects.validationErrorEffect$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `PM_${GoogleAnalyticsEvents.VALIDATION_ERROR}`,
        GoogleAnalyticsEventsTitles.BLANK_FIELD,
        'useOfMirrorsSignalling',
        GoogleAnalyticsEventsTitles.SEVERITY,
        GoogleAnalyticsEventsValues.DANGEROUS
      );
    });
    it('should call logError with fail, prefixed with practice mode', async () => {
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(activityCodeActions.SetActivityCode(ActivityCodes.FAIL));
      actions$.next(officeActions.OfficeValidationError('faultComment-simple-dangerous-useOfMirrorsSignalling'));
      const result = await firstValueFrom(effects.validationErrorEffect$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `PM_${GoogleAnalyticsEvents.VALIDATION_ERROR}`,
        GoogleAnalyticsEventsTitles.BLANK_FIELD,
        'useOfMirrorsSignalling',
        GoogleAnalyticsEventsTitles.SEVERITY,
        GoogleAnalyticsEventsValues.DANGEROUS
      );
    });
  });

  describe('completeTest', () => {
    it('should log an event COMPLETE_TEST event when the test is not a rekey', async () => {
      store$.dispatch(testsActions.StartTest(123, TestCategory.B));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(activityCodeActions.SetActivityCode(ActivityCodes.PASS));
      store$.dispatch(applicationReferenceActions.PopulateApplicationReference(mockApplication));
      actions$.next(officeActions.CompleteTest());
      const result = await firstValueFrom(effects.completeTest$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.UPLOAD_CONFIRMED,
        GoogleAnalyticsEventsTitles.RESULT,
        GoogleAnalyticsEventsValues.PASS
      );
      expect(analyticsProviderMock.addGACustomDimension).toHaveBeenCalledWith(
        GoogleAnalyticsCustomDimension.CANDIDATE_ID,
        '1'
      );
      expect(analyticsProviderMock.addGACustomDimension).toHaveBeenCalledWith(
        GoogleAnalyticsCustomDimension.APPLICATION_REFERENCE,
        '123456789'
      );
    });
    it('should log an event COMPLETE_TEST event when the test with practice mode prefix', async () => {
      store$.dispatch(testsActions.StartTest(123, TestCategory.B));
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(activityCodeActions.SetActivityCode(ActivityCodes.PASS));
      store$.dispatch(applicationReferenceActions.PopulateApplicationReference(mockApplication));
      actions$.next(officeActions.CompleteTest());
      const result = await firstValueFrom(effects.completeTest$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${GoogleAnalyticsEvents.UPLOAD_CONFIRMED}`,
        GoogleAnalyticsEventsTitles.RESULT,
        GoogleAnalyticsEventsValues.PASS
      );
      expect(analyticsProviderMock.addGACustomDimension).toHaveBeenCalledWith(
        GoogleAnalyticsCustomDimension.CANDIDATE_ID,
        '1'
      );
      expect(analyticsProviderMock.addGACustomDimension).toHaveBeenCalledWith(
        GoogleAnalyticsCustomDimension.APPLICATION_REFERENCE,
        '123456789'
      );
    });
  });

  describe('circuitChanged$', () => {
    it('should log a CIRCUIT_TYPE_CHANGED event', async () => {
      store$.dispatch(testsActions.StartTest(123, TestCategory.EUAM1));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(activityCodeActions.SetActivityCode(ActivityCodes.PASS));
      store$.dispatch(applicationReferenceActions.PopulateApplicationReference(mockApplication));
      store$.dispatch(MarkAsNonRekey());
      actions$.next(catAMod1TestSummaryActions.CircuitTypeChanged(CircuitType.Left));
      const result = await firstValueFrom(effects.setCircuit$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.CIRCUIT_CHANGED,
        GoogleAnalyticsEventsTitles.DIRECTION,
        GoogleAnalyticsEventsValues.LEFT
      );
    });
  });

  describe('independentDrivingTypeChanged$', () => {
    it('should log a INDEPENDENT_DRIVING_TYPE_CHANGED event', async () => {
      store$.dispatch(testsActions.StartTest(123, TestCategory.EUAM2));
      store$.dispatch(PopulateTestCategory(TestCategory.EUAM2));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(activityCodeActions.SetActivityCode(ActivityCodes.PASS));
      store$.dispatch(applicationReferenceActions.PopulateApplicationReference(mockApplication));
      store$.dispatch(MarkAsNonRekey());
      actions$.next(testSummaryActions.IndependentDrivingTypeChanged('Sat nav'));
      const result = await firstValueFrom(effects.setIndependentDrivingType$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.INDEPENDENT_DRIVING,
        GoogleAnalyticsEventsTitles.DRIVING_TYPE,
        GoogleAnalyticsEventsValues.SAT_NAV
      );
    });
  });

  describe('modeOfTransportChanged$', () => {
    it('should log a MODE_OF_TRANSPORT_CHANGED event', async () => {
      store$.dispatch(testsActions.StartTest(123, TestCategory.EUAM2));
      store$.dispatch(PopulateTestCategory(TestCategory.EUAM2));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(activityCodeActions.SetActivityCode(ActivityCodes.PASS));
      store$.dispatch(applicationReferenceActions.PopulateApplicationReference(mockApplication));
      actions$.next(catAMod2TestSummaryActions.ModeOfTransportChanged('Car to bike'));
      const result = await firstValueFrom(effects.setModeOfTransport$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.TRANSPORT_MODE,
        GoogleAnalyticsEventsTitles.CHANGED_TO,
        GoogleAnalyticsEventsValues.CAR_TO_BIKE
      );
    });
  });
});
