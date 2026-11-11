import { TestBed } from '@angular/core/testing';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store, StoreModule } from '@ngrx/store';
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
import { candidateMock } from '@store/tests/__mocks__/tests.mock';
import { SetActivityCode } from '@store/tests/activity-code/activity-code.actions';
import * as commsActions from '@store/tests/communication-preferences/communication-preferences.actions';
import { Language } from '@store/tests/communication-preferences/communication-preferences.model';
import { PopulateCandidateDetails } from '@store/tests/journal-data/common/candidate/candidate.actions';
import * as testSummaryActions from '@store/tests/test-summary/test-summary.actions';
import * as testsActions from '@store/tests/tests.actions';
import { testsReducer } from '@store/tests/tests.reducer';
import { ReplaySubject, firstValueFrom } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';
import * as fakeJournalActions from '../../fake-journal/fake-journal.actions';
import * as nonPassFinalisationActions from '../non-pass-finalisation.actions';
import { NonPassFinalisationAnalyticsEffects } from '../non-pass-finalisation.analytics.effects';

describe('NonPassFinalisationAnalyticsEffects', () => {
  let effects: NonPassFinalisationAnalyticsEffects;
  let analyticsProviderMock: AnalyticsProvider;
  let actions$: ReplaySubject<Action>;
  let store$: Store<StoreModel>;
  const screenName = AnalyticsScreenNames.NON_PASS_FINALISATION;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          tests: testsReducer,
        }),
      ],
      providers: [
        NonPassFinalisationAnalyticsEffects,
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
    effects = TestBed.inject(NonPassFinalisationAnalyticsEffects);
    analyticsProviderMock = TestBed.inject(AnalyticsProvider);
    store$ = TestBed.inject(Store);
  });

  describe('nonPassFinalisationViewDidEnter', () => {
    it('should call setCurrentPage', async () => {
      store$.dispatch(testsActions.StartTest(123, TestCategory.B));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      actions$.next(nonPassFinalisationActions.NonPassFinalisationViewDidEnter());
      const result = await firstValueFrom(effects.nonPassFinalisationViewDidEnterEffect$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.setGACurrentPage).toHaveBeenCalledWith(screenName);
    });
    it('should call setCurrentPage with practice mode prefix', async () => {
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      actions$.next(nonPassFinalisationActions.NonPassFinalisationViewDidEnter());
      const result = await firstValueFrom(effects.nonPassFinalisationViewDidEnterEffect$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.setGACurrentPage).toHaveBeenCalledWith(
        `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${screenName}`
      );
    });
  });

  describe('validationErrorEffect', () => {
    it('should call logError', async () => {
      store$.dispatch(testsActions.StartTest(123, TestCategory.B));
      actions$.next(nonPassFinalisationActions.NonPassFinalisationValidationError('error is blank'));
      const result = await firstValueFrom(effects.validationErrorEffect$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.VALIDATION_ERROR,
        GoogleAnalyticsEventsTitles.BLANK_FIELD,
        'error'
      );
    });

    it('should call logError with pass, prefixed with practice mode', async () => {
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      actions$.next(nonPassFinalisationActions.NonPassFinalisationValidationError('error message'));
      const result = await firstValueFrom(effects.validationErrorEffect$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `PM_${GoogleAnalyticsEvents.VALIDATION_ERROR}`,
        GoogleAnalyticsEventsTitles.BLANK_FIELD,
        'error'
      );
    });
  });
  describe('d255Yes', () => {
    it('should call logEvent', async () => {
      store$.dispatch(testsActions.StartTest(123, TestCategory.C));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
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
    it('should not call logEvent if there is no activity code', async () => {
      store$.dispatch(testsActions.StartTest(123, TestCategory.C));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      actions$.next(commsActions.CandidateChoseToProceedWithTestInWelsh(Language.CYMRAEG));
      const result = await firstValueFrom(effects.candidateChoseToProceedWithTestInWelsh$);
      expect(result.type === AnalyticNotRecorded.type).toBe(true);
      expect(analyticsProviderMock.logGAEvent).not.toHaveBeenCalled();
    });
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
  });

  describe('NonPassFinalisationReportActivityCode', () => {
    it('should call logEvent for action NonPassFinalisationReportActivityCode', async () => {
      store$.dispatch(testsActions.StartTest(123, TestCategory.C));
      actions$.next(nonPassFinalisationActions.NonPassFinalisationReportActivityCode(ActivityCodes.FAIL_PUBLIC_SAFETY));
      const result = await firstValueFrom(effects.nonPassFinalisationReportActivityCode$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        GoogleAnalyticsEvents.SET_ACTIVITY_CODE,
        GoogleAnalyticsEventsTitles.ACTIVITY_CODE,
        '4 - FAIL_PUBLIC_SAFETY'
      );
    });
    it('should call logEvent in practice mode for action NonPassFinalisationReportActivityCode', async () => {
      store$.dispatch(testsActions.StartTest(123, TestCategory.C));
      actions$.next(nonPassFinalisationActions.NonPassFinalisationReportActivityCode(ActivityCodes.FAIL_PUBLIC_SAFETY));
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      const result = await firstValueFrom(effects.nonPassFinalisationReportActivityCode$);
      expect(result.type).toEqual(AnalyticRecorded.type);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledTimes(1);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `PM_${GoogleAnalyticsEvents.SET_ACTIVITY_CODE}`,
        GoogleAnalyticsEventsTitles.ACTIVITY_CODE,
        '4 - FAIL_PUBLIC_SAFETY'
      );
    });
  });
});
