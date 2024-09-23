import { Injectable } from '@angular/core';
import { CategoryCode } from '@dvsa/mes-test-schema/categories/common';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { getTestOutcome } from '@pages/debrief/debrief.selector';
import {
  CompleteTest,
  OfficeValidationError,
  OfficeViewDidEnter,
  SavingWriteUpForLater,
  TestStartDateChanged,
} from '@pages/office/office.actions';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import {
  AnalyticsScreenNames,
  GoogleAnalyticsCustomDimension,
  GoogleAnalyticsEvents,
  GoogleAnalyticsEventsTitles,
  GoogleAnalyticsEventsValues,
} from '@providers/analytics/analytics.model';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { analyticsEventTypePrefix } from '@shared/helpers/format-analytics-text';
import { StoreModel } from '@shared/models/store.model';
import { getTestCategory } from '@store/tests/category/category.reducer';
import { getApplicationReference } from '@store/tests/journal-data/common/application-reference/application-reference.reducer';
import { getApplicationNumber } from '@store/tests/journal-data/common/application-reference/application-reference.selector';
import { getCandidate } from '@store/tests/journal-data/common/candidate/candidate.reducer';
import { getCandidateId } from '@store/tests/journal-data/common/candidate/candidate.selector';
import { getTestData } from '@store/tests/test-data/cat-adi-part2/test-data.cat-adi-part2.reducer';
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
import { CircuitTypeChanged } from '@store/tests/test-summary/cat-a-mod1/test-summary.cat-a-mod1.actions';
import { ModeOfTransportChanged } from '@store/tests/test-summary/cat-a-mod2/test-summary.cat-a-mod2.actions';
import { IndependentDrivingTypeChanged } from '@store/tests/test-summary/test-summary.actions';
import { TestsModel } from '@store/tests/tests.model';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest, getJournalData, isPassed, isPracticeMode } from '@store/tests/tests.selector';
import { MotEvidenceChanged } from '@store/tests/vehicle-details/vehicle-details.actions';
import { of } from 'rxjs';
import { concatMap, filter, switchMap, withLatestFrom } from 'rxjs/operators';

@Injectable()
export class OfficeAnalyticsEffects {
  getEventValue(inputValue: string) {
    let returnValue = null;

    switch (inputValue) {
      case 'dangerous':
        returnValue = GoogleAnalyticsEventsValues.DANGEROUS;
        break;
      case 'serious':
        returnValue = GoogleAnalyticsEventsValues.SERIOUS;
        break;
      case 'Fail':
        returnValue = GoogleAnalyticsEventsValues.FAIL;
        break;
      case 'Pass':
        returnValue = GoogleAnalyticsEventsValues.PASS;
        break;
      case 'Terminated':
        returnValue = GoogleAnalyticsEventsValues.TERMINATED;
        break;
      case 'Sat nav':
        returnValue = GoogleAnalyticsEventsValues.SAT_NAV;
        break;
      case 'Traffic signs':
        returnValue = GoogleAnalyticsEventsValues.TRAFFIC_SIGNS;
        break;
      case 'Diagram':
        returnValue = GoogleAnalyticsEventsValues.DIAGRAM;
        break;
      case 'Bike to bike':
        returnValue = GoogleAnalyticsEventsValues.BIKE_TO_BIKE;
        break;
      case 'Car to bike':
        returnValue = GoogleAnalyticsEventsValues.CAR_TO_BIKE;
        break;
      case 'Left':
        returnValue = GoogleAnalyticsEventsValues.LEFT;
        break;
      case 'Right':
        returnValue = GoogleAnalyticsEventsValues.RIGHT;
        break;
      case 'N/A':
        returnValue = GoogleAnalyticsEventsValues.NOT_APPLICABLE;
        break;
      default:
        returnValue = GoogleAnalyticsEventsValues.UNKNOWN;
    }

    return returnValue;
  }

  constructor(
    private analytics: AnalyticsProvider,
    private actions$: Actions,
    private store$: Store<StoreModel>,
    private appConfigProvider: AppConfigProvider
  ) {}

