// import { Injectable } from '@angular/core';
// import { Actions, Effect, ofType } from '@ngrx/effects';
// import { AnalyticsProvider } from '../../../providers/analytics/analytics';
// import * as testStatusActions from './test-status.actions';
// import { concatMap } from 'rxjs/operators';
// import { AnalyticRecorded } from '../../../providers/analytics/analytics.actions';
// import { of } from 'rxjs';
// import { AnalyticsEventCategories, AnalyticsEvents } from '../../../providers/analytics/analytics.model';
//
// @Injectable()
// export class TestStatusAnalyticsEffects {
//
//   constructor(
//     public analytics: AnalyticsProvider,
//     private actions$: Actions,
//   ) {
//   }
//
//   @Effect()
//   setTestStatusDecidedEffect$ = this.actions$.pipe(
//     ofType(testStatusActions.SET_TEST_STATUS_DECIDED),
//     concatMap((action: testStatusActions.SetTestStatusBooked) => {
//
//       this.analytics.logEvent(
//         AnalyticsEventCategories.TEST_LIFECYCLE,
//         AnalyticsEvents.TEST_DECIDED,
//       );
//
//       return of(new AnalyticRecorded());
//     }),
//   );
//
//   @Effect()
//   setTestStatusWriteUpEffect$ = this.actions$.pipe(
//     ofType(testStatusActions.SET_TEST_STATUS_WRITE_UP),
//     concatMap((action: testStatusActions.SetTestStatusBooked) => {
//
//       this.analytics.logEvent(
//         AnalyticsEventCategories.TEST_LIFECYCLE,
//         AnalyticsEvents.TEST_IN_WRITE_UP,
//       );
//
//       return of(new AnalyticRecorded());
//     }),
//   );
//
//   @Effect()
//   setTestStatusAutosavedEffect$ = this.actions$.pipe(
//     ofType(testStatusActions.SET_TEST_STATUS_AUTOSAVED),
//     concatMap((action: testStatusActions.SetTestStatusBooked) => {
//
//       this.analytics.logEvent(
//         AnalyticsEventCategories.TEST_LIFECYCLE,
//         AnalyticsEvents.TEST_AUTOSAVED,
//       );
//
//       return of(new AnalyticRecorded());
//     }),
//   );
//
//   @Effect()
//   setTestStatusSubmittedEffect$ = this.actions$.pipe(
//     ofType(testStatusActions.SET_TEST_STATUS_SUBMITTED),
//     concatMap((action: testStatusActions.SetTestStatusBooked) => {
//
//       this.analytics.logEvent(
//         AnalyticsEventCategories.TEST_LIFECYCLE,
//         AnalyticsEvents.TEST_SUBMITTED,
//       );
//
//       return of(new AnalyticRecorded());
//     }),
//   );
//
// }
