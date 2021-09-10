import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { withLatestFrom, switchMap, concatMap } from 'rxjs/operators';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import {
  AnalyticsScreenNames, AnalyticsDimensionIndices, AnalyticsEventCategories, AnalyticsEvents, AnalyticsErrorTypes,
} from '@providers/analytics/analytics.model';
import {
  OfficeValidationError,
  SavingWriteUpForLater,
  OfficeViewDidEnter,
  CompleteTest,
  TestStartDateChanged,
} from '@pages/office/office.actions';
import {
  CircuitTypeChanged,
} from '@store/tests/test-summary/cat-a-mod1/test-summary.cat-a-mod1.actions';
import {
  ModeOfTransportChanged,
} from '@store/tests/test-summary/cat-a-mod2/test-summary.cat-a-mod2.actions';
import {
  IndependentDrivingTypeChanged,
} from '@store/tests/test-summary/test-summary.actions';
import { Store, select } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest, isPassed, getJournalData } from '@store/tests/tests.selector';
import { of } from 'rxjs';
import { formatAnalyticsText } from '@shared/helpers/format-analytics-text';
import { TestsModel } from '@store/tests/tests.model';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import { getCandidate } from '@store/tests/journal-data/common/candidate/candidate.reducer';
import { getCandidateId } from '@store/tests/journal-data/common/candidate/candidate.selector';
import { isRekey } from '@store/tests/rekey/rekey.selector';
import { getRekeyIndicator } from '@store/tests/rekey/rekey.reducer';
import {
  getApplicationReference,
} from '@store/tests/journal-data/common/application-reference/application-reference.reducer';
import {
  getApplicationNumber,
} from '@store/tests/journal-data/common/application-reference/application-reference.selector';
import { getTestCategory } from '@store/tests/category/category.reducer';
import { CategoryCode } from '@dvsa/mes-test-schema/categories/common';

@Injectable()
export class OfficeAnalyticsEffects {
  constructor(
    private analytics: AnalyticsProvider,
    private actions$: Actions,
    private store$: Store<StoreModel>,
  ) {
  }

  officeViewDidEnter$ = createEffect(() => this.actions$.pipe(
    ofType(OfficeViewDidEnter),
    concatMap((action) => of(action).pipe(
      withLatestFrom(
        this.store$.pipe(
          select(getTests),
        ),
        this.store$.pipe(
          select(getTests),
          select(getCurrentTest),
          select(isPassed),
        ),
        this.store$.pipe(
          select(getTests),
          select(getCurrentTest),
          select(getJournalData),
          select(getCandidate),
          select(getCandidateId),
        ),
        this.store$.pipe(
          select(getTests),
          select(getCurrentTest),
          select(getJournalData),
          select(getApplicationReference),
          select(getApplicationNumber),
        ),
      ),
    )),
    switchMap((
      [, tests, isTestPassed, candidateId, applicationReference]:
      [ReturnType<typeof OfficeViewDidEnter>, TestsModel, boolean, number, string],
    ) => {
      const screenName = isTestPassed
        ? formatAnalyticsText(AnalyticsScreenNames.PASS_TEST_SUMMARY, tests)
        : formatAnalyticsText(AnalyticsScreenNames.FAIL_TEST_SUMMARY, tests);
      this.analytics.addCustomDimension(AnalyticsDimensionIndices.CANDIDATE_ID, `${candidateId}`);
      this.analytics.addCustomDimension(AnalyticsDimensionIndices.APPLICATION_REFERENCE, applicationReference);
      this.analytics.setCurrentPage(screenName);
      return of(AnalyticRecorded());
    }),
  ));

