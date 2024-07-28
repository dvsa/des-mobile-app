import { TestBed, waitForAsync } from '@angular/core/testing';
import { QuestionOutcome, QuestionResult } from '@dvsa/mes-test-schema/categories/common';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { provideMockActions } from '@ngrx/effects/testing';
import { Store, StoreModule } from '@ngrx/store';
import * as fakeJournalActions from '@pages/fake-journal/fake-journal.actions';
import { AnalyticsProviderMock } from '@providers/analytics/__mocks__/analytics.mock';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import {
  AnalyticsEventCategories,
  AnalyticsScreenNames,
  GoogleAnalyticsEventPrefix,
  GoogleAnalyticsEvents,
  GoogleAnalyticsEventsTitles,
  GoogleAnalyticsEventsValues,
} from '@providers/analytics/analytics.model';
import { end2endPracticeSlotId } from '@shared/mocks/test-slot-ids.mock';
import { StoreModel } from '@shared/models/store.model';
import * as VehicleChecksActions from '@store/tests/test-data/cat-c/vehicle-checks/vehicle-checks.cat-c.action';
import * as testsActions from '@store/tests/tests.actions';
import { testsReducer } from '@store/tests/tests.reducer';
import { ReplaySubject } from 'rxjs';
import { VehicleChecksViewDidEnter } from '../vehicle-checks-modal.cat-c.actions';
import { VehicleChecksModalCatCAnalyticsEffects } from '../vehicle-checks-modal.cat-c.analytics.effects';

