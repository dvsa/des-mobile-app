import { TestBed } from '@angular/core/testing';
import { QuestionOutcome, QuestionResult } from '@dvsa/mes-test-schema/categories/common';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store, StoreModule } from '@ngrx/store';
import * as fakeJournalActions from '@pages/fake-journal/fake-journal.actions';
import { AnalyticsProviderMock } from '@providers/analytics/__mocks__/analytics.mock';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import {
  AnalyticsScreenNames,
  GoogleAnalyticsEventPrefix,
  GoogleAnalyticsEvents,
  GoogleAnalyticsEventsTitles,
  GoogleAnalyticsEventsValues,
} from '@providers/analytics/analytics.model';
import { end2endPracticeSlotId } from '@shared/mocks/test-slot-ids.mock';
import { StoreModel } from '@shared/models/store.model';
import * as SafetyAndBalanceQuestionsActions from '@store/tests/test-data/cat-a-mod2/safety-and-balance/safety-and-balance.cat-a-mod2.actions';
import * as testsActions from '@store/tests/tests.actions';
import { testsReducer } from '@store/tests/tests.reducer';
import { ReplaySubject, firstValueFrom } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { VehicleChecksViewDidEnter } from '../vehicle-checks-modal.cat-a-mod2.actions';
import { VehicleChecksModalCatAMod2AnalyticsEffects } from '../vehicle-checks-modal.cat-a-mod2.analytics.effects';

