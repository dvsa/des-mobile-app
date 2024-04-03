import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  concatMap, filter, switchMap, withLatestFrom,
} from 'rxjs/operators';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import {
  AnalyticsDimensionIndices,
  AnalyticsErrorTypes,
  AnalyticsEventCategories,
  AnalyticsEvents,
  AnalyticsScreenNames,
  GoogleAnalyticsEvents,
  GoogleAnalyticsEventsTitles,
  GoogleAnalyticsEventsValues,
} from '@providers/analytics/analytics.model';
import {
  CompleteTest,
  OfficeValidationError,
  OfficeViewDidEnter,
  SavingWriteUpForLater,
  TestStartDateChanged,
} from '@pages/office/office.actions';
import { CircuitTypeChanged } from '@store/tests/test-summary/cat-a-mod1/test-summary.cat-a-mod1.actions';
import { ModeOfTransportChanged } from '@store/tests/test-summary/cat-a-mod2/test-summary.cat-a-mod2.actions';
import { IndependentDrivingTypeChanged } from '@store/tests/test-summary/test-summary.actions';
import { select, Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { getTests } from '@store/tests/tests.reducer';
import {
  getCurrentTest, getJournalData, isPassed, isPracticeMode,
} from '@store/tests/tests.selector';
import { of } from 'rxjs';
import { formatAnalyticsText } from '@shared/helpers/format-analytics-text';
import { TestsModel } from '@store/tests/tests.model';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import { getCandidate } from '@store/tests/journal-data/common/candidate/candidate.reducer';
import { getCandidateId } from '@store/tests/journal-data/common/candidate/candidate.selector';
import {
  getApplicationReference,
} from '@store/tests/journal-data/common/application-reference/application-reference.reducer';
import {
  getApplicationNumber,
} from '@store/tests/journal-data/common/application-reference/application-reference.selector';
import { getTestCategory } from '@store/tests/category/category.reducer';
import { CategoryCode } from '@dvsa/mes-test-schema/categories/common';
import {
  AddEcoCaptureReason,
  AddEcoRelatedFault,
  ToggleFuelEfficientDriving,
} from '@store/tests/test-data/common/eco/eco.actions';
import {
  getEco,
  getEcoCaptureReason,
  getEcoRelatedFault,
  getFuelEfficientDriving,
} from '@store/tests/test-data/common/test-data.selector';
import { getTestData } from '@store/tests/test-data/cat-adi-part2/test-data.cat-adi-part2.reducer';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { getTestOutcome } from '@pages/debrief/debrief.selector';

@Injectable()
export class OfficeAnalyticsEffects {
  constructor(
    private analytics: AnalyticsProvider,
    private actions$: Actions,
    private store$: Store<StoreModel>,
    private appConfigProvider: AppConfigProvider,
  ) {
  }

  officeViewDidEnter$ = createEffect(() => this.actions$.pipe(
    ofType(OfficeViewDidEnter),
    concatMap((action) => of(action)
      .pipe(
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
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , , , , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    switchMap((
      [, tests, isTestPassed, candidateId, applicationReference]:
      [ReturnType<typeof OfficeViewDidEnter>, TestsModel, boolean, number, string, boolean],
    ) => {
      const screenName = isTestPassed
        ? formatAnalyticsText(AnalyticsScreenNames.PASS_TEST_SUMMARY, tests)
        : formatAnalyticsText(AnalyticsScreenNames.FAIL_TEST_SUMMARY, tests);

      // TODO - MES-9495 - remove old analytics
      this.analytics.addCustomDimension(AnalyticsDimensionIndices.CANDIDATE_ID, `${candidateId}`);
      this.analytics.addCustomDimension(AnalyticsDimensionIndices.APPLICATION_REFERENCE, applicationReference);
      this.analytics.setCurrentPage(screenName);

      // GA4 Analytics
      this.analytics.addGACustomDimension(AnalyticsDimensionIndices.CANDIDATE_ID, `${candidateId}`);
      this.analytics.addGACustomDimension(AnalyticsDimensionIndices.APPLICATION_REFERENCE, applicationReference);
      this.analytics.setGACurrentPage(screenName);
      return of(AnalyticRecorded());
    }),
  ));

  testStartDateChanged$ = createEffect(() => this.actions$.pipe(
    ofType(TestStartDateChanged),
    concatMap((action) => of(action)
      .pipe(
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
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , , , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    switchMap((
      [action, tests, candidateId, applicationReference]:
      [ReturnType<typeof TestStartDateChanged>, TestsModel, number, string, boolean],
    ) => {
      // TODO - MES-9495 - remove old analytics
      this.analytics.addCustomDimension(AnalyticsDimensionIndices.CANDIDATE_ID, `${candidateId}`);
      this.analytics.addCustomDimension(AnalyticsDimensionIndices.APPLICATION_REFERENCE, applicationReference);

      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.OFFICE, tests),
        formatAnalyticsText(AnalyticsEvents.DATE_OF_TEST_CHANGED, tests),
        `previous date: ${action.previousStartDate}; new date: ${action.customStartDate}`,
      );

      // GA4 Analytics
      this.analytics.addGACustomDimension(AnalyticsDimensionIndices.CANDIDATE_ID, `${candidateId}`);
      this.analytics.addGACustomDimension(AnalyticsDimensionIndices.APPLICATION_REFERENCE, applicationReference);

      this.analytics.logGAEvent(
        GoogleAnalyticsEvents.DATE_OF_TEST,
        GoogleAnalyticsEventsTitles.CHANGED_FROM,
        action.previousStartDate,
        GoogleAnalyticsEventsTitles.CHANGED_TO,
        action.customStartDate,
      );

      return of(AnalyticRecorded());
    }),
  ));

  savingWriteUpForLaterEffect$ = createEffect(() => this.actions$.pipe(
    ofType(SavingWriteUpForLater),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(getCurrentTest),
            select(getTestOutcome),
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
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , , , , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    switchMap((
      [, tests, testOutcome, candidateId, applicationReference]:
      [ReturnType<typeof SavingWriteUpForLater>, TestsModel, string, number, string, boolean],
    ) => {
      // TODO - MES-9495 - remove old analytics
      this.analytics.addCustomDimension(AnalyticsDimensionIndices.CANDIDATE_ID, `${candidateId}`);
      this.analytics.addCustomDimension(AnalyticsDimensionIndices.APPLICATION_REFERENCE, applicationReference);

      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.POST_TEST, tests),
        formatAnalyticsText(AnalyticsEvents.SAVE_WRITE_UP, tests),
        testOutcome,
      );

      // GA4 Analytics
      let eventValue = null;
      switch (testOutcome) {
        case 'Fail':
          eventValue = GoogleAnalyticsEventsValues.FAIL;
          break;
        case 'Pass':
          eventValue = GoogleAnalyticsEventsValues.PASS;
          break;
        case 'Terminated':
          eventValue = GoogleAnalyticsEventsValues.TERMINATED;
          break;
        default:
          eventValue = GoogleAnalyticsEventsValues.UNKNOWN;
      }

      this.analytics.addGACustomDimension(AnalyticsDimensionIndices.CANDIDATE_ID, `${candidateId}`);
      this.analytics.addGACustomDimension(AnalyticsDimensionIndices.APPLICATION_REFERENCE, applicationReference);

      this.analytics.logGAEvent(
        GoogleAnalyticsEvents.SAVE_WRITE_UP,
        GoogleAnalyticsEventsTitles.RESULT,
        eventValue,
      );
      return of(AnalyticRecorded());
    }),
  ));

  validationErrorEffect$ = createEffect(() => this.actions$.pipe(
    ofType(OfficeValidationError),
    concatMap((action) => of(action)
      .pipe(
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
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    switchMap((
      [action, tests, isTestPassed]: [ReturnType<typeof OfficeValidationError>, TestsModel, boolean, boolean],
    ) => {
      const screenName = isTestPassed ? AnalyticsScreenNames.PASS_TEST_SUMMARY : AnalyticsScreenNames.FAIL_TEST_SUMMARY;
      // TODO - MES-9495 - remove old analytics
      const formattedScreenName = formatAnalyticsText(screenName, tests);
      this.analytics.logError(`${AnalyticsErrorTypes.VALIDATION_ERROR} (${formattedScreenName})`, action.errorMessage);
      // GA4 Analytics

      let splitArray = action.errorMessage.split('-').map(value => {
        return value.split(' ')[0];
      });

      let controlName = splitArray[splitArray.length - 1];

      if (splitArray.length >= 3) {
        let faultType = null;
        switch (splitArray[2]) {
          case 'dangerous':
            faultType = GoogleAnalyticsEventsValues.DANGEROUS;
            break;
          case 'serious':
            faultType = GoogleAnalyticsEventsValues.SERIOUS;
            break;
          default:
            faultType = GoogleAnalyticsEventsValues.UNKNOWN;
        }
        this.analytics.logGAEvent(
          GoogleAnalyticsEvents.VALIDATION_ERROR,
          GoogleAnalyticsEventsTitles.BLANK_FIELD,
          controlName,
          GoogleAnalyticsEventsTitles.SEVERITY,
          faultType,
        );
      } else {
        this.analytics.logGAEvent(
          GoogleAnalyticsEvents.VALIDATION_ERROR,
          GoogleAnalyticsEventsTitles.BLANK_FIELD,
          controlName,
        );
      }
      return of(AnalyticRecorded());
    }),
  ));

  completeTest$ = createEffect(() => this.actions$.pipe(
    ofType(CompleteTest),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
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
            select(getTestOutcome),
          ),
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , , , , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    switchMap((
      [, candidateId, applicationReference, testOutcome, tests]:
      [ReturnType<typeof CompleteTest>, number, string, string, TestsModel, boolean],
    ) => {
      // TODO - MES-9495 - remove old analytics
      this.analytics.addCustomDimension(AnalyticsDimensionIndices.CANDIDATE_ID, `${candidateId}`);
      this.analytics.addCustomDimension(AnalyticsDimensionIndices.APPLICATION_REFERENCE, applicationReference);

      this.analytics.logEvent(
        AnalyticsEventCategories.POST_TEST,
        AnalyticsEvents.CONFIRM_UPLOAD,
        formatAnalyticsText(`Upload confirmed - ${testOutcome}`, tests),
      );

      //GA4 Analytics
      this.analytics.addGACustomDimension(AnalyticsDimensionIndices.CANDIDATE_ID, `${candidateId}`);
      this.analytics.addGACustomDimension(AnalyticsDimensionIndices.APPLICATION_REFERENCE, applicationReference);

      let eventValue = null;
      switch (testOutcome) {
        case 'Fail':
          eventValue = GoogleAnalyticsEventsValues.FAIL;
          break;
        case 'Pass':
          eventValue = GoogleAnalyticsEventsValues.PASS;
          break;
        case 'Terminated':
          eventValue = GoogleAnalyticsEventsValues.TERMINATED;
          break;
        default:
          eventValue = GoogleAnalyticsEventsValues.UNKNOWN;
      }

      this.analytics.logGAEvent(
        GoogleAnalyticsEvents.UPLOAD_CONFIRMED,
        GoogleAnalyticsEventsTitles.RESULT,
        eventValue,
      );

      return of(AnalyticRecorded());
    }),
  ));

  setCircuit$ = createEffect(() => this.actions$.pipe(
    ofType(CircuitTypeChanged),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(getCurrentTest),
            select(getTestCategory),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    concatMap((
      [action, tests, category]: [ReturnType<typeof CircuitTypeChanged>, TestsModel, CategoryCode, boolean],
    ) => {
      // TODO - MES-9495 - remove old analytics
      this.analytics.addCustomDimension(AnalyticsDimensionIndices.TEST_CATEGORY, category);
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.OFFICE, tests),
        formatAnalyticsText(AnalyticsEvents.CIRCUIT_CHANGED, tests),
        `Circuit type ${action.circuitType} selected`,
      );
      //GA4 Analytics
      let eventValue = null;
      switch (action.circuitType) {
        case 'Left':
          eventValue = GoogleAnalyticsEventsValues.LEFT;
          break;
        case 'Right':
          eventValue = GoogleAnalyticsEventsValues.RIGHT;
          break;
        default:
          eventValue = GoogleAnalyticsEventsValues.UNKNOWN;
      }

      this.analytics.addGACustomDimension(AnalyticsDimensionIndices.TEST_CATEGORY, category);
      this.analytics.logGAEvent(
        GoogleAnalyticsEvents.CIRCUIT_CHANGED,
        GoogleAnalyticsEventsTitles.DIRECTION,
        eventValue,
      );
      return of(AnalyticRecorded());
    }),
  ));

  setIndependentDrivingType$ = createEffect(() => this.actions$.pipe(
    ofType(IndependentDrivingTypeChanged),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(getCurrentTest),
            select(getTestCategory),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    concatMap((
      [action, tests, category]: [ReturnType<typeof IndependentDrivingTypeChanged>, TestsModel, CategoryCode, boolean],
    ) => {
      // TODO - MES-9495 - remove old analytics
      this.analytics.addCustomDimension(AnalyticsDimensionIndices.TEST_CATEGORY, category);
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.OFFICE, tests),
        formatAnalyticsText(AnalyticsEvents.INDEPENDENT_DRIVING_TYPE_CHANGED, tests),
        `${action.independentDriving} selected`,
      );

      //GA4 Analytics
      let eventValue = null;
      switch (action.independentDriving) {
        case 'Sat nav':
          eventValue = GoogleAnalyticsEventsValues.SAT_NAV;
          break;
        case 'Traffic signs':
          eventValue = GoogleAnalyticsEventsValues.TRAFFIC_SIGNS;
          break;
        case 'Diagram':
          eventValue = GoogleAnalyticsEventsValues.DIAGRAM;
          break;
        case 'N/A':
          eventValue = GoogleAnalyticsEventsValues.NOT_APPLICABLE;
          break;
        default:
          eventValue = GoogleAnalyticsEventsValues.UNKNOWN;
      }

      this.analytics.addGACustomDimension(AnalyticsDimensionIndices.TEST_CATEGORY, category);
      this.analytics.logGAEvent(
        GoogleAnalyticsEvents.INDEPENDENT_DRIVING,
        GoogleAnalyticsEventsTitles.DRIVING_TYPE,
        eventValue,
      );
      return of(AnalyticRecorded());
    }),
  ));

  setModeOfTransport$ = createEffect(() => this.actions$.pipe(
    ofType(ModeOfTransportChanged),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(getCurrentTest),
            select(getTestCategory),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    concatMap((
      [action, tests, category]: [ReturnType<typeof ModeOfTransportChanged>, TestsModel, CategoryCode, boolean],
    ) => {
      // TODO - MES-9495 - remove old analytics
      this.analytics.addCustomDimension(AnalyticsDimensionIndices.TEST_CATEGORY, category);
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.OFFICE, tests),
        formatAnalyticsText(AnalyticsEvents.MODE_OF_TRANSPORT_CHANGED, tests),
        `${action.modeOfTransport} selected`,
      );
      //GA4 Analytics
      this.analytics.addGACustomDimension(AnalyticsDimensionIndices.TEST_CATEGORY, category);

      let eventValue = null;
      switch (action.modeOfTransport) {
        case 'Bike to bike':
          eventValue = GoogleAnalyticsEventsValues.BIKE_TO_BIKE;
          break;
        case 'Car to bike':
          eventValue = GoogleAnalyticsEventsValues.CAR_TO_BIKE;
          break;
        case 'N/A':
          eventValue = GoogleAnalyticsEventsValues.NOT_APPLICABLE;
          break;
        default:
          eventValue = GoogleAnalyticsEventsValues.UNKNOWN;
      }

      this.analytics.logGAEvent(
        GoogleAnalyticsEvents.TRANSPORT_MODE,
        GoogleAnalyticsEventsTitles.CHANGED_TO,
        eventValue,
      );
      return of(AnalyticRecorded());
    }),
  ));

  setFuelEfficientDriving$ = createEffect(() => this.actions$.pipe(
    ofType(ToggleFuelEfficientDriving),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(getCurrentTest),
            select(getTestData),
            select(getEco),
            select(getFuelEfficientDriving),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    concatMap((
      [, tests, fuelEfficientDriving]: [ReturnType<typeof ToggleFuelEfficientDriving>, TestsModel, boolean, boolean],
    ) => {
      // TODO - MES-9495 - remove old analytics
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.OFFICE, tests),
        formatAnalyticsText(AnalyticsEvents.TOGGLE_FUEL_EFFICIENT_DRIVING, tests),
        `${fuelEfficientDriving ? 'Yes' : 'No'}`,
      );
      //GA4 Analytics
      this.analytics.logGAEvent(
        GoogleAnalyticsEvents.FUEL_EFFICIENT_DRIVING,
        GoogleAnalyticsEventsTitles.SELECTION,
        `${fuelEfficientDriving ? GoogleAnalyticsEventsValues.YES : GoogleAnalyticsEventsValues.NO}`,
      );
      return of(AnalyticRecorded());
    }),
  ));

  setEcoRelatedFault$ = createEffect(() => this.actions$.pipe(
    ofType(AddEcoRelatedFault),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(getCurrentTest),
            select(getTestData),
            select(getEco),
            select(getEcoRelatedFault),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    concatMap((
      [, tests, ecoRelatedFault]: [ReturnType<typeof AddEcoRelatedFault>, TestsModel, string, boolean],
    ) => {
      // TODO - MES-9495 - remove old analytics
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.OFFICE, tests),
        formatAnalyticsText(AnalyticsEvents.ECO_RELATED_FAULT_CHANGED, tests),
        ecoRelatedFault,
      );
      //GA4 Analytics
      this.analytics.logGAEvent(
        GoogleAnalyticsEvents.ADD_FAULT,
        GoogleAnalyticsEventsTitles.FAULT_TYPE,
        `${GoogleAnalyticsEventsValues.ECO}_${ecoRelatedFault}`,
      );
      return of(AnalyticRecorded());
    }),
  ));

  setEcoCaptureReason$ = createEffect(() => this.actions$.pipe(
    ofType(AddEcoCaptureReason),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(getCurrentTest),
            select(getTestData),
            select(getEco),
            select(getEcoCaptureReason),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    concatMap((
      [, tests, ecoCaptureReason]: [ReturnType<typeof AddEcoCaptureReason>, TestsModel, string, boolean],
    ) => {
      // TODO - MES-9495 - remove old analytics
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.OFFICE, tests),
        formatAnalyticsText(AnalyticsEvents.ECO_CAPTURE_REASON_CHANGED, tests),
        ecoCaptureReason,
      );
      //GA4 Analytics
      this.analytics.logGAEvent(
        GoogleAnalyticsEvents.FEEDBACK,
        GoogleAnalyticsEventsTitles.FEEDBACK_CATEGORY,
        GoogleAnalyticsEventsValues.ECO,
        GoogleAnalyticsEventsTitles.REASON,
        ecoCaptureReason,
      );
      return of(AnalyticRecorded());
    }),
  ));
}
