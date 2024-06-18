import { Injectable } from '@angular/core';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { concatMap, map, switchMap, withLatestFrom } from 'rxjs/operators';
import {
  AnalyticsDimensionIndices,
  AnalyticsEventCategories,
  AnalyticsEvents, GoogleAnalyticsCustomDimension,
  GoogleAnalyticsEvents,
  GoogleAnalyticsEventsTitles,
  GoogleAnalyticsEventsValues,
} from '@providers/analytics/analytics.model';
import { of } from 'rxjs';
import { AnalyticNotRecorded, AnalyticRecorded } from '@providers/analytics/analytics.actions';
import { formatApplicationReference } from '@shared/helpers/formatters';
import { analyticsEventTypePrefix, formatAnalyticsText } from '@shared/helpers/format-analytics-text';
import { Router } from '@angular/router';
import { NavigationStateProvider } from '@providers/navigation-state/navigation-state';
import { getTestOutcome } from '@pages/debrief/debrief.selector';
import { TestResultCommonSchema } from '@dvsa/mes-test-schema/categories/common';
import * as testActions from '@store/tests/tests.actions';
import { TestsModel } from './tests.model';
import { SendCompletedTestsFailure, SendPartialTestsFailure, StartTest, TestOutcomeChanged } from './tests.actions';
import { getCurrentTest, getTestById } from './tests.selector';
import { getTests } from './tests.reducer';
import { SetTestStatusSubmitted } from './test-status/test-status.actions';
import { DeviceProvider } from '@providers/device/device';
import { BatteryInfo, DeviceInfo } from '@capacitor/device/dist/esm/definitions';
import { getJournalState } from '@store/journal/journal.reducer';
import { getAppRefFromSlot, getSlotBySlotID, getSlotsOnSelectedDate } from '@store/journal/journal.selector';

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
    private device: DeviceProvider,
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

      // TODO - MES-9495 - remove old analytics
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

      // GA4 Analytics
      let returnValue = null;
      switch (testOutcome) {
        case 'Fail':
          returnValue = GoogleAnalyticsEventsValues.FAIL;
          break;
        case 'Pass':
          returnValue = GoogleAnalyticsEventsValues.PASS;
          break;
        case 'Terminated':
          returnValue = GoogleAnalyticsEventsValues.TERMINATED;
          break;
        default:
          returnValue = GoogleAnalyticsEventsValues.UNKNOWN;
          break;
      }

      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.SUBMIT_TEST, tests),
        GoogleAnalyticsEventsTitles.RESULT,
        returnValue,
      );

      this.analytics.addGACustomDimension(
        GoogleAnalyticsCustomDimension.APPLICATION_REFERENCE,
        formatApplicationReference(journalDataOfTest.applicationReference),
      );
      this.analytics.addGACustomDimension(
        GoogleAnalyticsCustomDimension.CANDIDATE_ID,
        journalDataOfTest.candidate.candidateId ? journalDataOfTest.candidate.candidateId.toString() : null,
      );

      return of(AnalyticRecorded());
    }),
  ));

  sendCompletedTestsFailureEffect$ = createEffect(() => this.actions$.pipe(
    ofType(SendCompletedTestsFailure),
    switchMap(() => {
      // TODO - MES-9495 - remove old analytics
      this.analytics.logError('Error connecting to microservice (test submission)', 'No message');
      // GA4 Analytics
      this.analytics.logGAEvent(
        GoogleAnalyticsEvents.MICROSERVICE_ERROR,
        GoogleAnalyticsEventsTitles.TEST_SUBMISSION,
        GoogleAnalyticsEventsValues.FULL,
      );
      return of(AnalyticRecorded());
    }),
  ));

  sendPartialTestsFailureEffect$ = createEffect(() => this.actions$.pipe(
    ofType(SendPartialTestsFailure),
    switchMap(() => {
      // TODO - MES-9495 - remove old analytics
      this.analytics.logError('Error connecting to microservice (partial test submission)', 'No message');
      // GA4 Analytics
      this.analytics.logGAEvent(
        GoogleAnalyticsEvents.MICROSERVICE_ERROR,
        GoogleAnalyticsEventsTitles.TEST_SUBMISSION,
        GoogleAnalyticsEventsValues.PARTIAL,
      );
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

      // TODO - MES-9495 - remove old analytics
      this.analytics.logEvent(
        AnalyticsEventCategories.TEST_SUBMISSION,
        this.formatter(action.type),
        JSON.stringify({
          slotID,
          appRef: formatApplicationReference(journalData.applicationReference),
          testStatus: action.testStatus,
        }),
      );
      // GA4 Analytics
      let submissionType: string;
      switch (this.formatter(action.type)) {
        case 'send completed tests success':
          submissionType = GoogleAnalyticsEventsValues.COMPLETED;
          break;
        case 'send partial tests success':
          submissionType = GoogleAnalyticsEventsValues.PARTIAL;
          break;
        default:
          submissionType = GoogleAnalyticsEventsValues.UNKNOWN;
      }
      this.analytics.logGAEvent(
        GoogleAnalyticsEvents.TEST_SUBMISSION,
        GoogleAnalyticsEventsTitles.STATUS,
        submissionType,
        GoogleAnalyticsEventsTitles.TEST_DETAILS,
        JSON.stringify({
          slotID,
          appRef: formatApplicationReference(journalData.applicationReference),
          testStatus: action.testStatus,
        },
        ));
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

      // TODO - MES-9495 - remove old analytics
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

      // GA4 Analytics
      let oldValue = null;
      let newValue = null;

      switch (action.outcome) {
        case 'fail to pass':
          oldValue = GoogleAnalyticsEventsValues.FAIL;
          newValue = GoogleAnalyticsEventsValues.PASS;
          break;
        case 'pass to fail':
          oldValue = GoogleAnalyticsEventsValues.PASS;
          newValue = GoogleAnalyticsEventsValues.FAIL;
          break;
        default:
          oldValue = GoogleAnalyticsEventsValues.UNKNOWN;
          newValue = GoogleAnalyticsEventsValues.UNKNOWN;
          break;
      }

      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.TEST_OUTCOME_CHANGED, tests),
        GoogleAnalyticsEventsTitles.OLD_RESULT,
        oldValue,
        GoogleAnalyticsEventsTitles.NEW_RESULT,
        newValue,
      );

      this.analytics.addGACustomDimension(
        GoogleAnalyticsCustomDimension.APPLICATION_REFERENCE,
        formatApplicationReference(journalDataOfTest.applicationReference),
      );
      this.analytics.addGACustomDimension(
        GoogleAnalyticsCustomDimension.CANDIDATE_ID,
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
            // Can't use getTests as this is creating a race condition between the state being populated
            // and the analytic firing, therefore use the Journal
            select(getJournalState),
            // Grab the days slots
            select(getSlotsOnSelectedDate),
            // Grab the slot where the action slotId matches
            map((slotItems) => getSlotBySlotID(slotItems, action.slotId)),
            // If the slot is returned, then retrieve the app ref data
            select(getAppRefFromSlot),
          ),
        ),
      )),
    switchMap(([action, applicationReference]) => Promise.all([
      action,
      applicationReference,
      this.device.getDeviceInfo(),
      this.device.getBatteryInfo(),
    ])),
    switchMap((
      [action, applicationReference, device, battery],
    ) => {
      const category: AnalyticsEventCategories = this.navigationStateProvider.isRekeySearch()
        ? AnalyticsEventCategories.REKEY_SEARCH
        : AnalyticsEventCategories.JOURNAL;

      // TODO - MES-9495 - remove old analytics
      this.analytics.addCustomDimension(AnalyticsDimensionIndices.TEST_CATEGORY, action.category);

      if (applicationReference) {
        this.analytics.addCustomDimension(
          AnalyticsDimensionIndices.APPLICATION_REFERENCE,
          formatApplicationReference(applicationReference),
        );
      }

      this.analytics.logEvent(category, AnalyticsEvents.START_TEST);

      this.analytics.logEvent(
        AnalyticsEventCategories.METADATA,
        AnalyticsEvents.REPORT_DEVICE_STATE,
        'batteryLevel',
        (battery as BatteryInfo).batteryLevel,
      );

      this.analytics.logEvent(
        AnalyticsEventCategories.METADATA,
        AnalyticsEvents.REPORT_DEVICE_STATE,
        'realDiskFree',
        (device as DeviceInfo).realDiskFree,
      );

      this.analytics.logEvent(
        AnalyticsEventCategories.METADATA,
        AnalyticsEvents.REPORT_DEVICE_STATE,
        'realDiskTotal',
        (device as DeviceInfo).realDiskTotal,
      );

      // GA4 Analytics
      const prefix = this.navigationStateProvider.isRekeySearch()
        ? 'RM_'
        : '';
      this.analytics.addGACustomDimension(GoogleAnalyticsCustomDimension.TEST_CATEGORY, action.category);

      if (applicationReference) {
        this.analytics.addGACustomDimension(
          GoogleAnalyticsCustomDimension.APPLICATION_REFERENCE,
          formatApplicationReference(applicationReference),
        );
      }

      this.analytics.logGAEvent(`${prefix}${GoogleAnalyticsEvents.START_TEST}`);

      this.analytics.logGAEvent(
        GoogleAnalyticsEvents.METADATA,
        GoogleAnalyticsEventsTitles.BATTERY_LEVEL,
        (battery as BatteryInfo).batteryLevel.toString(),
      );

      this.analytics.logGAEvent(
        GoogleAnalyticsEvents.METADATA,
        GoogleAnalyticsEventsTitles.HDD_FREE_MB,
        (device as DeviceInfo).realDiskFree.toString(),
      );

      this.analytics.logGAEvent(
        GoogleAnalyticsEvents.METADATA,
        GoogleAnalyticsEventsTitles.HDD_TOTAL_MB,
        (device as DeviceInfo).realDiskTotal.toString(),
      );

      return of(AnalyticRecorded());
    }),
  ));
}
