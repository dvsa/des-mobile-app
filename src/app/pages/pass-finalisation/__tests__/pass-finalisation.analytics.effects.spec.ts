import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store, StoreModule } from '@ngrx/store';
import { CAT_B } from '@pages/page-names.constants';
import { AnalyticsProviderMock } from '@providers/analytics/__mocks__/analytics.mock';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticNotRecorded, AnalyticRecorded } from '@providers/analytics/analytics.actions';
import {
  AnalyticsScreenNames,
  GoogleAnalyticsEventPrefix,
  GoogleAnalyticsEvents,
  GoogleAnalyticsEventsTitles,
  GoogleAnalyticsEventsValues,
} from '@providers/analytics/analytics.model';
import { AppConfigProviderMock } from '@providers/app-config/__mocks__/app-config.mock';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { end2endPracticeSlotId } from '@shared/mocks/test-slot-ids.mock';
import { ActivityCodes } from '@shared/models/activity-codes';
import { StoreModel } from '@shared/models/store.model';
import { TransmissionType } from '@shared/models/transmission-type';
import { candidateMock } from '@store/tests/__mocks__/tests.mock';
import { SetActivityCode } from '@store/tests/activity-code/activity-code.actions';
import * as commsActions from '@store/tests/communication-preferences/communication-preferences.actions';
import { Language } from '@store/tests/communication-preferences/communication-preferences.model';
import { PopulateCandidateDetails } from '@store/tests/journal-data/common/candidate/candidate.actions';
import * as passCompletionActions from '@store/tests/pass-completion/pass-completion.actions';
import * as testSummaryActions from '@store/tests/test-summary/test-summary.actions';
import * as testsActions from '@store/tests/tests.actions';
import { testsReducer } from '@store/tests/tests.reducer';
import * as vehicleDetailsActions from '@store/tests/vehicle-details/vehicle-details.actions';
import { ReplaySubject, firstValueFrom } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';
import * as fakeJournalActions from '../../fake-journal/fake-journal.actions';
import * as passFinalisationActions from '../pass-finalisation.actions';
import { PassFinalisationAnalyticsEffects } from '../pass-finalisation.analytics.effects';