  testStartDateChanged$ = createEffect(() => this.actions$.pipe(
    ofType(TestStartDateChanged),
    concatMap((action) => of(action).pipe(
      withLatestFrom(
        this.store$.pipe(
          select(getTests),
        ),
        this.store$.pipe(
          select(getTests),
          select(getCurrentTest),
          select(getJournalData),
          select(getCandidate),
          select(getCandidateId),
        ),
        this.store$.pipe(
          select(getTests),
          select(getCurrentTest),
          select(getJournalData),
          select(getApplicationReference),
          select(getApplicationNumber),
        ),
      ),
    )),
    switchMap((
      [action, tests, candidateId, applicationReference]:
      [ReturnType<typeof TestStartDateChanged>, TestsModel, number, string],
    ) => {

      this.analytics.addCustomDimension(AnalyticsDimensionIndices.CANDIDATE_ID, `${candidateId}`);
      this.analytics.addCustomDimension(AnalyticsDimensionIndices.APPLICATION_REFERENCE, applicationReference);

      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.OFFICE, tests),
        formatAnalyticsText(AnalyticsEvents.DATE_OF_TEST_CHANGED, tests),
        `previous date: ${action.previousStartDate}; new date: ${action.customStartDate}`,
      );

      return of(AnalyticRecorded());
    }),
  ));

  savingWriteUpForLaterEffect$ = createEffect(() => this.actions$.pipe(
    ofType(SavingWriteUpForLater),
    concatMap((action) => of(action).pipe(
      withLatestFrom(
        this.store$.pipe(
          select(getTests),
        ),
        this.store$.pipe(
          select(getTests),
          select(getCurrentTest),
          select(isPassed),
        ),
        this.store$.pipe(
          select(getTests),
          select(getCurrentTest),
          select(getJournalData),
          select(getCandidate),
          select(getCandidateId),
        ),
        this.store$.pipe(
          select(getTests),
          select(getCurrentTest),
          select(getJournalData),
          select(getApplicationReference),
          select(getApplicationNumber),
        ),
      ),
    )),
    switchMap(([, tests, isTestPassed, candidateId, applicationReference]:
    [ReturnType<typeof SavingWriteUpForLater>, TestsModel, boolean, number, string]) => {
      this.analytics.addCustomDimension(AnalyticsDimensionIndices.CANDIDATE_ID, `${candidateId}`);
      this.analytics.addCustomDimension(AnalyticsDimensionIndices.APPLICATION_REFERENCE, applicationReference);

      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.POST_TEST, tests),
        formatAnalyticsText(AnalyticsEvents.SAVE_WRITE_UP, tests),
        isTestPassed ? 'pass' : 'fail',
      );
      return of(AnalyticRecorded());
    }),
  ));

  validationErrorEffect$ = createEffect(() => this.actions$.pipe(
    ofType(OfficeValidationError),
    concatMap((action) => of(action).pipe(
      withLatestFrom(
        this.store$.pipe(
          select(getTests),
        ),
        this.store$.pipe(
          select(getTests),
          select(getCurrentTest),
          select(isPassed),
        ),
      ),
    )),
    switchMap(([action, tests, isTestPassed]: [ReturnType<typeof OfficeValidationError>, TestsModel, boolean]) => {
      const screenName = isTestPassed ? AnalyticsScreenNames.PASS_TEST_SUMMARY : AnalyticsScreenNames.FAIL_TEST_SUMMARY;
      const formattedScreenName = formatAnalyticsText(screenName, tests);
      this.analytics.logError(`${AnalyticsErrorTypes.VALIDATION_ERROR} (${formattedScreenName})`,
        action.errorMessage);
      return of(AnalyticRecorded());
    }),
  ));

  completeTest$ = createEffect(() => this.actions$.pipe(
    ofType(CompleteTest),
    concatMap((action) => of(action).pipe(
      withLatestFrom(
        this.store$.pipe(
          select(getTests),
          select(getCurrentTest),
          select(getRekeyIndicator),
          select(isRekey),
        ),
        this.store$.pipe(
          select(getTests),
          select(getCurrentTest),
          select(getJournalData),
          select(getCandidate),
          select(getCandidateId),
        ),
        this.store$.pipe(
          select(getTests),
          select(getCurrentTest),
          select(getJournalData),
          select(getApplicationReference),
          select(getApplicationNumber),
        ),
        this.store$.pipe(
          select(getTests),
          select(getCurrentTest),
          select(isPassed),
        ),
      ),
    )),
    switchMap((
      [, isTestRekey, candidateId, applicationReference, isTestPassed]:
      [ReturnType<typeof CompleteTest>, boolean, number, string, boolean],
    ) => {

      this.analytics.addCustomDimension(AnalyticsDimensionIndices.CANDIDATE_ID, `${candidateId}`);
      this.analytics.addCustomDimension(AnalyticsDimensionIndices.APPLICATION_REFERENCE, applicationReference);

      this.analytics.logEvent(
        AnalyticsEventCategories.POST_TEST,
        isTestRekey ? AnalyticsEvents.COMPLETE_REKEY_TEST : AnalyticsEvents.COMPLETE_TEST,
        isTestPassed ? 'pass' : 'fail',
      );

      return of(AnalyticRecorded());
    }),
  ));

  setCircuit$ = createEffect(() => this.actions$.pipe(
    ofType(CircuitTypeChanged),
    concatMap((action) => of(action).pipe(
      withLatestFrom(
        this.store$.pipe(
          select(getTests),
        ),
        this.store$.pipe(
          select(getTests),
          select(getCurrentTest),
          select(getTestCategory),
        ),
      ),
    )),
    concatMap(([action, tests, category]: [ReturnType<typeof CircuitTypeChanged>, TestsModel, CategoryCode]) => {
      this.analytics.addCustomDimension(AnalyticsDimensionIndices.TEST_CATEGORY, category);
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.OFFICE, tests),
        formatAnalyticsText(AnalyticsEvents.CIRCUIT_CHANGED, tests),
        `Circuit type ${action.circuitType} selected`,
      );
      return of(AnalyticRecorded());
    }),
  ));

  setIndependentDrivingType$ = createEffect(() => this.actions$.pipe(
    ofType(IndependentDrivingTypeChanged),
    concatMap((action) => of(action).pipe(
      withLatestFrom(
        this.store$.pipe(
          select(getTests),
        ),
        this.store$.pipe(
          select(getTests),
          select(getCurrentTest),
          select(getTestCategory),
        ),
      ),
    )),
    // eslint-disable-next-line max-len
    concatMap(([action, tests, category]: [ReturnType<typeof IndependentDrivingTypeChanged>, TestsModel, CategoryCode]) => {
      this.analytics.addCustomDimension(AnalyticsDimensionIndices.TEST_CATEGORY, category);
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.OFFICE, tests),
        formatAnalyticsText(AnalyticsEvents.INDEPENDENT_DRIVING_TYPE_CHANGED, tests),
        `${action.drivingType} selected`,
      );
      return of(AnalyticRecorded());
    }),
  ));

  setModeOfTransport$ = createEffect(() => this.actions$.pipe(
    ofType(ModeOfTransportChanged),
    concatMap((action) => of(action).pipe(
      withLatestFrom(
        this.store$.pipe(
          select(getTests),
        ),
        this.store$.pipe(
          select(getTests),
          select(getCurrentTest),
          select(getTestCategory),
        ),
      ),
    )),
    concatMap(([action, tests, category]: [ReturnType<typeof ModeOfTransportChanged>, TestsModel, CategoryCode]) => {
      this.analytics.addCustomDimension(AnalyticsDimensionIndices.TEST_CATEGORY, category);
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.OFFICE, tests),
        formatAnalyticsText(AnalyticsEvents.MODE_OF_TRANSPORT_CHANGED, tests),
        `${action.modeOfTransport} selected`,
      );
      return of(AnalyticRecorded());
    }),
  ));
}
