import { TestBed } from '@angular/core/testing';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store, StoreModule } from '@ngrx/store';
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
import { StoreModel } from '@shared/models/store.model';
import * as SafetyQuestionsActions from '@store/tests/test-data/cat-d/safety-questions/safety-questions.cat-d.action';
import * as VehicleChecksActions from '@store/tests/test-data/cat-d/vehicle-checks/vehicle-checks.cat-d.action';
import * as testsActions from '@store/tests/tests.actions';
import { testsReducer } from '@store/tests/tests.reducer';
import { ReplaySubject, firstValueFrom } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';

import { QuestionOutcome, QuestionResult } from '@dvsa/mes-test-schema/categories/common';
import * as fakeJournalActions from '@pages/fake-journal/fake-journal.actions';
import { end2endPracticeSlotId } from '@shared/mocks/test-slot-ids.mock';
import { VehicleChecksViewDidEnter } from '../vehicle-checks-modal.cat-d.actions';
import { VehicleChecksModalCatDAnalyticsEffects } from '../vehicle-checks-modal.cat-d.analytics.effects';

describe('VehicleChecksModalCatDAnalyticsEffects', () => {
  let effects: VehicleChecksModalCatDAnalyticsEffects;
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
        VehicleChecksModalCatDAnalyticsEffects,
        { provide: AnalyticsProvider, useClass: AnalyticsProviderMock },
        provideMockActions(() => actions$),
        Store,
      ],
    });

    actions$ = new ReplaySubject(1);
    effects = TestBed.inject(VehicleChecksModalCatDAnalyticsEffects);
    analyticsProviderMock = TestBed.inject(AnalyticsProvider);
    store$ = TestBed.inject(Store);
  });

  describe('vehicleChecksModalViewDidEnter$ effect', () => {
    it('should call analytics.setCurrentPage', async () => {
      store$.dispatch(testsActions.StartTest(12345, TestCategory.D));
      actions$.next(VehicleChecksViewDidEnter());
      const result = await firstValueFrom(effects.vehicleChecksModalViewDidEnter$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.setGACurrentPage).toHaveBeenCalledWith(screenName);
    });
  });

  describe('showMeQuestionChanged$ effect', () => {
    const questionNumber: number = 1;
    const showMeQuestion: QuestionResult = {
      code: 'S01',
    };
    it('should log an analytics event with show me question info', async () => {
      store$.dispatch(testsActions.StartTest(12345, TestCategory.D));
      actions$.next(VehicleChecksActions.ShowMeQuestionSelected(showMeQuestion, questionNumber));
      const result = await firstValueFrom(effects.showMeQuestionChanged$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEvents.SHOW_ME_QUESTION}2`,
        GoogleAnalyticsEventsTitles.QUESTION_NUMBER,
        showMeQuestion.code
      );
    });
    it('should log an analytics event in practice with show me question info', async () => {
      store$.dispatch(testsActions.StartTest(12345, TestCategory.D));
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      actions$.next(VehicleChecksActions.ShowMeQuestionSelected(showMeQuestion, questionNumber));
      const result = await firstValueFrom(effects.showMeQuestionChanged$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${GoogleAnalyticsEvents.SHOW_ME_QUESTION}2`,
        GoogleAnalyticsEventsTitles.QUESTION_NUMBER,
        showMeQuestion.code
      );
    });
  });

  describe('showMeQuestionOutComeChanged$', () => {
    const questionOutcome: QuestionOutcome = 'P';
    const questionNumber: number = 1;
    it('should log an analytics event with show me question outcome info', async () => {
      store$.dispatch(testsActions.StartTest(12345, TestCategory.D));
      actions$.next(VehicleChecksActions.ShowMeQuestionOutcomeChanged(questionOutcome, questionNumber));
      const result = await firstValueFrom(effects.showMeQuestionOutComeChanged$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEvents.SHOW_ME_QUESTION}2`,
        GoogleAnalyticsEventsTitles.RESULT,
        GoogleAnalyticsEventsValues.CORRECT
      );
    });
    it('should log an analytics event in practice mode with show me question outcome info', async () => {
      store$.dispatch(testsActions.StartTest(12345, TestCategory.D));
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      actions$.next(VehicleChecksActions.ShowMeQuestionOutcomeChanged(questionOutcome, questionNumber));
      const result = await firstValueFrom(effects.showMeQuestionOutComeChanged$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${GoogleAnalyticsEvents.SHOW_ME_QUESTION}2`,
        GoogleAnalyticsEventsTitles.RESULT,
        GoogleAnalyticsEventsValues.CORRECT
      );
    });
  });

  describe('tellMeQuestionChanged$ effect', () => {
    const questionNumber: number = 1;
    const tellMeQuestion: QuestionResult = {
      code: 'T01',
    };
    it('should log an analyics event with tell me question info', async () => {
      store$.dispatch(testsActions.StartTest(12345, TestCategory.D));
      actions$.next(VehicleChecksActions.TellMeQuestionSelected(tellMeQuestion, questionNumber));
      const result = await firstValueFrom(effects.tellMeQuestionChanged$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEvents.TELL_ME_QUESTION}2`,
        GoogleAnalyticsEventsTitles.QUESTION_NUMBER,
        tellMeQuestion.code
      );
    });
    it('should log an analyics event in practice mode with tell me question info', async () => {
      store$.dispatch(testsActions.StartTest(12345, TestCategory.D));
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      actions$.next(VehicleChecksActions.TellMeQuestionSelected(tellMeQuestion, questionNumber));
      const result = await firstValueFrom(effects.tellMeQuestionChanged$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${GoogleAnalyticsEvents.TELL_ME_QUESTION}2`,
        GoogleAnalyticsEventsTitles.QUESTION_NUMBER,
        tellMeQuestion.code
      );
    });
  });

  describe('tellMeQuestionOutComeChanged$', () => {
    const questionOutcome: QuestionOutcome = 'DF';
    const questionNumber: number = 1;
    it('should log an analytics event with tell me question outcome info', async () => {
      store$.dispatch(testsActions.StartTest(12345, TestCategory.D));
      actions$.next(VehicleChecksActions.TellMeQuestionOutcomeChanged(questionOutcome, questionNumber));
      const result = await firstValueFrom(effects.tellMeQuestionOutComeChanged$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEvents.TELL_ME_QUESTION}2`,
        GoogleAnalyticsEventsTitles.RESULT,
        GoogleAnalyticsEventsValues.DRIVING_FAULT
      );
    });
    it('should log an analytics event in practice mode with tell me question outcome info', async () => {
      store$.dispatch(testsActions.StartTest(12345, TestCategory.D));
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      actions$.next(VehicleChecksActions.TellMeQuestionOutcomeChanged(questionOutcome, questionNumber));
      const result = await firstValueFrom(effects.tellMeQuestionOutComeChanged$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${GoogleAnalyticsEvents.TELL_ME_QUESTION}2`,
        GoogleAnalyticsEventsTitles.RESULT,
        GoogleAnalyticsEventsValues.DRIVING_FAULT
      );
    });
  });

  describe('safetyQuestionOutComeChanged$', () => {
    const questionOutcome: QuestionOutcome = 'P';
    const questionNumber: number = 1;
    it('should log an analytics event with safety question outcome info', async () => {
      store$.dispatch(testsActions.StartTest(12345, TestCategory.D));
      actions$.next(SafetyQuestionsActions.SafetyQuestionOutcomeChanged(questionOutcome, questionNumber));
      const result = await firstValueFrom(effects.safetyQuestionOutcomeChanged$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEvents.SAFETY_QUESTION}2`,
        GoogleAnalyticsEventsTitles.RESULT,
        GoogleAnalyticsEventsValues.CORRECT
      );
    });
    it('should log an analytics event in practice mode with safety question outcome info', async () => {
      store$.dispatch(testsActions.StartTest(12345, TestCategory.D));
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      actions$.next(SafetyQuestionsActions.SafetyQuestionOutcomeChanged(questionOutcome, questionNumber));
      const result = await firstValueFrom(effects.safetyQuestionOutcomeChanged$);
      expect(result.type === AnalyticRecorded.type).toBe(true);
      expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
        `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${GoogleAnalyticsEvents.SAFETY_QUESTION}2`,
        GoogleAnalyticsEventsTitles.RESULT,
        GoogleAnalyticsEventsValues.CORRECT
      );
    });
  });
});