describe('PassFinalisationAnalyticsEffects', () => {
  let effects: PassFinalisationAnalyticsEffects;
  let analyticsProviderMock: AnalyticsProvider;
  let actions$: ReplaySubject<Action>;
  let store$: Store<StoreModel>;
  const screenName = AnalyticsScreenNames.PASS_FINALISATION;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          tests: testsReducer,
        }),
      ],
      providers: [
        PassFinalisationAnalyticsEffects,
        {
          provide: AnalyticsProvider,
          useClass: AnalyticsProviderMock,
        },
        {
          provide: Router,
          useValue: { url: `/${CAT_B.PASS_FINALISATION_PAGE}` },
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
    effects = TestBed.inject(PassFinalisationAnalyticsEffects);
    analyticsProviderMock = TestBed.inject(AnalyticsProvider);
    store$ = TestBed.inject(Store);
  });

  describe('passFinalisationViewDidEnter', () => {
    it('should call setCurrentPage and addCustomDimension', async () => {
      store$.dispatch(testsActions.StartTest(123, TestCategory.B));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      actions$.next(passFinalisationActions.PassFinalisationViewDidEnter());
      const result = await firstValueFrom(effects.passFinalisationViewDidEnter$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.setGACurrentPage).toHaveBeenCalledWith(screenName);
    });
    it('should call setCurrentPage with practice mode prefix and addCustomDimension', async () => {
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      actions$.next(passFinalisationActions.PassFinalisationViewDidEnter());
      const result = await firstValueFrom(effects.passFinalisationViewDidEnter$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.setGACurrentPage).toHaveBeenCalledWith(
        `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${screenName}`
      );
    });
  });

  describe('validationErrorEffect', () => {
    it('should call logError', async () => {
      store$.dispatch(testsActions.StartTest(123, TestCategory.B));
      actions$.next(passFinalisationActions.PassFinalisationValidationError('error is blank'));
      const result = await firstValueFrom(effects.validationErrorEffect$);
      expect(result.type === AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.VALIDATION_ERROR,
        GoogleAnalyticsEventsTitles.BLANK_FIELD,
        'error'
      );
    });

    it('should call logError with pass, prefixed with practice mode', async () => {
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      actions$.next(passFinalisationActions.PassFinalisationValidationError('error message'));
      const result = await firstValueFrom(effects.validationErrorEffect$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.VALIDATION_ERROR,
        GoogleAnalyticsEventsTitles.BLANK_FIELD,
        'error'
      );
    });
  });
  describe('code78PresentEffect', () => {
    it('should call logEvent', async () => {
      store$.dispatch(testsActions.StartTest(123, TestCategory.C));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      actions$.next(passCompletionActions.Code78Present());
      const result = await firstValueFrom(effects.code78PresentEffect$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.CODE78,
        GoogleAnalyticsEventsTitles.TRANSMISSION_TYPE,
        GoogleAnalyticsEventsValues.AUTOMATIC
      );
    });
  });
  describe('code78NotPresentEffect', () => {
    it('should call logEvent', async () => {
      store$.dispatch(testsActions.StartTest(123, TestCategory.C));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      actions$.next(passCompletionActions.Code78NotPresent());
      const result = await firstValueFrom(effects.code78NotPresentEffect$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.CODE78,
        GoogleAnalyticsEventsTitles.TRANSMISSION_TYPE,
        GoogleAnalyticsEventsValues.MANUAL
      );
    });
  });
  describe('provisionalLicenseNotReceived', () => {
    it('should call logEvent', async () => {
      store$.dispatch(testsActions.StartTest(123, TestCategory.C));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      actions$.next(passCompletionActions.ProvisionalLicenseNotReceived());
      const result = await firstValueFrom(effects.provisionalLicenseNotReceived$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.LICENCE_RECEIVED,
        GoogleAnalyticsEventsTitles.RECEIVED,
        GoogleAnalyticsEventsValues.NO
      );
    });
    it('should call logEvent with practice mode prefix', async () => {
      store$.dispatch(testsActions.StartTest(123, TestCategory.C));
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      actions$.next(passCompletionActions.ProvisionalLicenseNotReceived());
      const result = await firstValueFrom(effects.provisionalLicenseNotReceived$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${GoogleAnalyticsEvents.LICENCE_RECEIVED}`,
        GoogleAnalyticsEventsTitles.RECEIVED,
        GoogleAnalyticsEventsValues.NO
      );
    });
  });
  describe('provisionalLicenseReceived', () => {
    it('should call logEvent', async () => {
      store$.dispatch(testsActions.StartTest(123, TestCategory.C));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      actions$.next(passCompletionActions.ProvisionalLicenseReceived());
      const result = await firstValueFrom(effects.provisionalLicenseReceived$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.LICENCE_RECEIVED,
        GoogleAnalyticsEventsTitles.RECEIVED,
        GoogleAnalyticsEventsValues.YES
      );
    });
    it('should call logEvent with practice mode prefix', async () => {
      store$.dispatch(testsActions.StartTest(123, TestCategory.C));
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      actions$.next(passCompletionActions.ProvisionalLicenseReceived());
      const result = await firstValueFrom(effects.provisionalLicenseReceived$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${GoogleAnalyticsEvents.LICENCE_RECEIVED}`,
        GoogleAnalyticsEventsTitles.RECEIVED,
        GoogleAnalyticsEventsValues.YES
      );
    });
  });
  describe('transmissionChanged$', () => {
    it('should call logEvent with Manual if Gearbox Category is Manual', async () => {
      store$.dispatch(testsActions.StartTest(123, TestCategory.C));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(SetActivityCode(ActivityCodes.PASS));
      actions$.next(vehicleDetailsActions.GearboxCategoryChanged(TransmissionType.Manual));
      const result = await firstValueFrom(effects.transmissionChanged$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.SET_TRANSMISSION,
        GoogleAnalyticsEventsTitles.TRANSMISSION_TYPE,
        GoogleAnalyticsEventsValues.MANUAL
      );
    });
    it('should call logEvent with Manual if Gearbox Category is Manual with practice mode prefix', async () => {
      store$.dispatch(testsActions.StartTest(123, TestCategory.C));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      store$.dispatch(SetActivityCode(ActivityCodes.PASS));
      actions$.next(vehicleDetailsActions.GearboxCategoryChanged(TransmissionType.Manual));
      const result = await firstValueFrom(effects.transmissionChanged$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${GoogleAnalyticsEvents.SET_TRANSMISSION}`,
        GoogleAnalyticsEventsTitles.TRANSMISSION_TYPE,
        GoogleAnalyticsEventsValues.MANUAL
      );
    });
    it('should call logEvent with Automatic if Gearbox Category is Automatic', async () => {
      store$.dispatch(testsActions.StartTest(123, TestCategory.C));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(SetActivityCode(ActivityCodes.PASS));
      actions$.next(vehicleDetailsActions.GearboxCategoryChanged(TransmissionType.Automatic));
      const result = await firstValueFrom(effects.transmissionChanged$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.SET_TRANSMISSION,
        GoogleAnalyticsEventsTitles.TRANSMISSION_TYPE,
        GoogleAnalyticsEventsValues.AUTOMATIC
      );
    });
    it('should not call logEvent if there is no activity code', async () => {
      store$.dispatch(testsActions.StartTest(123, TestCategory.C));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(SetActivityCode(null));
      actions$.next(vehicleDetailsActions.GearboxCategoryChanged(TransmissionType.Manual));
      const result = await firstValueFrom(effects.transmissionChanged$);
      expect(result.type === AnalyticNotRecorded.type).toBe(true);
      expect(analyticsProviderMock.logGAEvent).not.toHaveBeenCalled();
    });
  });
  describe('d255Yes', () => {
    it('should call logEvent', async () => {
      store$.dispatch(testsActions.StartTest(123, TestCategory.C));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(SetActivityCode('1'));
      actions$.next(testSummaryActions.D255Yes());
      const result = await firstValueFrom(effects.d255Yes$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.SET_D255,
        GoogleAnalyticsEventsTitles.FINALISATION_D255,
        GoogleAnalyticsEventsValues.YES
      );
    });
    it('should call logEvent with the practice mode prefix', async () => {
      store$.dispatch(testsActions.StartTest(123, TestCategory.C));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      store$.dispatch(SetActivityCode('1'));
      actions$.next(testSummaryActions.D255Yes());
      const result = await firstValueFrom(effects.d255Yes$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${GoogleAnalyticsEvents.SET_D255}`,
        GoogleAnalyticsEventsTitles.FINALISATION_D255,
        GoogleAnalyticsEventsValues.YES
      );
    });
  });
  describe('d255No', () => {
    it('should call logEvent', async () => {
      store$.dispatch(testsActions.StartTest(123, TestCategory.C));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(SetActivityCode('1'));
      actions$.next(testSummaryActions.D255No());
      const result = await firstValueFrom(effects.d255No$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.SET_D255,
        GoogleAnalyticsEventsTitles.FINALISATION_D255,
        GoogleAnalyticsEventsValues.NO
      );
    });
    it('should call logEvent with the practice mode prefix', async () => {
      store$.dispatch(testsActions.StartTest(123, TestCategory.C));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      store$.dispatch(SetActivityCode('1'));
      actions$.next(testSummaryActions.D255No());
      const result = await firstValueFrom(effects.d255No$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${GoogleAnalyticsEvents.SET_D255}`,
        GoogleAnalyticsEventsTitles.FINALISATION_D255,
        GoogleAnalyticsEventsValues.NO
      );
    });
  });
  describe('candidateChoseToProceedWithTestInEnglish$', () => {
    it('should call logEvent with the correct parameters', async () => {
      store$.dispatch(testsActions.StartTest(123, TestCategory.C));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(SetActivityCode(ActivityCodes.PASS));
      actions$.next(commsActions.CandidateChoseToProceedWithTestInEnglish(Language.ENGLISH));
      const result = await firstValueFrom(effects.candidateChoseToProceedWithTestInEnglish$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.LANGUAGE_CHANGED,
        GoogleAnalyticsEventsTitles.LANGUAGE,
        Language.ENGLISH
      );
    });
    it('should not call logEvent if there is no activity code', async () => {
      store$.dispatch(testsActions.StartTest(123, TestCategory.C));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(SetActivityCode(null));
      actions$.next(commsActions.CandidateChoseToProceedWithTestInEnglish(Language.ENGLISH));
      const result = await firstValueFrom(effects.candidateChoseToProceedWithTestInEnglish$);
      expect(result.type === AnalyticNotRecorded.type).toBe(true);
      expect(analyticsProviderMock.logGAEvent).not.toHaveBeenCalled();
    });
  });
  describe('candidateChoseToProceedWithTestInWelsh$', () => {
    it('should call logEvent with the correct parameters', async () => {
      store$.dispatch(testsActions.StartTest(123, TestCategory.C));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(SetActivityCode(ActivityCodes.PASS));
      actions$.next(commsActions.CandidateChoseToProceedWithTestInWelsh(Language.CYMRAEG));
      const result = await firstValueFrom(effects.candidateChoseToProceedWithTestInWelsh$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.LANGUAGE_CHANGED,
        GoogleAnalyticsEventsTitles.LANGUAGE,
        Language.CYMRAEG
      );
    });
    it('should not call logEvent if there is no activity code', async () => {
      store$.dispatch(testsActions.StartTest(123, TestCategory.C));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(SetActivityCode(null));
      actions$.next(commsActions.CandidateChoseToProceedWithTestInWelsh(Language.CYMRAEG));
      const result = await firstValueFrom(effects.candidateChoseToProceedWithTestInWelsh$);
      expect(result.type === AnalyticNotRecorded.type).toBe(true);
      expect(analyticsProviderMock.logGAEvent).not.toHaveBeenCalled();
    });
  });
});
