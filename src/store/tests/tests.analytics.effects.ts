import { Injectable } from '@angular/core';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import {
  Actions, createEffect, ofType,
} from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { withLatestFrom, switchMap, concatMap } from 'rxjs/operators';
import {
  AnalyticsEventCategories,
  AnalyticsEvents,
  AnalyticsDimensionIndices,
} from '@providers/analytics/analytics.model';
import { of } from 'rxjs';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import { formatApplicationReference } from '@shared/helpers/formatters';
import { formatAnalyticsText } from '@shared/helpers/format-analytics-text';
import { TestsModel } from './tests.model';
import {
  SEND_COMPLETED_TESTS_FAILURE,
  TEST_OUTCOME_CHANGED,
  TestOutcomeChanged,
  SEND_PARTIAL_TESTS_FAILURE,
  // @TODO - enable when test below fixed
  // SendCompletedTestsFailure,
  // START_TEST,
  // StartTest,
  // SendPartialTestsFailure,
} from './tests.actions';
import { getTestById, isPassed, getCurrentTest } from './tests.selector';
import { getTests } from './tests.reducer';
import { SetTestStatusSubmitted } from './test-status/test-status.actions';

@Injectable()
export class TestsAnalyticsEffects {
  constructor(
    private analytics: AnalyticsProvider,
    private actions$: Actions,
    private store$: Store<StoreModel>,
  ) {
  }

  setTestStatusSubmittedEffect$ = createEffect(() => this.actions$.pipe(
    ofType(SetTestStatusSubmitted),
    concatMap((action) => of(action).pipe(
      withLatestFrom(
        this.store$.pipe(
          select(getTests),
        ),
      ),
    )),
    concatMap(([action, tests]: [ReturnType <typeof SetTestStatusSubmitted>, TestsModel]) => {
      const test = getTestById(tests, action.slotId);
      const isTestPassed = isPassed(test);
      const isRekey: boolean = test.rekey;
      const journalDataOfTest = test.journalData;

      this.analytics.logEvent(
        AnalyticsEventCategories.POST_TEST,
        isRekey ? AnalyticsEvents.SUBMIT_REKEY_TEST : AnalyticsEvents.SUBMIT_TEST,
        isTestPassed ? 'pass' : 'fail',
      );

      this.analytics.addCustomDimension(
        AnalyticsDimensionIndices.APPLICATION_REFERENCE,
        formatApplicationReference(journalDataOfTest.applicationReference),
      );
      this.analytics.addCustomDimension(
        AnalyticsDimensionIndices.CANDIDATE_ID,
        journalDataOfTest.candidate.candidateId ? journalDataOfTest.candidate.candidateId.toString() : null,
      );
      return of(AnalyticRecorded());
    }),
  ));

  sendCompletedTestsFailureEffect$ = createEffect(() => this.actions$.pipe(
    ofType(SEND_COMPLETED_TESTS_FAILURE),
    switchMap(() => {
      this.analytics.logError('Error connecting to microservice (test submission)', 'No message');
      return of(AnalyticRecorded());
    }),
  ));

  sendPartialTestsFailureEffect$ = createEffect(() => this.actions$.pipe(
    ofType(SEND_PARTIAL_TESTS_FAILURE),
    switchMap(() => {
      this.analytics.logError('Error connecting to microservice (partial test submission)', 'No message');
      return of(AnalyticRecorded());
    }),
  ));

  testOutcomeChangedEffect$ = createEffect(() => this.actions$.pipe(
    ofType(TEST_OUTCOME_CHANGED),
    concatMap((action) => of(action).pipe(
      withLatestFrom(
        this.store$.pipe(
          select(getTests),
        ),
      ),
    )),
    switchMap(([action, tests]: [ReturnType <typeof TestOutcomeChanged>, TestsModel]) => {
      const test = getCurrentTest(tests);
      const journalDataOfTest = test.journalData;

      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT, tests),
        formatAnalyticsText(AnalyticsEvents.TEST_OUTCOME_CHANGED, tests),
        action.outcome,
      );

      this.analytics.addCustomDimension(
        AnalyticsDimensionIndices.APPLICATION_REFERENCE,
        formatApplicationReference(journalDataOfTest.applicationReference),
      );
      this.analytics.addCustomDimension(
        AnalyticsDimensionIndices.CANDIDATE_ID, journalDataOfTest.candidate.candidateId.toString(),
      );

      return of(AnalyticRecorded());
    }),
  ));

  // @TODO - enable this effect without navigation state provider
  // startTestAnalyticsEffect$ = createEffect(() => this.actions$.pipe(
  //   ofType(START_TEST),
  //   switchMap((action: typeof StartTest) => {
  //
  //     const category: AnalyticsEventCategories = this.navigationStateProvider.isRekeySearch() ?
  //       AnalyticsEventCategories.REKEY_SEARCH :
  //       AnalyticsEventCategories.JOURNAL;
  //
  //     this.analytics.addCustomDimension(AnalyticsDimensionIndices.TEST_CATEGORY, action.category);
  //     this.analytics.logEvent(
  //       category,
  //       AnalyticsEvents.START_TEST,
  //     );
  //
  //     return of(new AnalyticRecorded());
  //   }),
  // ));
}
