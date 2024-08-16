import { TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { ReplaySubject } from 'rxjs';
import { testsReducer } from '@store/tests/tests.reducer';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticsProviderMock } from '@providers/analytics/__mocks__/analytics.mock';
import { provideMockActions } from '@ngrx/effects/testing';
import * as testsActions from '@store/tests/tests.actions';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import {
  AnalyticsScreenNames,
  GoogleAnalyticsEventPrefix,
  GoogleAnalyticsEvents,
  GoogleAnalyticsEventsTitles,
  GoogleAnalyticsEventsValues,
} from '@providers/analytics/analytics.model';
import * as SafetyAndBalanceQuestionsActions
  from '@store/tests/test-data/cat-a-mod2/safety-and-balance/safety-and-balance.cat-a-mod2.actions';
import {
  QuestionOutcome,
  QuestionResult,
} from '@dvsa/mes-test-schema/categories/common';
import { VehicleChecksViewDidEnter } from '../vehicle-checks-modal.cat-a-mod2.actions';
import { VehicleChecksModalCatAMod2AnalyticsEffects } from '../vehicle-checks-modal.cat-a-mod2.analytics.effects';
import * as fakeJournalActions from '@pages/fake-journal/fake-journal.actions';
import { end2endPracticeSlotId } from '@shared/mocks/test-slot-ids.mock';

describe('VehicleChecksModalCatAMod2AnalyticsEffects', () => {
  let effects: VehicleChecksModalCatAMod2AnalyticsEffects;
  let analyticsProviderMock: AnalyticsProvider;
  let actions$: ReplaySubject<any>;
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
    it('should call analytics.setCurrentPage', (done) => {
      store$.dispatch(testsActions.StartTest(12345, TestCategory.EUAM2));
      actions$.next(VehicleChecksViewDidEnter());
      effects.vehicleChecksModalViewDidEnter$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type).toBe(true);
        expect(analyticsProviderMock.setGACurrentPage).toHaveBeenCalledWith(screenName);
        done();
      });
    });
  });

  describe('safetyQuestionChanged$ effect', () => {
    const questionNumber: number = 1;
    const safetyQuestion: QuestionResult = {
      code: 'S01',
    };
    it('should log an analytics event with safety question info', (done) => {
      store$.dispatch(testsActions.StartTest(12345, TestCategory.EUAM2));
      actions$.next(SafetyAndBalanceQuestionsActions.SafetyQuestionSelected(safetyQuestion, questionNumber));
      effects.safetyQuestionChanged$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type).toBe(true);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          (GoogleAnalyticsEvents.SAFETY_QUESTION + '2'),
          GoogleAnalyticsEventsTitles.QUESTION_NUMBER,
          safetyQuestion.code,
        );
        done();
      });
    });
    it('should log an analytics event in practice mode with safety question info', (done) => {
      store$.dispatch(testsActions.StartTest(12345, TestCategory.EUAM2));
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      actions$.next(SafetyAndBalanceQuestionsActions.SafetyQuestionSelected(safetyQuestion, questionNumber));
      effects.safetyQuestionChanged$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type).toBe(true);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${(GoogleAnalyticsEvents.SAFETY_QUESTION + '2')}`,
          GoogleAnalyticsEventsTitles.QUESTION_NUMBER,
          safetyQuestion.code,
        );
        done();
      });
    });
  });

  describe('safetyQuestionOutComeChanged$', () => {
    const questionOutcome: QuestionOutcome = 'P';
    const questionNumber: number = 1;
    it('should log an analytics event with safety question outcome info', (done) => {
      store$.dispatch(testsActions.StartTest(12345, TestCategory.EUAM2));
      actions$.next(SafetyAndBalanceQuestionsActions.SafetyQuestionOutcomeChanged(questionOutcome, questionNumber));
      effects.safetyQuestionOutcomeChanged$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type).toBe(true);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          (GoogleAnalyticsEvents.SAFETY_QUESTION + '2'),
          GoogleAnalyticsEventsTitles.RESULT,
          GoogleAnalyticsEventsValues.CORRECT,
        );
        done();
      });
    });
    it('should log an analytics event in practice mode with safety question outcome info', (done) => {
      store$.dispatch(testsActions.StartTest(12345, TestCategory.EUAM2));
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      actions$.next(SafetyAndBalanceQuestionsActions.SafetyQuestionOutcomeChanged(questionOutcome, questionNumber));
      effects.safetyQuestionOutcomeChanged$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type).toBe(true);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${(GoogleAnalyticsEvents.SAFETY_QUESTION + '2')}`,
          GoogleAnalyticsEventsTitles.RESULT,
          GoogleAnalyticsEventsValues.CORRECT,
        );
        done();
      });
    });
  });

  describe('balanceQuestionChanged$ effect', () => {
    const questionNumber: number = 1;
    const balanceQuestion: QuestionResult = {
      code: 'T01',
    };
    it('should log an analytics event with balance question info', (done) => {
      store$.dispatch(testsActions.StartTest(12345, TestCategory.EUAM2));
      actions$.next(SafetyAndBalanceQuestionsActions.BalanceQuestionSelected(balanceQuestion, questionNumber));
      effects.balanceQuestionChanged$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type).toBe(true);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          (GoogleAnalyticsEvents.BALANCE_QUESTION + '2'),
          GoogleAnalyticsEventsTitles.QUESTION_NUMBER,
          balanceQuestion.code,
        );
        done();
      });
    });
    it('should log an analytics event in practice mode with balance question info', (done) => {
      store$.dispatch(testsActions.StartTest(12345, TestCategory.EUAM2));
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      actions$.next(SafetyAndBalanceQuestionsActions.BalanceQuestionSelected(balanceQuestion, questionNumber));
      effects.balanceQuestionChanged$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type).toBe(true);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${(GoogleAnalyticsEvents.BALANCE_QUESTION + '2')}`,
          GoogleAnalyticsEventsTitles.QUESTION_NUMBER,
          balanceQuestion.code,
        );
        done();
      });
    });
  });

  describe('balanceQuestionOutcomeChanged$', () => {
    const questionOutcome: QuestionOutcome = 'DF';
    const questionNumber: number = 1;
    it('should log an analytics event with balance question outcome info', (done) => {
      store$.dispatch(testsActions.StartTest(12345, TestCategory.EUAM2));
      actions$.next(SafetyAndBalanceQuestionsActions.BalanceQuestionOutcomeChanged(questionOutcome, questionNumber));
      effects.balanceQuestionOutcomeChanged$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type).toBe(true);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          (GoogleAnalyticsEvents.BALANCE_QUESTION + '2'),
          GoogleAnalyticsEventsTitles.RESULT,
          GoogleAnalyticsEventsValues.DRIVING_FAULT,
        );
        done();
      });
    });
    it('should log an analytics event in practice mode with balance question outcome info', (done) => {
      store$.dispatch(testsActions.StartTest(12345, TestCategory.EUAM2));
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      actions$.next(SafetyAndBalanceQuestionsActions.BalanceQuestionOutcomeChanged(questionOutcome, questionNumber));
      effects.balanceQuestionOutcomeChanged$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type).toBe(true);
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${(GoogleAnalyticsEvents.BALANCE_QUESTION + '2')}`,
          GoogleAnalyticsEventsTitles.RESULT,
          GoogleAnalyticsEventsValues.DRIVING_FAULT,
        );
        done();
      });
    });
  });

});