describe('VehicleChecksModalCatAMod2AnalyticsEffects', () => {
  let effects: VehicleChecksModalCatAMod2AnalyticsEffects;
  let analyticsProviderMock: AnalyticsProvider;
  let actions$: ReplaySubject<Action>;
  let store$: Store<StoreModel>;
  const screenName = AnalyticsScreenNames.VEHICLE_CHECKS;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          tests: testsReducer,
        }),
      ],
      providers: [
        VehicleChecksModalCatAMod2AnalyticsEffects,
        { provide: AnalyticsProvider, useClass: AnalyticsProviderMock },
        provideMockActions(() => actions$),
        Store,
      ],
    });

    actions$ = new ReplaySubject(1);
    effects = TestBed.inject(VehicleChecksModalCatAMod2AnalyticsEffects);
    analyticsProviderMock = TestBed.inject(AnalyticsProvider);
    store$ = TestBed.inject(Store);
  });

  describe('vehicleChecksModalViewDidEnter$ effect', () => {
    it('should call analytics.setCurrentPage', async () => {
      store$.dispatch(testsActions.StartTest(12345, TestCategory.EUAM2));
      actions$.next(VehicleChecksViewDidEnter());
      const result = await firstValueFrom(effects.vehicleChecksModalViewDidEnter$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.setGACurrentPage).toHaveBeenCalledWith(screenName);
    });
  });

  describe('safetyQuestionChanged$ effect', () => {
    const questionNumber: number = 1;
    const safetyQuestion: QuestionResult = {
      code: 'S01',
    };
    it('should log an analytics event with safety question info', async () => {
      store$.dispatch(testsActions.StartTest(12345, TestCategory.EUAM2));
      actions$.next(SafetyAndBalanceQuestionsActions.SafetyQuestionSelected(safetyQuestion, questionNumber));
      const result = await firstValueFrom(effects.safetyQuestionChanged$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEvents.SAFETY_QUESTION}2`,
        GoogleAnalyticsEventsTitles.QUESTION_NUMBER,
        safetyQuestion.code
      );
    });
    it('should log an analytics event in practice mode with safety question info', async () => {
      store$.dispatch(testsActions.StartTest(12345, TestCategory.EUAM2));
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      actions$.next(SafetyAndBalanceQuestionsActions.SafetyQuestionSelected(safetyQuestion, questionNumber));
      const result = await firstValueFrom(effects.safetyQuestionChanged$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${GoogleAnalyticsEvents.SAFETY_QUESTION}2`,
        GoogleAnalyticsEventsTitles.QUESTION_NUMBER,
        safetyQuestion.code
      );
    });
  });

  describe('safetyQuestionOutComeChanged$', () => {
    const questionOutcome: QuestionOutcome = 'P';
    const questionNumber: number = 1;
    it('should log an analytics event with safety question outcome info', async () => {
      store$.dispatch(testsActions.StartTest(12345, TestCategory.EUAM2));
      actions$.next(SafetyAndBalanceQuestionsActions.SafetyQuestionOutcomeChanged(questionOutcome, questionNumber));
      const result = await firstValueFrom(effects.safetyQuestionOutcomeChanged$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEvents.SAFETY_QUESTION}2`,
        GoogleAnalyticsEventsTitles.RESULT,
        GoogleAnalyticsEventsValues.CORRECT
      );
    });
    it('should log an analytics event in practice mode with safety question outcome info', async () => {
      store$.dispatch(testsActions.StartTest(12345, TestCategory.EUAM2));
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      actions$.next(SafetyAndBalanceQuestionsActions.SafetyQuestionOutcomeChanged(questionOutcome, questionNumber));
      const result = await firstValueFrom(effects.safetyQuestionOutcomeChanged$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${GoogleAnalyticsEvents.SAFETY_QUESTION}2`,
        GoogleAnalyticsEventsTitles.RESULT,
        GoogleAnalyticsEventsValues.CORRECT
      );
    });
  });

  describe('balanceQuestionChanged$ effect', () => {
    const questionNumber: number = 1;
    const balanceQuestion: QuestionResult = {
      code: 'T01',
    };
    it('should log an analytics event with balance question info', async () => {
      store$.dispatch(testsActions.StartTest(12345, TestCategory.EUAM2));
      actions$.next(SafetyAndBalanceQuestionsActions.BalanceQuestionSelected(balanceQuestion, questionNumber));
      const result = await firstValueFrom(effects.balanceQuestionChanged$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEvents.BALANCE_QUESTION}2`,
        GoogleAnalyticsEventsTitles.QUESTION_NUMBER,
        balanceQuestion.code
      );
    });
    it('should log an analytics event in practice mode with balance question info', async () => {
      store$.dispatch(testsActions.StartTest(12345, TestCategory.EUAM2));
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      actions$.next(SafetyAndBalanceQuestionsActions.BalanceQuestionSelected(balanceQuestion, questionNumber));
      const result = await firstValueFrom(effects.balanceQuestionChanged$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${GoogleAnalyticsEvents.BALANCE_QUESTION}2`,
        GoogleAnalyticsEventsTitles.QUESTION_NUMBER,
        balanceQuestion.code
      );
    });
  });

  describe('balanceQuestionOutcomeChanged$', () => {
    const questionOutcome: QuestionOutcome = 'DF';
    const questionNumber: number = 1;
    it('should log an analytics event with balance question outcome info', async () => {
      store$.dispatch(testsActions.StartTest(12345, TestCategory.EUAM2));
      actions$.next(SafetyAndBalanceQuestionsActions.BalanceQuestionOutcomeChanged(questionOutcome, questionNumber));
      const result = await firstValueFrom(effects.balanceQuestionOutcomeChanged$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEvents.BALANCE_QUESTION}2`,
        GoogleAnalyticsEventsTitles.RESULT,
        GoogleAnalyticsEventsValues.DRIVING_FAULT
      );
    });
    it('should log an analytics event in practice mode with balance question outcome info', async () => {
      store$.dispatch(testsActions.StartTest(12345, TestCategory.EUAM2));
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      actions$.next(SafetyAndBalanceQuestionsActions.BalanceQuestionOutcomeChanged(questionOutcome, questionNumber));
      const result = await firstValueFrom(effects.balanceQuestionOutcomeChanged$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${GoogleAnalyticsEvents.BALANCE_QUESTION}2`,
        GoogleAnalyticsEventsTitles.RESULT,
        GoogleAnalyticsEventsValues.DRIVING_FAULT
      );
    });
  });
});