  officeViewDidEnter$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OfficeViewDidEnter),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(
            this.store$.pipe(select(getTests)),
            this.store$.pipe(select(getTests), select(getCurrentTest), select(isPassed)),
            this.store$.pipe(
              select(getTests),
              select(getCurrentTest),
              select(getJournalData),
              select(getCandidate),
              select(getCandidateId)
            ),
            this.store$.pipe(
              select(getTests),
              select(getCurrentTest),
              select(getJournalData),
              select(getApplicationReference),
              select(getApplicationNumber)
            ),
            this.store$.pipe(select(getTests), select(isPracticeMode))
          )
        )
      ),
      filter(([, , , , , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      switchMap(
        ([, tests, isTestPassed, candidateId, applicationReference]: [
          ReturnType<typeof OfficeViewDidEnter>,
          TestsModel,
          boolean,
          number,
          string,
          boolean,
        ]) => {
          // GA4 Analytics
          const screenName = isTestPassed
            ? analyticsEventTypePrefix(AnalyticsScreenNames.PASS_TEST_SUMMARY, tests)
            : analyticsEventTypePrefix(AnalyticsScreenNames.FAIL_TEST_SUMMARY, tests);
          this.analytics.addGACustomDimension(GoogleAnalyticsCustomDimension.CANDIDATE_ID, `${candidateId}`);
          this.analytics.addGACustomDimension(
            GoogleAnalyticsCustomDimension.APPLICATION_REFERENCE,
            applicationReference
          );
          this.analytics.setGACurrentPage(screenName);
          return of(AnalyticRecorded());
        }
      )
    )
  );

  testStartDateChanged$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TestStartDateChanged),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(
            this.store$.pipe(select(getTests)),
            this.store$.pipe(
              select(getTests),
              select(getCurrentTest),
              select(getJournalData),
              select(getCandidate),
              select(getCandidateId)
            ),
            this.store$.pipe(
              select(getTests),
              select(getCurrentTest),
              select(getJournalData),
              select(getApplicationReference),
              select(getApplicationNumber)
            ),
            this.store$.pipe(select(getTests), select(isPracticeMode))
          )
        )
      ),
      filter(([, , , , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      switchMap(
        ([action, , candidateId, applicationReference]: [
          ReturnType<typeof TestStartDateChanged>,
          TestsModel,
          number,
          string,
          boolean,
        ]) => {
          // GA4 Analytics
          this.analytics.addGACustomDimension(GoogleAnalyticsCustomDimension.CANDIDATE_ID, `${candidateId}`);
          this.analytics.addGACustomDimension(
            GoogleAnalyticsCustomDimension.APPLICATION_REFERENCE,
            applicationReference
          );

          this.analytics.logGAEvent(
            GoogleAnalyticsEvents.DATE_OF_TEST,
            GoogleAnalyticsEventsTitles.CHANGED_FROM,
            action.previousStartDate,
            GoogleAnalyticsEventsTitles.CHANGED_TO,
            action.customStartDate
          );

          return of(AnalyticRecorded());
        }
      )
    )
  );

  savingWriteUpForLaterEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SavingWriteUpForLater),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(
            this.store$.pipe(select(getTests)),
            this.store$.pipe(select(getTests), select(getCurrentTest), select(getTestOutcome)),
            this.store$.pipe(
              select(getTests),
              select(getCurrentTest),
              select(getJournalData),
              select(getCandidate),
              select(getCandidateId)
            ),
            this.store$.pipe(
              select(getTests),
              select(getCurrentTest),
              select(getJournalData),
              select(getApplicationReference),
              select(getApplicationNumber)
            ),
            this.store$.pipe(select(getTests), select(isPracticeMode))
          )
        )
      ),
      filter(([, , , , , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      switchMap(
        ([, , testOutcome, candidateId, applicationReference]: [
          ReturnType<typeof SavingWriteUpForLater>,
          TestsModel,
          string,
          number,
          string,
          boolean,
        ]) => {
          // GA4 Analytics
          const eventValue = this.getEventValue(testOutcome);

          this.analytics.addGACustomDimension(GoogleAnalyticsCustomDimension.CANDIDATE_ID, `${candidateId}`);
          this.analytics.addGACustomDimension(
            GoogleAnalyticsCustomDimension.APPLICATION_REFERENCE,
            applicationReference
          );

          this.analytics.logGAEvent(
            GoogleAnalyticsEvents.SAVE_WRITE_UP,
            GoogleAnalyticsEventsTitles.RESULT,
            eventValue
          );
          return of(AnalyticRecorded());
        }
      )
    )
  );

  validationErrorEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OfficeValidationError),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(
            this.store$.pipe(select(getTests)),
            this.store$.pipe(select(getTests), select(getCurrentTest), select(isPassed)),
            this.store$.pipe(select(getTests), select(isPracticeMode))
          )
        )
      ),
      filter(([, , , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      switchMap(([action, tests]: [ReturnType<typeof OfficeValidationError>, TestsModel, boolean, boolean]) => {
        // GA4 Analytics

        let controlName = null;
        let splitArray = [];
        if (!action.errorMessage || action.errorMessage.length === 0) {
          controlName = GoogleAnalyticsEventsValues.UNKNOWN;
        } else {
          splitArray = action.errorMessage.split('-').map((value) => {
            return value.split(' ')[0];
          });
          controlName = splitArray[splitArray.length - 1];
        }
        if (splitArray.length >= 3) {
          const faultType = this.getEventValue(splitArray[2]);

          this.analytics.logGAEvent(
            analyticsEventTypePrefix(GoogleAnalyticsEvents.VALIDATION_ERROR, tests),
            GoogleAnalyticsEventsTitles.BLANK_FIELD,
            controlName,
            GoogleAnalyticsEventsTitles.SEVERITY,
            faultType
          );
        } else {
          this.analytics.logGAEvent(
            analyticsEventTypePrefix(GoogleAnalyticsEvents.VALIDATION_ERROR, tests),
            GoogleAnalyticsEventsTitles.BLANK_FIELD,
            controlName
          );
        }
        return of(AnalyticRecorded());
      })
    )
  );

  completeTest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CompleteTest),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(
            this.store$.pipe(
              select(getTests),
              select(getCurrentTest),
              select(getJournalData),
              select(getCandidate),
              select(getCandidateId)
            ),
            this.store$.pipe(
              select(getTests),
              select(getCurrentTest),
              select(getJournalData),
              select(getApplicationReference),
              select(getApplicationNumber)
            ),
            this.store$.pipe(select(getTests), select(getCurrentTest), select(getTestOutcome)),
            this.store$.pipe(select(getTests)),
            this.store$.pipe(select(getTests), select(isPracticeMode))
          )
        )
      ),
      filter(([, , , , , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      switchMap(
        ([, candidateId, applicationReference, testOutcome, tests]: [
          ReturnType<typeof CompleteTest>,
          number,
          string,
          string,
          TestsModel,
          boolean,
        ]) => {
          //GA4 Analytics
          this.analytics.addGACustomDimension(GoogleAnalyticsCustomDimension.CANDIDATE_ID, `${candidateId}`);
          this.analytics.addGACustomDimension(
            GoogleAnalyticsCustomDimension.APPLICATION_REFERENCE,
            applicationReference
          );

          const eventValue = this.getEventValue(testOutcome);

          this.analytics.logGAEvent(
            analyticsEventTypePrefix(GoogleAnalyticsEvents.UPLOAD_CONFIRMED, tests),
            GoogleAnalyticsEventsTitles.RESULT,
            eventValue
          );

          return of(AnalyticRecorded());
        }
      )
    )
  );

  setCircuit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CircuitTypeChanged),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(
            this.store$.pipe(select(getTests)),
            this.store$.pipe(select(getTests), select(getCurrentTest), select(getTestCategory)),
            this.store$.pipe(select(getTests), select(isPracticeMode))
          )
        )
      ),
      filter(([, , , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      concatMap(([action, , category]: [ReturnType<typeof CircuitTypeChanged>, TestsModel, CategoryCode, boolean]) => {
        //GA4 Analytics
        const eventValue = this.getEventValue(action.circuitType);

        this.analytics.addGACustomDimension(GoogleAnalyticsCustomDimension.TEST_CATEGORY, category);
        this.analytics.logGAEvent(
          GoogleAnalyticsEvents.CIRCUIT_CHANGED,
          GoogleAnalyticsEventsTitles.DIRECTION,
          eventValue
        );
        return of(AnalyticRecorded());
      })
    )
  );

  setIndependentDrivingType$ = createEffect(() =>
    this.actions$.pipe(
      ofType(IndependentDrivingTypeChanged),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(
            this.store$.pipe(select(getTests)),
            this.store$.pipe(select(getTests), select(getCurrentTest), select(getTestCategory)),
            this.store$.pipe(select(getTests), select(isPracticeMode))
          )
        )
      ),
      filter(([, , , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      concatMap(
        ([action, tests, category]: [
          ReturnType<typeof IndependentDrivingTypeChanged>,
          TestsModel,
          CategoryCode,
          boolean,
        ]) => {
          //GA4 Analytics
          const eventValue = this.getEventValue(action.independentDriving);

          this.analytics.addGACustomDimension(GoogleAnalyticsCustomDimension.TEST_CATEGORY, category);
          this.analytics.logGAEvent(
            analyticsEventTypePrefix(GoogleAnalyticsEvents.INDEPENDENT_DRIVING, tests),
            GoogleAnalyticsEventsTitles.DRIVING_TYPE,
            eventValue
          );
          return of(AnalyticRecorded());
        }
      )
    )
  );

  setModeOfTransport$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ModeOfTransportChanged),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(
            this.store$.pipe(select(getTests)),
            this.store$.pipe(select(getTests), select(getCurrentTest), select(getTestCategory)),
            this.store$.pipe(select(getTests), select(isPracticeMode))
          )
        )
      ),
      filter(([, , , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      concatMap(
        ([action, , category]: [ReturnType<typeof ModeOfTransportChanged>, TestsModel, CategoryCode, boolean]) => {
          //GA4 Analytics
          this.analytics.addGACustomDimension(GoogleAnalyticsCustomDimension.TEST_CATEGORY, category);

          const eventValue = this.getEventValue(action.modeOfTransport);

          this.analytics.logGAEvent(
            GoogleAnalyticsEvents.TRANSPORT_MODE,
            GoogleAnalyticsEventsTitles.CHANGED_TO,
            eventValue
          );
          return of(AnalyticRecorded());
        }
      )
    )
  );

  setFuelEfficientDriving$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ToggleFuelEfficientDriving),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(
            this.store$.pipe(select(getTests)),
            this.store$.pipe(
              select(getTests),
              select(getCurrentTest),
              select(getTestData),
              select(getEco),
              select(getFuelEfficientDriving)
            ),
            this.store$.pipe(select(getTests), select(isPracticeMode))
          )
        )
      ),
      filter(([, , , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      concatMap(
        ([, tests, fuelEfficientDriving]: [
          ReturnType<typeof ToggleFuelEfficientDriving>,
          TestsModel,
          boolean,
          boolean,
        ]) => {
          //GA4 Analytics
          this.analytics.logGAEvent(
            analyticsEventTypePrefix(GoogleAnalyticsEvents.FUEL_EFFICIENT_DRIVING, tests),
            GoogleAnalyticsEventsTitles.SELECTION,
            `${fuelEfficientDriving ? GoogleAnalyticsEventsValues.YES : GoogleAnalyticsEventsValues.NO}`
          );

          return of(AnalyticRecorded());
        }
      )
    )
  );

  motEvidenceChanged$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MotEvidenceChanged),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store$.pipe(select(getTests)), this.store$.pipe(select(getTests), select(isPracticeMode)))
        )
      ),
      filter(([, , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      concatMap(([, tests]: [ReturnType<typeof MotEvidenceChanged>, TestsModel, boolean]) => {
        //GA4 Analytics
        this.analytics.logGAEvent(
          analyticsEventTypePrefix(GoogleAnalyticsEvents.MOT_CHECK, tests),
          GoogleAnalyticsEventsTitles.ALT_EVIDENCE_DETAILS,
          GoogleAnalyticsEventsValues.FREE_TEXT_ENTERED
        );
        return of(AnalyticRecorded());
      })
    )
  );

  setEcoRelatedFault$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AddEcoRelatedFault),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(
            this.store$.pipe(select(getTests)),
            this.store$.pipe(
              select(getTests),
              select(getCurrentTest),
              select(getTestData),
              select(getEco),
              select(getEcoRelatedFault)
            ),
            this.store$.pipe(select(getTests), select(isPracticeMode))
          )
        )
      ),
      filter(([, , , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      concatMap(([, tests, ecoRelatedFault]: [ReturnType<typeof AddEcoRelatedFault>, TestsModel, string, boolean]) => {
        //GA4 Analytics
        this.analytics.logGAEvent(
          `${analyticsEventTypePrefix(
            GoogleAnalyticsEvents.ADD_FAULT,
            tests
          )}_${GoogleAnalyticsEventsValues.ECO}_${ecoRelatedFault}`
        );
        return of(AnalyticRecorded());
      })
    )
  );

  setEcoCaptureReason$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AddEcoCaptureReason),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(
            this.store$.pipe(select(getTests)),
            this.store$.pipe(
              select(getTests),
              select(getCurrentTest),
              select(getTestData),
              select(getEco),
              select(getEcoCaptureReason)
            ),
            this.store$.pipe(select(getTests), select(isPracticeMode))
          )
        )
      ),
      filter(([, , , practiceMode]) =>
        !practiceMode ? true : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics
      ),
      concatMap(([, tests]: [ReturnType<typeof AddEcoCaptureReason>, TestsModel, string, boolean]) => {
        //GA4 Analytics
        this.analytics.logGAEvent(
          analyticsEventTypePrefix(GoogleAnalyticsEvents.FEEDBACK, tests),
          GoogleAnalyticsEventsTitles.FEEDBACK_CATEGORY,
          GoogleAnalyticsEventsValues.ECO,
          GoogleAnalyticsEventsTitles.REASON,
          GoogleAnalyticsEventsValues.FREE_TEXT_ENTERED
        );

        return of(AnalyticRecorded());
      })
    )
  );
}
