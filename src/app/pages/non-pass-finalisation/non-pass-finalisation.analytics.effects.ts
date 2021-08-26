// import { Injectable } from '@angular/core';
// import { AnalyticsProvider } from '../../providers/analytics/analytics';
// import { Actions, Effect, ofType } from '@ngrx/effects';
// import { Store, select } from '@ngrx/store';
// import { StoreModel } from '../../shared/models/store.model';
// import * as nonPassFinalisationActions from './non-pass-finalisation.actions';
// import * as vehicleDetailsActions from '../../modules/tests/vehicle-details/common/vehicle-details.actions';
// import * as testSummaryActions from '../../modules/tests/test-summary/common/test-summary.actions';
// import * as commsActions from '../../modules/tests/communication-preferences/communication-preferences.actions';
// import { of } from 'rxjs';
// import { withLatestFrom, switchMap, concatMap } from 'rxjs/operators';
// import { getTests } from '../../modules/tests/tests.reducer';
// import { AnalyticRecorded, AnalyticNotRecorded } from '../../providers/analytics/analytics.actions';
// import { TestsModel } from '../../modules/tests/tests.model';
// import { formatAnalyticsText } from '../../shared/helpers/format-analytics-text';
// import {
//   AnalyticsScreenNames,
//   AnalyticsErrorTypes,
//   AnalyticsEventCategories,
//   AnalyticsEvents,
// } from '../../providers/analytics/analytics.model';
// import { ActivityCode } from '@dvsa/mes-test-schema/categories/common';
// import { getCurrentTest } from '../../modules/tests/tests.selector';
// import { getActivityCode } from '../../modules/tests/activity-code/activity-code.reducer';
// import { Language } from '../../modules/tests/communication-preferences/communication-preferences.model';
//
// @Injectable()
// export class NonPassFinalisationAnalyticsEffects {
//   constructor(
//     private analytics: AnalyticsProvider,
//     private actions$: Actions,
//     private store$: Store<StoreModel>,
//   ) {
//   }
//
//   @Effect()
//   nonPassFinalisationViewDidEnterEffect$ = this.actions$.pipe(
//     ofType(nonPassFinalisationActions.NON_PASS_FINALISATION_VIEW_DID_ENTER),
//     concatMap(action => of(action).pipe(
//       withLatestFrom(
//         this.store$.pipe(
//           select(getTests),
//         ),
//       ),
//     )),
//     concatMap(([action, tests]: [nonPassFinalisationActions.NonPassFinalisationViewDidEnter, TestsModel]) => {
//       const screenName = formatAnalyticsText(AnalyticsScreenNames.NON_PASS_FINALISATION, tests);
//       this.analytics.setCurrentPage(screenName);
//       return of(new AnalyticRecorded());
//     }),
//   );
//
//   @Effect()
//   validationErrorEffect$ = this.actions$.pipe(
//     ofType(nonPassFinalisationActions.NON_PASS_FINALISATION_VALIDATION_ERROR),
//     concatMap(action => of(action).pipe(
//       withLatestFrom(
//         this.store$.pipe(
//           select(getTests),
//         ),
//       )),
//     ),
//     switchMap(([action, tests]: [nonPassFinalisationActions.NonPassFinalisationValidationError, TestsModel]) => {
//       const formattedScreenName = formatAnalyticsText(AnalyticsScreenNames.NON_PASS_FINALISATION, tests);
//       this.analytics.logError(
//         `${AnalyticsErrorTypes.VALIDATION_ERROR} (${formattedScreenName})`,
//         action.errorMessage,
//       );
//       return of(new AnalyticRecorded());
//     }),
//   );
//
//   @Effect()
//   transmissionChanged$ = this.actions$.pipe(
//     ofType(vehicleDetailsActions.GEARBOX_CATEGORY_CHANGED),
//     concatMap(action => of(action).pipe(
//       withLatestFrom(
//         this.store$.pipe(
//           select(getTests),
//         ),
//         this.store$.pipe(
//           select(getTests),
//           select(getCurrentTest),
//           select(getActivityCode),
//         ),
//       ),
//     )),
//     concatMap(([action, tests, activityCode]:
//         [vehicleDetailsActions.GearboxCategoryChanged, TestsModel, ActivityCode]) => {
//       if (activityCode != null) {
//         this.analytics.logEvent(
//           formatAnalyticsText(AnalyticsEventCategories.POST_TEST, tests),
//           formatAnalyticsText(AnalyticsEvents.GEARBOX_CATEGORY_CHANGED, tests),
//           action.gearboxCategory,
//         );
//         return of(new AnalyticRecorded());
//       }
//       return of(new AnalyticNotRecorded());
//     }),
//   );
//
//   @Effect()
//   d255Yes$ = this.actions$.pipe(
//     ofType(testSummaryActions.D255_YES),
//     concatMap(action => of(action).pipe(
//       withLatestFrom(
//         this.store$.pipe(
//           select(getTests),
//         ),
//       ),
//     )),
//     concatMap(([action, tests]: [testSummaryActions.D255Yes, TestsModel]) => {
//       this.analytics.logEvent(
//         formatAnalyticsText(AnalyticsEventCategories.POST_TEST, tests),
//         formatAnalyticsText(AnalyticsEvents.D255, tests),
//         'Yes',
//       );
//       return of(new AnalyticRecorded());
//     }),
//   );
//
//   @Effect()
//   d255No$ = this.actions$.pipe(
//     ofType(testSummaryActions.D255_NO),
//     concatMap(action => of(action).pipe(
//       withLatestFrom(
//         this.store$.pipe(
//           select(getTests),
//         ),
//       ),
//     )),
//     concatMap(([action, tests]: [testSummaryActions.D255No, TestsModel]) => {
//       this.analytics.logEvent(
//         formatAnalyticsText(AnalyticsEventCategories.POST_TEST, tests),
//         formatAnalyticsText(AnalyticsEvents.D255, tests),
//         'No',
//       );
//       return of(new AnalyticRecorded());
//     }),
//   );
//
//   @Effect()
//   candidateChoseToProccedWithTestInEnglish$ = this.actions$.pipe(
//     ofType(commsActions.CANDIDATE_CHOSE_TO_PROCEED_WITH_TEST_IN_ENGLISH),
//     concatMap(action => of(action).pipe(
//       withLatestFrom(
//         this.store$.pipe(
//           select(getTests),
//         ),
//         this.store$.pipe(
//           select(getTests),
//           select(getCurrentTest),
//           select(getActivityCode),
//         ),
//       ),
//     )),
//     concatMap(([action, tests, activityCode]:
//       [commsActions.CandidateChoseToProceedWithTestInEnglish, TestsModel, ActivityCode]) => {
//       if (activityCode !== null) {
//         this.analytics.logEvent(
//           formatAnalyticsText(AnalyticsEventCategories.POST_TEST, tests),
//           formatAnalyticsText(AnalyticsEvents.LANGUAGE_CHANGED, tests),
//           Language.ENGLISH,
//         );
//         return of(new AnalyticRecorded());
//       }
//       return of(new AnalyticNotRecorded());
//     }),
//   );
//
//   @Effect()
//   candidateChoseToProccedWithTestInWelsh$ = this.actions$.pipe(
//     ofType(commsActions.CANDIDATE_CHOSE_TO_PROCEED_WITH_TEST_IN_WELSH),
//     concatMap(action => of(action).pipe(
//       withLatestFrom(
//         this.store$.pipe(
//           select(getTests),
//         ),
//         this.store$.pipe(
//           select(getTests),
//           select(getCurrentTest),
//           select(getActivityCode),
//         ),
//       ),
//     )),
//     concatMap(([action, tests, activityCode]:
//       [commsActions.CandidateChoseToProceedWithTestInWelsh, TestsModel, ActivityCode]) => {
//       if (activityCode !== null) {
//         this.analytics.logEvent(
//           formatAnalyticsText(AnalyticsEventCategories.POST_TEST, tests),
//           formatAnalyticsText(AnalyticsEvents.LANGUAGE_CHANGED, tests),
//           Language.CYMRAEG,
//         );
//         return of(new AnalyticRecorded());
//       }
//       return of(new AnalyticNotRecorded());
//     }),
//   );
//
// }
