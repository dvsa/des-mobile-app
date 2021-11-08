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
import { Router } from '@angular/router';
import { NavigationStateProvider } from '@providers/navigation-state/navigation-state';
import { ActivityCodes } from '@shared/models/activity-codes';
import { getEnumKeyByValue } from '@shared/helpers/enum-keys';
import * as activityCodeActions from '@store/tests/activity-code/activity-code.actions';
import * as passFinalisationActions from '@pages/pass-finalisation/pass-finalisation.actions';
import { TestsModel } from './tests.model';
import {
  TestOutcomeChanged,
  SendCompletedTestsFailure,
  StartTest,
  SendPartialTestsFailure,
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
    public router: Router,
    private navigationStateProvider: NavigationStateProvider,
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

  testOutcomeChangedEffect$ = createEffect(() => this.actions$.pipe(
    ofType(TestOutcomeChanged),
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

  startTestAnalyticsEffect$ = createEffect(() => this.actions$.pipe(
    ofType(StartTest),
    switchMap((action: ReturnType<typeof StartTest>) => {
      const category: AnalyticsEventCategories = this.navigationStateProvider.isRekeySearch()
        ? AnalyticsEventCategories.REKEY_SEARCH
        : AnalyticsEventCategories.JOURNAL;

      this.analytics.addCustomDimension(AnalyticsDimensionIndices.TEST_CATEGORY, action.category);
      this.analytics.logEvent(
        category,
        AnalyticsEvents.START_TEST,
      );

      return of(AnalyticRecorded());
    }),
  ));

  setActivityCode$ = createEffect(() => this.actions$.pipe(
    ofType(
      activityCodeActions.SetActivityCode,
      passFinalisationActions.PassFinalisationReportActivityCode,
    ),
    concatMap((action) => of(action).pipe(
      withLatestFrom(
        this.store$.pipe(
          select(getTests),
        ),
      ),
    )),
    concatMap(([{ activityCode }, tests]: [ReturnType <typeof activityCodeActions.SetActivityCode>, TestsModel]) => {
      const [description, code] = getEnumKeyByValue(ActivityCodes, activityCode);
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.POST_TEST, tests),
        formatAnalyticsText(AnalyticsEvents.SET_ACTIVITY_CODE, tests),
        `${code} - ${description}`,
      );
      return of(AnalyticRecorded());
    }),
  ));
}
