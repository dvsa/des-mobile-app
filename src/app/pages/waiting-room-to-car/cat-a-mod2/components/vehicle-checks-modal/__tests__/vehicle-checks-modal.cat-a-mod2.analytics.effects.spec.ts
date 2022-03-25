// import { TestBed } from '@angular/core/testing';
// import { VehicleChecksModalCatAMod2AnalyticsEffects } from '../vehicle-checks-modal.cat-a-mod2.analytics.effects';
// import { Store, StoreModule } from '@ngrx/store';
// import { StoreModel } from '../../../../../../shared/models/store.model';
// import { ReplaySubject } from 'rxjs';
// import { testsReducer } from '../../../../../../modules/tests/tests.reducer';
// import { AnalyticsProvider } from '../../../../../../providers/analytics/analytics';
// import { AnalyticsProviderMock } from '../../../../../../providers/analytics/__mocks__/analytics.mock';
// import { provideMockActions } from '@ngrx/effects/testing';
// import * as testsActions from '../../../../../../modules/tests/tests.actions';
// import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
// import { VehicleChecksViewDidEnter } from '../vehicle-checks-modal.cat-a-mod2.actions';
// import { AnalyticRecorded } from '../../../../../../providers/analytics/analytics.actions';
// import { AnalyticsEventCategories, AnalyticsScreenNames } from '../../../../../../providers/analytics/analytics.model';
// import * as SafetyAndBalanceQuestionsActions
//   from '../../../../../../modules/tests/test-data/cat-a-mod2/safety-and-balance/safety-and-balance.cat-a-mod2.actions';
// import {
//   QuestionOutcome,
//   QuestionResult,
// } from '@dvsa/mes-test-schema/categories/common';
//
// describe('Vehicle Checks Modal A Mod2 Analytics Effects', () => {
//
//   let effects: VehicleChecksModalCatAMod2AnalyticsEffects;
//   let analyticsProviderMock;
//   let actions$: any;
//   let store$: Store<StoreModel>;
//   const screenName = AnalyticsScreenNames.VEHICLE_CHECKS;
//
//   beforeEach(() => {
//     actions$ = new ReplaySubject(1);
//     TestBed.configureTestingModule({
//       imports: [
//         StoreModule.forRoot({
//           tests: testsReducer,
//         }),
//       ],
//       providers: [
//         VehicleChecksModalCatAMod2AnalyticsEffects,
//         { provide: AnalyticsProvider, useClass: AnalyticsProviderMock },
//         provideMockActions(() => actions$),
//         Store,
//       ],
//     });
//     effects = TestBed.get(VehicleChecksModalCatAMod2AnalyticsEffects);
//     analyticsProviderMock = TestBed.get(AnalyticsProvider);
//     store$ = TestBed.get(Store);
//   });
//
//   describe('vehicleChecksModalViewDidEnter$ effect', () => {
//     it('should call analytics.setCurrentPage', (done) => {
//       store$.dispatch(new testsActions.StartTest(12345, TestCategory.EUAM2));
//       actions$.next(new VehicleChecksViewDidEnter());
//       effects.vehicleChecksModalViewDidEnter$.subscribe((result) => {
//         expect(result instanceof AnalyticRecorded).toBe(true);
//         expect(analyticsProviderMock.setCurrentPage).toHaveBeenCalledWith(screenName);
//         done();
//       });
//     });
//   });
//
//   describe('safetyQuestionChanged$ effect', () => {
//     const questionNumber: number = 1;
//     const safetyQuestion: QuestionResult = {
//       code: 'S01',
//     };
//     it('should log an analyics event with safety question info', (done) => {
//       store$.dispatch(new testsActions.StartTest(12345, TestCategory.EUAM2));
//       actions$.next(new SafetyAndBalanceQuestionsActions.SafetyQuestionSelected(safetyQuestion, questionNumber));
//       effects.safetyQuestionChanged$.subscribe((result) => {
//         expect(result instanceof AnalyticRecorded).toBe(true);
//         expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
//           AnalyticsEventCategories.VEHICLE_CHECKS,
//           `safety question ${questionNumber + 1} changed`,
//           safetyQuestion.code,
//         );
//         done();
//       });
//     });
//   });
//
//   describe('safetyQuestionOutComeChanged$', () => {
//     const questionOutcome: QuestionOutcome = 'P';
//     const questionNumber: number = 1;
//     it('should log an analytics event with safety question outcome info', (done) => {
//       store$.dispatch(new testsActions.StartTest(12345, TestCategory.EUAM2));
//       actions$.next(new SafetyAndBalanceQuestionsActions.SafetyQuestionOutcomeChanged(questionOutcome, questionNumber));
//       effects.safetyQuestionOutcomeChanged$.subscribe((result) => {
//         expect(result instanceof AnalyticRecorded).toBe(true);
//         expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
//           AnalyticsEventCategories.VEHICLE_CHECKS,
//           `safety question ${questionNumber + 1} outcome changed`,
//           'correct',
//         );
//         done();
//       });
//     });
//   });
//
//   describe('balanceQuestionChanged$ effect', () => {
//     const questionNumber: number = 1;
//     const balanceQuestion: QuestionResult = {
//       code: 'T01',
//     };
//     it('should log an analyics event with balance question info', (done) => {
//       store$.dispatch(new testsActions.StartTest(12345, TestCategory.EUAM2));
//       actions$.next(new SafetyAndBalanceQuestionsActions.BalanceQuestionSelected(balanceQuestion, questionNumber));
//       effects.balanceQuestionChanged$.subscribe((result) => {
//         expect(result instanceof AnalyticRecorded).toBe(true);
//         expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
//           AnalyticsEventCategories.VEHICLE_CHECKS,
//           `balance question ${questionNumber + 1} changed`,
//           balanceQuestion.code,
//         );
//         done();
//       });
//     });
//   });
//
//   describe('balanceQuestionOutComeChanged$', () => {
//     const questionOutcome: QuestionOutcome = 'DF';
//     const questionNumber: number = 1;
//     it('should log an analytics event with balance question outcome info', (done) => {
//       store$.dispatch(new testsActions.StartTest(12345, TestCategory.EUAM2));
//       actions$.next(
//         new SafetyAndBalanceQuestionsActions.BalanceQuestionOutcomeChanged(questionOutcome, questionNumber));
//       effects.balanceQuestionOutcomeChanged$.subscribe((result) => {
//         expect(result instanceof AnalyticRecorded).toBe(true);
//         expect(analyticsProviderMock.logEvent).toHaveBeenCalledWith(
//           AnalyticsEventCategories.VEHICLE_CHECKS,
//           `balance question ${questionNumber + 1} outcome changed`,
//           'driving fault',
//         );
//         done();
//       });
//     });
//   });
//
// });
