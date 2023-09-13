import { Injectable } from '@angular/core';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { concatMap, switchMap, withLatestFrom } from 'rxjs/operators';
import {
  AnalyticsDimensionIndices,
  AnalyticsEventCategories,
  AnalyticsEvents,
} from '@providers/analytics/analytics.model';
import { of } from 'rxjs';
import { AnalyticNotRecorded, AnalyticRecorded } from '@providers/analytics/analytics.actions';
import { formatApplicationReference } from '@shared/helpers/formatters';
import { formatAnalyticsText } from '@shared/helpers/format-analytics-text';
import { Router } from '@angular/router';
import { NavigationStateProvider } from '@providers/navigation-state/navigation-state';
import {
  getApplicationNumber,
} from '@store/tests/journal-data/common/application-reference/application-reference.selector';
import {
  getApplicationReference,
} from '@store/tests/journal-data/common/application-reference/application-reference.reducer';
import { getTestOutcome } from '@pages/debrief/debrief.selector';
import { TestResultCommonSchema } from '@dvsa/mes-test-schema/categories/common';
import * as testActions from '@store/tests/tests.actions';
import { TestsModel } from './tests.model';
import { SendCompletedTestsFailure, SendPartialTestsFailure, StartTest, TestOutcomeChanged } from './tests.actions';
import { getCurrentTest, getJournalData, getTestById } from './tests.selector';
import { getTests } from './tests.reducer';
import { SetTestStatusSubmitted } from './test-status/test-status.actions';

@Injectable()
export class TestsAnalyticsEffects {
  private formatter = (actionType: string) => actionType
    .replace('[TestsEffects] ', '')
    .toLowerCase();

  constructor(
    private analytics: AnalyticsProvider,
    private actions$: Actions,
    private store$: Store<StoreModel>,
    public router: Router,
    private navigationStateProvider: NavigationStateProvider,
  ) {
  }

  setTestStatusSubmittedEffect$ = createEffect(() => this.actions$.pipe(
    ofType(SetTestStatusSubmitted),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
        ),
      )),
    concatMap(([action, tests]: [ReturnType<typeof SetTestStatusSubmitted>, TestsModel]) => {
      const test = getTestById(tests, action.slotId);
      const testOutcome = getTestOutcome(test as TestResultCommonSchema);
      const isRekey: boolean = test.rekey;
      const journalDataOfTest = test.journalData;

      this.analytics.logEvent(
        AnalyticsEventCategories.POST_TEST,
        isRekey ? AnalyticsEvents.SUBMIT_REKEY_TEST : AnalyticsEvents.SUBMIT_TEST,
        testOutcome,
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
    ofType(SendCompletedTestsFailure),
    switchMap(() => {
      this.analytics.logError('Error connecting to microservice (test submission)', 'No message');
      return of(AnalyticRecorded());
    }),
  ));

  sendPartialTestsFailureEffect$ = createEffect(() => this.actions$.pipe(
    ofType(SendPartialTestsFailure),
    switchMap(() => {
      this.analytics.logError('Error connecting to microservice (partial test submission)', 'No message');
      return of(AnalyticRecorded());
    }),
  ));

  sendTestSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(
      testActions.SendPartialTestSuccess,
      testActions.SendCompletedTestSuccess,
    ),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
        ),
      )),
    switchMap((
      [action, tests]:
      [ReturnType<typeof testActions.SendPartialTestSuccess | typeof testActions.SendCompletedTestSuccess>, TestsModel],
    ) => {
      const slotID = action.payload;

      const test = tests.startedTests[slotID];
      if (!test) return of(AnalyticNotRecorded());

      const { journalData } = test;

      this.analytics.logEvent(
        AnalyticsEventCategories.TEST_SUBMISSION,
        this.formatter(action.type),
        JSON.stringify({
          slotID,
          appRef: formatApplicationReference(journalData.applicationReference),
          testStatus: action.testStatus,
        }),
      );

      return of(AnalyticRecorded());
    }),
  ));

  testOutcomeChangedEffect$ = createEffect(() => this.actions$.pipe(
    ofType(TestOutcomeChanged),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
        ),
      )),
    switchMap(([action, tests]: [ReturnType<typeof TestOutcomeChanged>, TestsModel]) => {
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
        AnalyticsDimensionIndices.CANDIDATE_ID,
        journalDataOfTest.candidate.candidateId.toString(),
      );

      return of(AnalyticRecorded());
    }),
  ));

  startTestAnalyticsEffect$ = createEffect(() => this.actions$.pipe(
    ofType(StartTest),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
            select(getCurrentTest),
            select(getJournalData),
            select(getApplicationReference),
            select(getApplicationNumber),
          ),
        ),
      )),
    switchMap(([action, applicationReference]: [ReturnType<typeof StartTest>, string]) => {
      const category: AnalyticsEventCategories = this.navigationStateProvider.isRekeySearch()
        ? AnalyticsEventCategories.REKEY_SEARCH
        : AnalyticsEventCategories.JOURNAL;

      this.analytics.addCustomDimension(AnalyticsDimensionIndices.TEST_CATEGORY, action.category);
      this.analytics.addCustomDimension(
        AnalyticsDimensionIndices.APPLICATION_REFERENCE, applicationReference,
      );

      this.analytics.logEvent(
        category,
        AnalyticsEvents.START_TEST,
      );

      return of(AnalyticRecorded());
    }),
  ));
}