describe('VehicleChecksModalCatCAnalyticsEffects', () => {
  let effects: VehicleChecksModalCatCAnalyticsEffects;
  let analyticsProviderMock;
  let actions$: ReplaySubject<unknown>;
  let store$: Store<StoreModel>;
  const screenName = AnalyticsScreenNames.VEHICLE_CHECKS;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          tests: testsReducer,
        }),
      ],
      providers: [
        VehicleChecksModalCatCAnalyticsEffects,
        {
          provide: AnalyticsProvider,
          useClass: AnalyticsProviderMock,
        },
        provideMockActions(() => actions$),
        Store,
      ],
    });

    actions$ = new ReplaySubject(1);
    effects = TestBed.inject(VehicleChecksModalCatCAnalyticsEffects);
    analyticsProviderMock = TestBed.inject(AnalyticsProvider);
    store$ = TestBed.inject(Store);
    spyOn(analyticsProviderMock, 'logEvent');
  }));

  describe('vehicleChecksModalViewDidEnter$ effect', () => {
    it('should call analytics.setCurrentPage', (done) => {
      store$.dispatch(testsActions.StartTest(12345, TestCategory.C));
      actions$.next(VehicleChecksViewDidEnter());
      effects.vehicleChecksModalViewDidEnter$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type).toBe(true);
        expect(analyticsProviderMock.setCurrentPage).toHaveBeenCalledWith(screenName);
        expect(analyticsProviderMock.setGACurrentPage).toHaveBeenCalledWith(screenName);
        done();
      });
    });
  });

  describe('showMeQuestionChanged$ effect', () => {
    const questionNumber: number = 1;
    const showMeQuestion: QuestionResult = {
      code: 'S01',
    };
    it('should log an analyics event with show me question info', (done) => {
      store$.dispatch(testsActions.StartTest(12345, TestCategory.C));
      actions$.next(VehicleChecksActions.ShowMeQuestionSelected(showMeQuestion, questionNumber));
      effects.showMeQuestionChanged$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type).toBe(true);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.VEHICLE_CHECKS,
          `show me question ${questionNumber + 1} changed`,
          showMeQuestion.code
        );
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.SHOW_ME_QUESTION + '2',
          GoogleAnalyticsEventsTitles.QUESTION_NUMBER,
          showMeQuestion.code
        );
        done();
      });
    });
    it('should log an analyics event in practice mode with show me question info', (done) => {
      store$.dispatch(testsActions.StartTest(12345, TestCategory.C));
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      actions$.next(VehicleChecksActions.ShowMeQuestionSelected(showMeQuestion, questionNumber));
      effects.showMeQuestionChanged$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type).toBe(true);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          `practice mode - ${AnalyticsEventCategories.VEHICLE_CHECKS}`,
          `show me question ${questionNumber + 1} changed`,
          showMeQuestion.code
        );
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${GoogleAnalyticsEvents.SHOW_ME_QUESTION + '2'}`,
          GoogleAnalyticsEventsTitles.QUESTION_NUMBER,
          showMeQuestion.code
        );
        done();
      });
    });
  });

  describe('showMeQuestionOutComeChanged$', () => {
    const questionOutcome: QuestionOutcome = 'P';
    const questionNumber: number = 1;
    it('should log an analytics event with show me question outcome info', (done) => {
      store$.dispatch(testsActions.StartTest(12345, TestCategory.C));
      actions$.next(VehicleChecksActions.ShowMeQuestionOutcomeChanged(questionOutcome, questionNumber));
      effects.showMeQuestionOutComeChanged$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type).toBe(true);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.VEHICLE_CHECKS,
          `show me question ${questionNumber + 1} outcome changed`,
          'correct'
        );
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.SHOW_ME_QUESTION + '2',
          GoogleAnalyticsEventsTitles.RESULT,
          GoogleAnalyticsEventsValues.CORRECT
        );
        done();
      });
    });
    it('should log an analytics event in practice mode with show me question outcome info', (done) => {
      store$.dispatch(testsActions.StartTest(12345, TestCategory.C));
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      actions$.next(VehicleChecksActions.ShowMeQuestionOutcomeChanged(questionOutcome, questionNumber));
      effects.showMeQuestionOutComeChanged$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type).toBe(true);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          `practice mode - ${AnalyticsEventCategories.VEHICLE_CHECKS}`,
          `show me question ${questionNumber + 1} outcome changed`,
          'correct'
        );
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${GoogleAnalyticsEvents.SHOW_ME_QUESTION + '2'}`,
          GoogleAnalyticsEventsTitles.RESULT,
          GoogleAnalyticsEventsValues.CORRECT
        );
        done();
      });
    });
  });

  describe('tellMeQuestionChanged$ effect', () => {
    const questionNumber: number = 1;
    const tellMeQuestion: QuestionResult = {
      code: 'T01',
    };
    it('should log an analyics event with tell me question info', (done) => {
      store$.dispatch(testsActions.StartTest(12345, TestCategory.C));
      actions$.next(VehicleChecksActions.TellMeQuestionSelected(tellMeQuestion, questionNumber));
      effects.tellMeQuestionChanged$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type).toBe(true);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.VEHICLE_CHECKS,
          `tell me question ${questionNumber + 1} changed`,
          tellMeQuestion.code
        );
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.TELL_ME_QUESTION + '2',
          GoogleAnalyticsEventsTitles.QUESTION_NUMBER,
          tellMeQuestion.code
        );
        done();
      });
    });
    it('should log an analyics event in practice mode with tell me question info', (done) => {
      store$.dispatch(testsActions.StartTest(12345, TestCategory.C));
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      actions$.next(VehicleChecksActions.TellMeQuestionSelected(tellMeQuestion, questionNumber));
      effects.tellMeQuestionChanged$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type).toBe(true);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          `practice mode - ${AnalyticsEventCategories.VEHICLE_CHECKS}`,
          `tell me question ${questionNumber + 1} changed`,
          tellMeQuestion.code
        );
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${GoogleAnalyticsEvents.TELL_ME_QUESTION + '2'}`,
          GoogleAnalyticsEventsTitles.QUESTION_NUMBER,
          tellMeQuestion.code
        );
        done();
      });
    });
  });

  describe('tellMeQuestionOutComeChanged$', () => {
    const questionOutcome: QuestionOutcome = 'DF';
    const questionNumber: number = 1;
    it('should log an analytics event with tell me question outcome info', (done) => {
      store$.dispatch(testsActions.StartTest(12345, TestCategory.C));
      actions$.next(VehicleChecksActions.TellMeQuestionOutcomeChanged(questionOutcome, questionNumber));
      effects.tellMeQuestionOutComeChanged$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type).toBe(true);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          AnalyticsEventCategories.VEHICLE_CHECKS,
          `tell me question ${questionNumber + 1} outcome changed`,
          'driving fault'
        );
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          GoogleAnalyticsEvents.TELL_ME_QUESTION + '2',
          GoogleAnalyticsEventsTitles.RESULT,
          GoogleAnalyticsEventsValues.DRIVING_FAULT
        );
        done();
      });
    });
    it('should log an analytics event in practice mode with tell me question outcome info', (done) => {
      store$.dispatch(testsActions.StartTest(12345, TestCategory.C));
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      actions$.next(VehicleChecksActions.TellMeQuestionOutcomeChanged(questionOutcome, questionNumber));
      effects.tellMeQuestionOutComeChanged$.subscribe((result) => {
        expect(result.type === AnalyticRecorded.type).toBe(true);
        expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
          `practice mode - ${AnalyticsEventCategories.VEHICLE_CHECKS}`,
          `tell me question ${questionNumber + 1} outcome changed`,
          'driving fault'
        );
        expect(analyticsProviderMock.logGAEvent).toHaveBeenCalledWith(
          `${GoogleAnalyticsEventPrefix.PRACTICE_MODE}_${GoogleAnalyticsEvents.TELL_ME_QUESTION + '2'}`,
          GoogleAnalyticsEventsTitles.RESULT,
          GoogleAnalyticsEventsValues.DRIVING_FAULT
        );
        done();
      });
    });
  });
});
