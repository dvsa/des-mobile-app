import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { concatMap, filter, switchMap, withLatestFrom } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import {
  AnalyticsEventCategories,
  AnalyticsEvents,
  AnalyticsLabels,
  AnalyticsScreenNames,
  GoogleAnalyticsEvents,
  GoogleAnalyticsEventsTitles,
  GoogleAnalyticsEventsValues,
} from '@providers/analytics/analytics.model';
import * as testReportActions from '@pages/test-report/test-report.actions';
import * as controlledStopActions from '@store/tests/test-data/common/controlled-stop/controlled-stop.actions';
import * as highwayCodeSafetyActions
  from '@store/tests/test-data/common/highway-code-safety/highway-code-safety.actions';
import * as dangerousFaultsActions from '@store/tests/test-data/common/dangerous-faults/dangerous-faults.actions';
import * as drivingFaultsActions from '@store/tests/test-data/common/driving-faults/driving-faults.actions';
import * as seriousFaultsActions from '@store/tests/test-data/common/serious-faults/serious-faults.actions';
import * as manoeuvresActions from '@store/tests/test-data/common/manoeuvres/manoeuvres.actions';
import * as manoeuvresADIPart2Actions from '@store/tests/test-data/cat-adi-part2/manoeuvres/manoeuvres.actions';
import * as vehicleChecksActions from '@store/tests/test-data/cat-b/vehicle-checks/vehicle-checks.actions';
import { VehicleChecksTypes } from '@store/tests/test-data/cat-b/vehicle-checks/vehicle-checks.actions';
import * as lessonThemeActions from '@store/tests/test-data/cat-adi-part3/lesson-and-theme/lesson-and-theme.actions';
import {
  OtherChanged,
  StudentLevelChanged,
} from '@store/tests/test-data/cat-adi-part3/lesson-and-theme/lesson-and-theme.actions';
import * as testRequirementsActions from '@store/tests/test-data/common/test-requirements/test-requirements.actions';
import * as ecoActions from '@store/tests/test-data/common/eco/eco.actions';
import { getTests } from '@store/tests/tests.reducer';
import { competencyLabels, fullCompetencyLabels } from '@shared/constants/competencies/competencies';
import { manoeuvreCompetencyLabels, manoeuvreTypeLabels } from '@shared/constants/competencies/catb-manoeuvres';
import { lessonThemeValues } from '@shared/constants/adi3-questions/lesson-theme.constants';
import { AnalyticNotRecorded, AnalyticRecorded } from '@providers/analytics/analytics.actions';
import { TestsModel } from '@store/tests/tests.model';
import { analyticsEventTypePrefix, formatAnalyticsText } from '@shared/helpers/format-analytics-text';
import {
  legalRequirementsLabels,
  legalRequirementToggleValues,
} from '@shared/constants/legal-requirements/legal-requirements.constants';
import { getCurrentTest, isPracticeMode } from '@store/tests/tests.selector';
import { getTestData } from '@store/tests/test-data/cat-b/test-data.reducer';
import { getEco, getETA, getTestRequirements } from '@store/tests/test-data/common/test-data.selector';
import { Eco, ETA, TestRequirements } from '@dvsa/mes-test-schema/categories/common';
import * as uncoupleRecoupleActions from '@store/tests/test-data/common/uncouple-recouple/uncouple-recouple.actions';
import { getTestData as getCatAmod1TestData } from '@store/tests/test-data/cat-a-mod1/test-data.cat-a-mod1.reducer';
import { getAvoidance } from '@store/tests/test-data/cat-a-mod1/avoidance/avoidance.selector';
import { Avoidance, EmergencyStop } from '@dvsa/mes-test-schema/categories/AM1';
import { speedCheckToggleValues } from '@shared/constants/competencies/cata-mod1-speed-checks';
import { getEmergencyStop } from '@store/tests/test-data/cat-a-mod1/emergency-stop/emergency-stop.selector';
import * as singleFaultCompetencyActions
  from '@store/tests/test-data/common/single-fault-competencies/single-fault-competencies.actions';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import * as emergencyStopActions from '@store/tests/test-data/cat-a-mod1/emergency-stop/emergency-stop.actions';
import * as avoidanceActions from '@store/tests/test-data/cat-a-mod1/avoidance/avoidance.actions';
import * as pcvDoorExerciseActions from '@store/tests/test-data/cat-d/pcv-door-exercise/pcv-door-exercise.actions';
import { getControlledStop } from '@store/tests/test-data/common/controlled-stop/controlled-stop.reducer';
import { getHighwayCodeSafety } from '@store/tests/test-data/common/highway-code-safety/highway-code-safety.reducer';
import { ControlledStopUnion, HighwayCodeSafetyUnion } from '@shared/unions/test-schema-unions';

import * as etaActions from '@store/tests/test-data/common/eta/eta.actions';
import { ExaminerActions } from '@store/tests/test-data/test-data.constants';
import { getTestReportState } from '@pages/test-report/test-report.reducer';
import { isRemoveFaultMode } from '@pages/test-report/test-report.selector';
import { getLessonAndTheme } from '@store/tests/test-data/cat-adi-part3/lesson-and-theme/lesson-and-theme.reducer';
import {
  getOther,
  getStudentLevel,
} from '@store/tests/test-data/cat-adi-part3/lesson-and-theme/lesson-and-theme.selector';
import { StudentLevel } from '@dvsa/mes-test-schema/categories/ADI3';
import {
  LessonPlanningQuestionScoreChanged,
} from '@store/tests/test-data/cat-adi-part3/lesson-planning/lesson-planning.actions';
import {
  RiskManagementQuestionScoreChanged,
} from '@store/tests/test-data/cat-adi-part3/risk-management/risk-management.actions';
import {
  TeachingLearningStrategiesQuestionScoreChanged,
} from '@store/tests/test-data/cat-adi-part3/teaching-learning-strategies/teaching-learning-strategies.actions';
import { AppConfigProvider } from '@providers/app-config/app-config';
import {
  CompetencyOutcomeAnalyticEvent,
  CompetencyOutcomeGA4Event,
} from '@shared/helpers/competency-outcome-analytic-event';
import { AssessmentOverallScoreChanged } from '@pages/test-report/cat-adi-part3/test-report.cat-adi-part3.actions';
import * as reverseLeftActions from './components/reverse-left/reverse-left.actions';
import * as testReportCatAMod1Actions from './cat-a-mod1/test-report.cat-a-mod1.actions';
import { ModalReason } from './cat-a-mod1/components/activity-code-4-modal/activity-code-4-modal.constants';
import { ValidFaultTypes } from '@pages/office/components/fault-comment/fault-comment';

@Injectable()
export class TestReportAnalyticsEffects {

  constructor(
    private analytics: AnalyticsProvider,
    private actions$: Actions,
    private store$: Store<StoreModel>,
    private appConfigProvider: AppConfigProvider,
  ) {
  }

  testReportViewDidEnter$ = createEffect(() => this.actions$.pipe(
    ofType(testReportActions.TestReportViewDidEnter),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    concatMap((
      [, tests]:
      [ReturnType<typeof testReportActions.TestReportViewDidEnter>, TestsModel, boolean],
    ) => {
      // TODO MES-9495 - remove old analytics
      this.analytics.setCurrentPage(formatAnalyticsText(AnalyticsScreenNames.TEST_REPORT, tests));

      // GA4 Analytics
      this.analytics.setGACurrentPage(analyticsEventTypePrefix(AnalyticsScreenNames.TEST_REPORT, tests));

      return of(AnalyticRecorded());
    }),
  ));

  toggleRemoveFaultMode$ = createEffect(() => this.actions$.pipe(
    ofType(testReportActions.ToggleRemoveFaultMode),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTestReportState),
            select(isRemoveFaultMode),
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
      [action, tests, removeFaultMode]:
      [ReturnType<typeof testReportActions.ToggleRemoveFaultMode>, TestsModel, boolean, boolean],
    ) => {
      if (!action.isUserGenerated) {
        return of(AnalyticNotRecorded());
      }

      if (removeFaultMode) {
        // TODO MES-9495 - remove old analytics
        this.analytics.logEvent(
          formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT, tests),
          formatAnalyticsText(AnalyticsEvents.SELECT_REMOVE_MODE, tests),
          formatAnalyticsText(AnalyticsEvents.REMOVE_MODE_SELECTED, tests),
        );
        // GA4 Analytics
        this.analytics.logGAEvent(
          analyticsEventTypePrefix(GoogleAnalyticsEvents.SELECT_MODE, tests),
          GoogleAnalyticsEventsTitles.MODE,
          GoogleAnalyticsEventsValues.REMOVE,
        );
        return of(AnalyticRecorded());
      }
      // TODO MES-9495 - remove old analytics
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT, tests),
        formatAnalyticsText(AnalyticsEvents.EXIT_REMOVE_MODE, tests),
        formatAnalyticsText(AnalyticsEvents.REMOVE_MODE_EXITED, tests),
      );
      // GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.EXIT_MODE, tests),
        GoogleAnalyticsEventsTitles.MODE,
        GoogleAnalyticsEventsValues.REMOVE,
      );
      return of(AnalyticRecorded());
    }),
  ));

  toggleSeriousFaultMode$ = createEffect(() => this.actions$.pipe(
    ofType(testReportActions.ToggleSeriousFaultMode),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    concatMap((
      [action, tests]:
      [ReturnType<typeof testReportActions.ToggleSeriousFaultMode>, TestsModel, boolean],
    ) => {
      if (!action.isUserGenerated) {
        return of(AnalyticNotRecorded());
      }
      // TODO MES-9495 - remove old analytics
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT, tests),
        formatAnalyticsText(AnalyticsEvents.SELECT_SERIOUS_MODE, tests),
      );
      // GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.SELECT_MODE, tests),
        GoogleAnalyticsEventsTitles.MODE,
        ValidFaultTypes.SERIOUS,
      );
      return of(AnalyticRecorded());
    }),
  ));

  toggleDangerousFaultMode$ = createEffect(() => this.actions$.pipe(
    ofType(testReportActions.ToggleDangerousFaultMode),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    concatMap((
      [action, tests]:
      [ReturnType<typeof testReportActions.ToggleDangerousFaultMode>, TestsModel, boolean],
    ) => {
      if (!action.isUserGenerated) {
        return of(AnalyticNotRecorded());
      }
      // TODO MES-9495 - remove old analytics
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT, tests),
        formatAnalyticsText(AnalyticsEvents.SELECT_DANGEROUS_MODE, tests),
      );
      // GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.SELECT_MODE, tests),
        GoogleAnalyticsEventsTitles.MODE,
        ValidFaultTypes.DANGEROUS,
      );
      return of(AnalyticRecorded());
    }),
  ));

  addDrivingFault$ = createEffect(() => this.actions$.pipe(
    ofType(drivingFaultsActions.AddDrivingFault),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    concatMap((
      [action, tests]:
      [ReturnType<typeof drivingFaultsActions.AddDrivingFault>, TestsModel, boolean],
    ) => {
      // TODO MES-9495 - remove old analytics
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT, tests),
        formatAnalyticsText(AnalyticsEvents.ADD_DRIVING_FAULT, tests),
        fullCompetencyLabels[action.faultPayload.competency],
        action.faultPayload.newFaultCount,
      );
      // GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.ADD_FAULT, tests),
        GoogleAnalyticsEventsTitles.FAULT_TYPE,
        fullCompetencyLabels[action.faultPayload.competency],
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.DRIVING,
      );
      return of(AnalyticRecorded());
    }),
  ));

  addSeriousFault$ = createEffect(() => this.actions$.pipe(
    ofType(seriousFaultsActions.AddSeriousFault),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    concatMap((
      [action, tests]:
      [ReturnType<typeof seriousFaultsActions.AddSeriousFault>, TestsModel, boolean],
    ) => {
      // TODO MES-9495 - remove old analytics
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT, tests),
        formatAnalyticsText(AnalyticsEvents.ADD_SERIOUS_FAULT, tests),
        fullCompetencyLabels[action.competency],
        1,
      );
      // GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.ADD_FAULT, tests),
        GoogleAnalyticsEventsTitles.FAULT_TYPE,
        fullCompetencyLabels[action.competency],
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.SERIOUS,
      );
      return of(AnalyticRecorded());
    }),
  ));

  addDangerousFault$ = createEffect(() => this.actions$.pipe(
    ofType(dangerousFaultsActions.AddDangerousFault),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    concatMap((
      [action, tests]:
      [ReturnType<typeof dangerousFaultsActions.AddDangerousFault>, TestsModel, boolean],
    ) => {
      // TODO MES-9495 - remove old analytics
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT, tests),
        formatAnalyticsText(AnalyticsEvents.ADD_DANGEROUS_FAULT, tests),
        fullCompetencyLabels[action.competency],
        1,
      );
      // GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.ADD_FAULT, tests),
        GoogleAnalyticsEventsTitles.FAULT_TYPE,
        fullCompetencyLabels[action.competency],
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.DANGEROUS,
      );
      return of(AnalyticRecorded());
    }),
  ));

  addManoeuvreDrivingFault$ = createEffect(() => this.actions$.pipe(
    ofType(manoeuvresActions.AddManoeuvreDrivingFault),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    concatMap((
      [action, tests]:
      [ReturnType<typeof manoeuvresActions.AddManoeuvreDrivingFault>, TestsModel, boolean],
    ) => {
      // TODO MES-9495 - remove old analytics
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT, tests),
        formatAnalyticsText(AnalyticsEvents.ADD_DRIVING_FAULT, tests),
        // eslint-disable-next-line max-len
        `${manoeuvreTypeLabels[action.manoeuvrePayload.manoeuvre]} - ${manoeuvreCompetencyLabels[action.manoeuvrePayload.competency]}`,
        1,
      );
      // GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.ADD_FAULT, tests),
        GoogleAnalyticsEventsTitles.FAULT_TYPE,
        // eslint-disable-next-line max-len
        `${manoeuvreTypeLabels[action.manoeuvrePayload.manoeuvre]} - ${manoeuvreCompetencyLabels[action.manoeuvrePayload.competency]}`,
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.DRIVING,
      );
      return of(AnalyticRecorded());
    }),
  ));

  addManoeuvreDrivingFaultCatADIPart2$ = createEffect(() => this.actions$.pipe(
    ofType(manoeuvresADIPart2Actions.AddManoeuvreDrivingFault),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    concatMap((
      [action, tests]:
      [ReturnType<typeof manoeuvresADIPart2Actions.AddManoeuvreDrivingFault>, TestsModel, boolean],
    ) => {
      // TODO MES-9495 - remove old analytics
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT, tests),
        formatAnalyticsText(AnalyticsEvents.ADD_DRIVING_FAULT, tests),
        `${manoeuvreTypeLabels[action.payload.manoeuvre]} - ${manoeuvreCompetencyLabels[action.payload.competency]}`,
        1,
      );
      // GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.ADD_FAULT, tests),
        GoogleAnalyticsEventsTitles.FAULT_TYPE,
        `${manoeuvreTypeLabels[action.payload.manoeuvre]} - ${manoeuvreCompetencyLabels[action.payload.competency]}`,
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.DRIVING,
      );
      return of(AnalyticRecorded());
    }),
  ));

  addManoeuvreSeriousFault$ = createEffect(() => this.actions$.pipe(
    ofType(manoeuvresActions.AddManoeuvreSeriousFault),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    concatMap((
      [action, tests]:
      [ReturnType<typeof manoeuvresActions.AddManoeuvreSeriousFault>, TestsModel, boolean],
    ) => {
      // TODO MES-9495 - remove old analytics
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT, tests),
        formatAnalyticsText(AnalyticsEvents.ADD_SERIOUS_FAULT, tests),
        // eslint-disable-next-line max-len
        `${manoeuvreTypeLabels[action.manoeuvrePayload.manoeuvre]} - ${manoeuvreCompetencyLabels[action.manoeuvrePayload.competency]}`,
        1,
      );
      // GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.ADD_FAULT, tests),
        GoogleAnalyticsEventsTitles.FAULT_TYPE,
        // eslint-disable-next-line max-len
        `${manoeuvreTypeLabels[action.manoeuvrePayload.manoeuvre]} - ${manoeuvreCompetencyLabels[action.manoeuvrePayload.competency]}`,
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.SERIOUS,
      );
      return of(AnalyticRecorded());
    }),
  ));

  addManoeuvreSeriousFaultCatADIPart2$ = createEffect(() => this.actions$.pipe(
    ofType(manoeuvresADIPart2Actions.AddManoeuvreSeriousFault),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    concatMap((
      [action, tests]:
      [ReturnType<typeof manoeuvresADIPart2Actions.AddManoeuvreSeriousFault>, TestsModel, boolean],
    ) => {
      // TODO MES-9495 - remove old analytics
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT, tests),
        formatAnalyticsText(AnalyticsEvents.ADD_SERIOUS_FAULT, tests),
        `${manoeuvreTypeLabels[action.payload.manoeuvre]} - ${manoeuvreCompetencyLabels[action.payload.competency]}`,
        1,
      );
      // GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.ADD_FAULT, tests),
        GoogleAnalyticsEventsTitles.FAULT_TYPE,
        `${manoeuvreTypeLabels[action.payload.manoeuvre]} - ${manoeuvreCompetencyLabels[action.payload.competency]}`,
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.SERIOUS,
      );
      return of(AnalyticRecorded());
    }),
  ));

  addManoeuvreDangerousFault$ = createEffect(() => this.actions$.pipe(
    ofType(manoeuvresActions.AddManoeuvreDangerousFault),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    concatMap((
      [action, tests]:
      [ReturnType<typeof manoeuvresActions.AddManoeuvreDangerousFault>, TestsModel, boolean],
    ) => {
      // TODO MES-9495 - remove old analytics
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT, tests),
        formatAnalyticsText(AnalyticsEvents.ADD_DANGEROUS_FAULT, tests),
        // eslint-disable-next-line max-len
        `${manoeuvreTypeLabels[action.manoeuvrePayload.manoeuvre]} - ${manoeuvreCompetencyLabels[action.manoeuvrePayload.competency]}`,
        1,
      );
      // GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.ADD_FAULT, tests),
        GoogleAnalyticsEventsTitles.FAULT_TYPE,
        // eslint-disable-next-line max-len
        `${manoeuvreTypeLabels[action.manoeuvrePayload.manoeuvre]} - ${manoeuvreCompetencyLabels[action.manoeuvrePayload.competency]}`,
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.DANGEROUS,
      );
      return of(AnalyticRecorded());
    }),
  ));

  addManoeuvreDangerousFaultCatADIPart2$ = createEffect(() => this.actions$.pipe(
    ofType(manoeuvresADIPart2Actions.AddManoeuvreDangerousFault),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    concatMap((
      [action, tests]:
      [ReturnType<typeof manoeuvresADIPart2Actions.AddManoeuvreDangerousFault>, TestsModel, boolean],
    ) => {
      // TODO MES-9495 - remove old analytics
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT, tests),
        formatAnalyticsText(AnalyticsEvents.ADD_DANGEROUS_FAULT, tests),
        `${manoeuvreTypeLabels[action.payload.manoeuvre]} - ${manoeuvreCompetencyLabels[action.payload.competency]}`,
        1,
      );
      // GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.ADD_FAULT, tests),
        GoogleAnalyticsEventsTitles.FAULT_TYPE,
        `${manoeuvreTypeLabels[action.payload.manoeuvre]} - ${manoeuvreCompetencyLabels[action.payload.competency]}`,
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.DANGEROUS,
      );
      return of(AnalyticRecorded());
    }),
  ));

  controlledStopAddDrivingFault$ = createEffect(() => this.actions$.pipe(
    ofType(controlledStopActions.ControlledStopAddDrivingFault),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    concatMap((
      [, tests]:
      [ReturnType<typeof controlledStopActions.ControlledStopAddDrivingFault>, TestsModel, boolean],
    ) => {
      // TODO MES-9495 - remove old analytics
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT, tests),
        formatAnalyticsText(AnalyticsEvents.ADD_DRIVING_FAULT, tests),
        fullCompetencyLabels['outcomeControlledStop'],
        1,
      );
      // GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.ADD_FAULT, tests),
        GoogleAnalyticsEventsTitles.FAULT_TYPE,
        fullCompetencyLabels['outcomeControlledStop'],
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.DRIVING,
      );
      return of(AnalyticRecorded());
    }),
  ));

  controlledStopAddSeriousFault$ = createEffect(() => this.actions$.pipe(
    ofType(controlledStopActions.ControlledStopAddSeriousFault),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    concatMap((
      [, tests]:
      [ReturnType<typeof controlledStopActions.ControlledStopAddSeriousFault>, TestsModel, boolean],
    ) => {
      // TODO MES-9495 - remove old analytics
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT, tests),
        formatAnalyticsText(AnalyticsEvents.ADD_SERIOUS_FAULT, tests),
        fullCompetencyLabels['outcomeControlledStop'],
        1,
      );
      // GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.ADD_FAULT, tests),
        GoogleAnalyticsEventsTitles.FAULT_TYPE,
        fullCompetencyLabels['outcomeControlledStop'],
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.SERIOUS,
      );
      return of(AnalyticRecorded());
    }),
  ));

  returnToTest$ = createEffect(() => this.actions$.pipe(
    ofType(testReportActions.ReturnToTest),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    concatMap((
      [, tests]:
      [ReturnType<typeof testReportActions.ReturnToTest>, TestsModel, boolean],
    ) => {
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.TEST_END, tests),
        formatAnalyticsText(AnalyticsEvents.RETURN_TO_TEST, tests),
        'Test Report - Return To Test',
      );
      // GA4 Analytics
      this.analytics.logGAEvent(
        formatAnalyticsText(GoogleAnalyticsEvents.TEST_ENDED, tests),
        GoogleAnalyticsEvents.RETURN_TO_TEST,
      );
      return of(AnalyticRecorded());
    }),
  ));

  controlledStopAddDangerousFault$ = createEffect(() => this.actions$.pipe(
    ofType(controlledStopActions.ControlledStopAddDangerousFault),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    concatMap((
      [, tests]:
      [ReturnType<typeof controlledStopActions.ControlledStopAddDangerousFault>, TestsModel, boolean],
    ) => {
      // TODO MES-9495 - remove old analytics
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT, tests),
        formatAnalyticsText(AnalyticsEvents.ADD_DANGEROUS_FAULT, tests),
        fullCompetencyLabels['outcomeControlledStop'],
        1,
      );
      // GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.ADD_FAULT, tests),
        GoogleAnalyticsEventsTitles.FAULT_TYPE,
        fullCompetencyLabels['outcomeControlledStop'],
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.DANGEROUS,
      );
      return of(AnalyticRecorded());
    }),
  ));

  highwayCodeSafetyAddDrivingFault$ = createEffect(() => this.actions$.pipe(
    ofType(highwayCodeSafetyActions.HighwayCodeSafetyAddDrivingFault),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    concatMap((
      [, tests]:
      [ReturnType<typeof highwayCodeSafetyActions.HighwayCodeSafetyAddDrivingFault>, TestsModel, boolean],
    ) => {
      // TODO MES-9495 - remove old analytics
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT, tests),
        formatAnalyticsText(AnalyticsEvents.ADD_DRIVING_FAULT, tests),
        fullCompetencyLabels['outcomeHighwayCodeSafety'],
        1,
      );
      // GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.ADD_FAULT, tests),
        GoogleAnalyticsEventsTitles.FAULT_TYPE,
        fullCompetencyLabels['outcomeHighwayCodeSafety'],
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.DRIVING,
      );
      return of(AnalyticRecorded());
    }),
  ));

  highwayCodeSafetyAddSeriousFault$ = createEffect(() => this.actions$.pipe(
    ofType(highwayCodeSafetyActions.HighwayCodeSafetyAddSeriousFault),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    concatMap((
      [, tests]:
      [ReturnType<typeof highwayCodeSafetyActions.HighwayCodeSafetyAddSeriousFault>, TestsModel, boolean],
    ) => {
      // TODO MES-9495 - remove old analytics
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT, tests),
        formatAnalyticsText(AnalyticsEvents.ADD_SERIOUS_FAULT, tests),
        fullCompetencyLabels['outcomeHighwayCodeSafety'],
        1,
      );
      // GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.ADD_FAULT, tests),
        GoogleAnalyticsEventsTitles.FAULT_TYPE,
        fullCompetencyLabels['outcomeHighwayCodeSafety'],
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.SERIOUS,
      );
      return of(AnalyticRecorded());
    }),
  ));

  showMeQuestionDrivingFault$ = createEffect(() => this.actions$.pipe(
    ofType(vehicleChecksActions.ShowMeQuestionDrivingFault),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    concatMap((
      [, tests]:
      [ReturnType<typeof vehicleChecksActions.ShowMeQuestionDrivingFault>, TestsModel, boolean],
    ) => {
      // TODO MES-9495 - remove old analytics
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT, tests),
        formatAnalyticsText(AnalyticsEvents.ADD_DRIVING_FAULT, tests),
        fullCompetencyLabels['showMeQuestion'],
        1,
      );
      // GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.ADD_FAULT, tests),
        GoogleAnalyticsEventsTitles.FAULT_TYPE,
        fullCompetencyLabels['showMeQuestion'],
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.DRIVING,
      );
      return of(AnalyticRecorded());
    }),
  ));

  showMeQuestionSeriousFault$ = createEffect(() => this.actions$.pipe(
    ofType(vehicleChecksActions.ShowMeQuestionSeriousFault),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    concatMap((
      [, tests]:
      [ReturnType<typeof vehicleChecksActions.ShowMeQuestionSeriousFault>, TestsModel, boolean],
    ) => {
      // TODO MES-9495 - remove old analytics
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT, tests),
        formatAnalyticsText(AnalyticsEvents.ADD_SERIOUS_FAULT, tests),
        fullCompetencyLabels['showMeQuestion'],
        1,
      );
      // GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.ADD_FAULT, tests),
        GoogleAnalyticsEventsTitles.FAULT_TYPE,
        fullCompetencyLabels['showMeQuestion'],
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.SERIOUS,
      );
      return of(AnalyticRecorded());
    }),
  ));

  showMeQuestionDangerousFault$ = createEffect(() => this.actions$.pipe(
    ofType(vehicleChecksActions.ShowMeQuestionDangerousFault),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    concatMap((
      [, tests]:
      [ReturnType<typeof vehicleChecksActions.ShowMeQuestionDangerousFault>, TestsModel, boolean],
    ) => {
      // TODO MES-9495 - remove old analytics
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT, tests),
        formatAnalyticsText(AnalyticsEvents.ADD_DANGEROUS_FAULT, tests),
        fullCompetencyLabels['showMeQuestion'],
        1,
      );
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.ADD_FAULT, tests),
        GoogleAnalyticsEventsTitles.FAULT_TYPE,
        fullCompetencyLabels['showMeQuestion'],
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.DANGEROUS,
      );
      return of(AnalyticRecorded());
    }),
  ));

  removeDrivingFault$ = createEffect(() => this.actions$.pipe(
    ofType(drivingFaultsActions.RemoveDrivingFault),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    concatMap((
      [action, tests]:
      [ReturnType<typeof drivingFaultsActions.RemoveDrivingFault>, TestsModel, boolean],
    ) => {
      // TODO MES-9495 - remove old analytics
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT, tests),
        formatAnalyticsText(AnalyticsEvents.REMOVE_DRIVING_FAULT, tests),
        fullCompetencyLabels[action.faultPayload.competency],
        action.faultPayload.newFaultCount,
      );
      // GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.REMOVE_FAULT, tests),
        GoogleAnalyticsEventsTitles.FAULT_TYPE,
        fullCompetencyLabels[action.faultPayload.competency],
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.DRIVING,
      );
      return of(AnalyticRecorded());
    }),
  ));

  removeSeriousFault$ = createEffect(() => this.actions$.pipe(
    ofType(seriousFaultsActions.RemoveSeriousFault),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    concatMap((
      [action, tests]:
      [ReturnType<typeof seriousFaultsActions.RemoveSeriousFault>, TestsModel, boolean],
    ) => {
      // TODO MES-9495 - remove old analytics
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT, tests),
        formatAnalyticsText(AnalyticsEvents.REMOVE_SERIOUS_FAULT, tests),
        fullCompetencyLabels[action.competency],
        0,
      );
      // GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.REMOVE_FAULT, tests),
        GoogleAnalyticsEventsTitles.FAULT_TYPE,
        fullCompetencyLabels[action.competency],
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.SERIOUS,
      );
      return of(AnalyticRecorded());
    }),
  ));

  removeDangerousFault$ = createEffect(() => this.actions$.pipe(
    ofType(dangerousFaultsActions.RemoveDangerousFault),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    concatMap((
      [action, tests]:
      [ReturnType<typeof dangerousFaultsActions.RemoveDangerousFault>, TestsModel, boolean],
    ) => {
      // TODO MES-9495 - remove old analytics
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT, tests),
        formatAnalyticsText(AnalyticsEvents.REMOVE_DANGEROUS_FAULT, tests),
        fullCompetencyLabels[action.competency],
        0,
      );
      // GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.REMOVE_FAULT, tests),
        GoogleAnalyticsEventsTitles.FAULT_TYPE,
        fullCompetencyLabels[action.competency],
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.DANGEROUS,
      );
      return of(AnalyticRecorded());
    }),
  ));

  removeManoeuvreFault$ = createEffect(() => this.actions$.pipe(
    ofType(manoeuvresActions.RemoveManoeuvreFault),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    concatMap((
      [action, tests]:
      [ReturnType<typeof manoeuvresActions.RemoveManoeuvreFault>, TestsModel, boolean],
    ) => {
      // TODO MES-9495 - remove old analytics
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT, tests),
        formatAnalyticsText(CompetencyOutcomeAnalyticEvent(action.faultLevel), tests),
        `${manoeuvreTypeLabels[action.payload.manoeuvre]} - ${manoeuvreCompetencyLabels[action.payload.competency]}`,
      );
      // GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.REMOVE_FAULT, tests),
        GoogleAnalyticsEventsTitles.FAULT_TYPE,
        `${manoeuvreTypeLabels[action.payload.manoeuvre]} - ${manoeuvreCompetencyLabels[action.payload.competency]}`,
        GoogleAnalyticsEventsTitles.SEVERITY,
        CompetencyOutcomeGA4Event(action.faultLevel),
      );
      return of(AnalyticRecorded());
    }),
  ));

  removeManoeuvreFaultCatADIPart2$ = createEffect(() => this.actions$.pipe(
    ofType(manoeuvresADIPart2Actions.RemoveManoeuvreFault),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    concatMap((
      [action, tests]:
      [ReturnType<typeof manoeuvresADIPart2Actions.RemoveManoeuvreFault>, TestsModel, boolean],
    ) => {
      // TODO MES-9495 - remove old analytics
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT, tests),
        formatAnalyticsText(CompetencyOutcomeAnalyticEvent(action.faultLevel), tests),
        `${manoeuvreTypeLabels[action.payload.manoeuvre]} - ${manoeuvreCompetencyLabels[action.payload.competency]}`,
      );
      // GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.REMOVE_FAULT, tests),
        GoogleAnalyticsEventsTitles.FAULT_TYPE,
        `${manoeuvreTypeLabels[action.payload.manoeuvre]} - ${manoeuvreCompetencyLabels[action.payload.competency]}`,
        GoogleAnalyticsEventsTitles.SEVERITY,
        CompetencyOutcomeGA4Event(action.faultLevel),
      );
      return of(AnalyticRecorded());
    }),
  ));

  controlledStopRemoveFault$ = createEffect(() => this.actions$.pipe(
    ofType(controlledStopActions.ControlledStopRemoveFault),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    concatMap((
      [action, tests]:
      [ReturnType<typeof controlledStopActions.ControlledStopRemoveFault>, TestsModel, boolean],
    ) => {
      // TODO MES-9495 - remove old analytics
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT, tests),
        formatAnalyticsText(CompetencyOutcomeAnalyticEvent(action.faultLevel), tests),
        fullCompetencyLabels['outcomeControlledStop'],
      );
      // GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.REMOVE_FAULT, tests),
        GoogleAnalyticsEventsTitles.FAULT_TYPE,
        fullCompetencyLabels['outcomeControlledStop'],
        GoogleAnalyticsEventsTitles.SEVERITY,
        CompetencyOutcomeGA4Event(action.faultLevel),
      );
      return of(AnalyticRecorded());
    }),
  ));

  highwayCodeSafetyRemoveFault$ = createEffect(() => this.actions$.pipe(
    ofType(highwayCodeSafetyActions.HighwayCodeSafetyRemoveFault),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    concatMap((
      [, tests]:
      [ReturnType<typeof highwayCodeSafetyActions.HighwayCodeSafetyRemoveFault>, TestsModel, boolean],
    ) => {
      // TODO MES-9495 - remove old analytics
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT, tests),
        formatAnalyticsText(AnalyticsEvents.REMOVE_FAULT, tests),
        fullCompetencyLabels['outcomeHighwayCodeSafety'],
      );
      // GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.REMOVE_FAULT, tests),
        GoogleAnalyticsEventsTitles.FAULT_TYPE,
        fullCompetencyLabels['outcomeHighwayCodeSafety'],
      );
      return of(AnalyticRecorded());
    }),
  ));

  showMeQuestionRemoveFault$ = createEffect(() => this.actions$.pipe(
    ofType(vehicleChecksActions.ShowMeQuestionRemoveFault),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    concatMap((
      [action, tests]:
      [ReturnType<typeof vehicleChecksActions.ShowMeQuestionRemoveFault>, TestsModel, boolean],
    ) => {
      // TODO MES-9495 - remove old analytics
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT, tests),
        formatAnalyticsText(CompetencyOutcomeAnalyticEvent(action.faultLevel), tests),
        fullCompetencyLabels.showMeQuestion,
      );
      // GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.REMOVE_FAULT, tests),
        GoogleAnalyticsEventsTitles.FAULT_TYPE,
        fullCompetencyLabels.showMeQuestion,
        GoogleAnalyticsEventsTitles.SEVERITY,
        CompetencyOutcomeGA4Event(action.faultLevel),
      );
      return of(AnalyticRecorded());
    }),
  ));

  testTermination$ = createEffect(() => this.actions$.pipe(
    ofType(testReportActions.TerminateTestFromTestReport),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    concatMap((
      [, tests]:
      [ReturnType<typeof testReportActions.TerminateTestFromTestReport>, TestsModel, boolean],
    ) => {
      // TODO MES-9495 - remove old analytics
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.TEST_END, tests),
        formatAnalyticsText(AnalyticsEvents.END_TEST, tests),
        AnalyticsLabels.TERMINATE_TEST,
      );
      // GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.TEST_TERMINATED, tests),
      );
      return of(AnalyticRecorded());
    }),
  ));

  calculateTestResult$ = createEffect(() => this.actions$.pipe(
    ofType(testReportActions.CalculateTestResult),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    concatMap((
      [, tests]:
      [ReturnType<typeof testReportActions.CalculateTestResult>, TestsModel, boolean],
    ) => {
      // TODO MES-9495 - remove old analytics
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.TEST_END, tests),
        formatAnalyticsText(AnalyticsEvents.END_TEST, tests),
        AnalyticsLabels.TEST_ENDED,
      );
      // GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.TEST_ENDED, tests),
      );
      return of(AnalyticRecorded());
    }),
  ));

  toggleLegalRequirement$ = createEffect(() => this.actions$.pipe(
    ofType(testRequirementsActions.ToggleLegalRequirement),
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
            select(getTestRequirements),
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
      [action, tests, testRequirements]:
      [ReturnType<typeof testRequirementsActions.ToggleLegalRequirement>, TestsModel, TestRequirements, boolean],
    ) => {
      const toggleValue = testRequirements[action.legalRequirement]
        ? legalRequirementToggleValues.completed
        : legalRequirementToggleValues.uncompleted;

      // TODO MES-9495 - remove old analytics
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT, tests),
        formatAnalyticsText(AnalyticsEvents.TOGGLE_LEGAL_REQUIREMENT, tests),
        `${legalRequirementsLabels[action.legalRequirement]} - ${toggleValue}`,
      );

      // GA4 Analytics
      let itemName: string;
      switch (action.legalRequirement) {
        case 'normalStart1':
          itemName = 'NS1';
          break;
        case 'normalStart2':
          itemName = 'NS2';
          break;
        case 'busStop1':
          itemName = 'BS1';
          break;
        case 'busStop2':
          itemName = 'BS2';
          break;
        case 'angledStart':
          itemName = 'AS';
          break;
        case 'hillStart':
          itemName = 'HS';
          break;
        case 'angledStartControlledStop':
          itemName = 'ASCS';
          break;
        case 'uphillStart':
          itemName = 'US';
          break;
        case 'downhillStart':
          itemName = 'DS';
          break;
        case 'uphillStartDesignatedStart':
          itemName = 'HSDS';
          break;
        default:
          itemName = legalRequirementsLabels[action.legalRequirement];
          break;
      }

      this.analytics.logGAEvent(
        `${analyticsEventTypePrefix(GoogleAnalyticsEvents.LEGAL_REQUIREMENT, tests)}_${itemName}`,
        GoogleAnalyticsEventsTitles.ITEM_STATUS,
        toggleValue,
      );

      return of(AnalyticRecorded());
    }),
  ));

  toggleEco$ = createEffect(() => this.actions$.pipe(
    ofType(ecoActions.ToggleEco),
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
      [, tests, eco]:
      [ReturnType<typeof ecoActions.ToggleEco>, TestsModel, Eco, boolean],
    ) => {
      const toggleValue = eco.completed
        ? legalRequirementToggleValues.completed
        : legalRequirementToggleValues.uncompleted;
      // TODO MES-9495 - remove old analytics
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT, tests),
        formatAnalyticsText(AnalyticsEvents.TOGGLE_LEGAL_REQUIREMENT, tests),
        `${legalRequirementsLabels['eco']} - ${toggleValue}`,
      );
      // GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.LEGAL_REQUIREMENT, tests),
        GoogleAnalyticsEventsTitles.ITEM_NAME,
        legalRequirementsLabels['eco'],
        GoogleAnalyticsEventsTitles.ITEM_STATUS,
        toggleValue,
      );
      return of(AnalyticRecorded());
    }),
  ));

  toggleEcoControl$ = createEffect(() => this.actions$.pipe(
    ofType(ecoActions.ToggleControlEco),
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
      [, tests, eco]:
      [ReturnType<typeof ecoActions.ToggleControlEco>, TestsModel, Eco, boolean],
    ) => {
      const toggleValue = eco.adviceGivenControl
        ? 'selected'
        : 'unselected';
      // TODO MES-9495 - remove old analytics
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT, tests),
        formatAnalyticsText(AnalyticsEvents.TOGGLE_ECO_CONTROL, tests),
        `${toggleValue}`,
      );
      // GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.ECO_CONTROL, tests),
        GoogleAnalyticsEventsTitles.ITEM_STATUS,
        toggleValue,
      );
      return of(AnalyticRecorded());
    }),
  ));

  toggleEcoPlanning$ = createEffect(() => this.actions$.pipe(
    ofType(ecoActions.TogglePlanningEco),
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
      [, tests, eco]:
      [ReturnType<typeof ecoActions.TogglePlanningEco>, TestsModel, Eco, boolean],
    ) => {
      const toggleValue = eco.adviceGivenPlanning
        ? 'selected'
        : 'unselected';
      // TODO MES-9495 - remove old analytics
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT, tests),
        formatAnalyticsText(AnalyticsEvents.TOGGLE_ECO_PLANNING, tests),
        `${toggleValue}`,
      );
      // GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.ECO_PLANNING, tests),
        GoogleAnalyticsEventsTitles.ITEM_STATUS,
        toggleValue,
      );
      return of(AnalyticRecorded());
    }),
  ));

  toggleETA$ = createEffect(() => this.actions$.pipe(
    ofType(etaActions.ToggleETA),
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
            select(getETA),
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
      [action, tests, eta]:
      [ReturnType<typeof etaActions.ToggleETA>, TestsModel, ETA, boolean],
    ) => {
      // TODO MES-9495 - remove old analytics method
      const event: string = (action.examinerAction === ExaminerActions.physical)
        ? AnalyticsEvents.TOGGLE_ETA_PHYSICAL
        : AnalyticsEvents.TOGGLE_ETA_VERBAL;
      // GA4 Analytics method
      const etaName: string = (action.examinerAction === ExaminerActions.physical)
        ? GoogleAnalyticsEventsValues.ETA_PHYSICAL
        : GoogleAnalyticsEventsValues.ETA_VERBAL;

      const etaValue: boolean = (action.examinerAction === ExaminerActions.physical)
        ? eta.physical
        : eta.verbal;

      const toggleValue = etaValue
        ? 'selected'
        : 'unselected';

      // TODO MES-9495 - remove old analytics
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT, tests),
        formatAnalyticsText(event, tests),
        `${toggleValue}`,
      );
      // GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.ETA, tests),
        GoogleAnalyticsEventsTitles.ITEM_NAME,
        etaName,
        GoogleAnalyticsEventsTitles.ITEM_STATUS,
        toggleValue,
      );
      return of(AnalyticRecorded());
    }),
  ));

  toggleControlledStop$ = createEffect(() => this.actions$.pipe(
    ofType(controlledStopActions.ToggleControlledStop),
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
            select(getControlledStop),
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
      [, tests, controlledStop]:
      [ReturnType<typeof controlledStopActions.ToggleControlledStop>, TestsModel, ControlledStopUnion, boolean],
    ) => {
      const toggleValue = controlledStop.selected
        ? legalRequirementToggleValues.completed
        : legalRequirementToggleValues.uncompleted;

      // TODO MES-9495 - remove old analytics
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT, tests),
        formatAnalyticsText(AnalyticsEvents.TOGGLE_CONTROLLED_STOP, tests),
        `${toggleValue}`,
      );
      // GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.CONTROLLED_STOP, tests),
        GoogleAnalyticsEventsTitles.ITEM_STATUS,
        toggleValue,
      );
      return of(AnalyticRecorded());
    }),
  ));

  toggleHighwayCodeSafety$ = createEffect(() => this.actions$.pipe(
    ofType(highwayCodeSafetyActions.ToggleHighwayCodeSafety),
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
            select(getHighwayCodeSafety),
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
      [, tests, highwayCodeSafety]:
      // eslint-disable-next-line max-len
      [ReturnType<typeof highwayCodeSafetyActions.ToggleHighwayCodeSafety>, TestsModel, HighwayCodeSafetyUnion, boolean],
    ) => {
      const toggleValue = highwayCodeSafety.selected
        ? legalRequirementToggleValues.completed
        : legalRequirementToggleValues.uncompleted;
      // TODO MES-9495 - remove old analytics
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT, tests),
        formatAnalyticsText(AnalyticsEvents.TOGGLE_LEGAL_REQUIREMENT, tests),
        `${legalRequirementsLabels.highwayCodeSafety} - ${toggleValue}`,
      );
      // GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.LEGAL_REQUIREMENT, tests),
        GoogleAnalyticsEventsTitles.ITEM_NAME,
        legalRequirementsLabels.highwayCodeSafety,
        GoogleAnalyticsEventsTitles.ITEM_STATUS,
        toggleValue,
      );
      return of(AnalyticRecorded());
    }),
  ));

  manoeuvreCompletedEffect$ = createEffect(() => this.actions$.pipe(
    ofType(manoeuvresActions.RecordManoeuvresSelection),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    switchMap((
      [, tests]:
      [ReturnType<typeof manoeuvresActions.RecordManoeuvresSelection>, TestsModel, boolean],
    ) => {
      // TODO MES-9495 - remove old analytics
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT, tests),
        formatAnalyticsText(AnalyticsEvents.TOGGLE_LEGAL_REQUIREMENT, tests),
        `${legalRequirementsLabels['manoeuvre']} - ${legalRequirementToggleValues.completed}`,
      );
      // GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.LEGAL_REQUIREMENT, tests),
        GoogleAnalyticsEventsTitles.ITEM_NAME,
        legalRequirementsLabels.manoeuvre,
        GoogleAnalyticsEventsTitles.ITEM_STATUS,
        legalRequirementToggleValues.completed,
      );
      return of(AnalyticRecorded());
    }),
  ));

  manoeuvreCompletedEffectCatADIPart2$ = createEffect(() => this.actions$.pipe(
    ofType(manoeuvresADIPart2Actions.RecordManoeuvresSelection),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    switchMap((
      [, tests]:
      [ReturnType<typeof manoeuvresADIPart2Actions.RecordManoeuvresSelection>, TestsModel, boolean],
    ) => {
      // TODO MES-9495 - remove old analytics
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT, tests),
        formatAnalyticsText(AnalyticsEvents.TOGGLE_LEGAL_REQUIREMENT, tests),
        `${legalRequirementsLabels['manoeuvre']} - ${legalRequirementToggleValues.completed}`,
      );
      // GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.LEGAL_REQUIREMENT, tests),
        GoogleAnalyticsEventsTitles.ITEM_NAME,
        legalRequirementsLabels.manoeuvre,
        GoogleAnalyticsEventsTitles.ITEM_STATUS,
        legalRequirementToggleValues.completed,
      );
      return of(AnalyticRecorded());
    }),
  ));

  deselectReverseLeftManoeuvreEffect$ = createEffect(() => this.actions$.pipe(
    ofType(manoeuvresActions.RecordManoeuvresDeselection),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    switchMap((
      [, tests]:
      [ReturnType<typeof manoeuvresActions.RecordManoeuvresDeselection>, TestsModel, boolean],
    ) => {
      // TODO MES-9495 - remove old analytics
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT, tests),
        formatAnalyticsText(AnalyticsEvents.TOGGLE_LEGAL_REQUIREMENT, tests),
        `${legalRequirementsLabels['manoeuvre']} - ${legalRequirementToggleValues.uncompleted}`,
      );
      // GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.LEGAL_REQUIREMENT, tests),
        GoogleAnalyticsEventsTitles.ITEM_NAME,
        legalRequirementsLabels.manoeuvre,
        GoogleAnalyticsEventsTitles.ITEM_STATUS,
        legalRequirementToggleValues.uncompleted,
      );
      return of(AnalyticRecorded());
    }),
  ));

  showMeQuestionCompletedEffect$ = createEffect(() => this.actions$.pipe(
    ofType(
      vehicleChecksActions.ShowMeQuestionPassed,
      vehicleChecksActions.ShowMeQuestionDrivingFault,
      vehicleChecksActions.ShowMeQuestionSeriousFault,
      vehicleChecksActions.ShowMeQuestionDangerousFault,
    ),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    concatMap(([, tests]: [VehicleChecksTypes, TestsModel, boolean]) => {
      // TODO MES-9495 - remove old analytics
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT, tests),
        formatAnalyticsText(AnalyticsEvents.TOGGLE_LEGAL_REQUIREMENT, tests),
        `${legalRequirementsLabels['vehicleChecks']} - ${legalRequirementToggleValues.completed}`,
      );
      // GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.LEGAL_REQUIREMENT, tests),
        GoogleAnalyticsEventsTitles.ITEM_NAME,
        legalRequirementsLabels.vehicleChecks,
        GoogleAnalyticsEventsTitles.ITEM_STATUS,
        legalRequirementToggleValues.completed,
      );
      return of(AnalyticRecorded());
    }),
  ));

  showMeQuestionUncompletedEffect$ = createEffect(() => this.actions$.pipe(
    ofType(vehicleChecksActions.ShowMeQuestionRemoveFault),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    concatMap((
      [, tests]:
      [ReturnType<typeof vehicleChecksActions.ShowMeQuestionRemoveFault>, TestsModel, boolean],
    ) => {
      // TODO MES-9495 - remove old analytics
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT, tests),
        formatAnalyticsText(AnalyticsEvents.TOGGLE_LEGAL_REQUIREMENT, tests),
        `${legalRequirementsLabels['vehicleChecks']} - ${legalRequirementToggleValues.uncompleted}`,
      );
      // GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.LEGAL_REQUIREMENT, tests),
        GoogleAnalyticsEventsTitles.ITEM_NAME,
        legalRequirementsLabels.vehicleChecks,
        GoogleAnalyticsEventsTitles.ITEM_STATUS,
        legalRequirementToggleValues.uncompleted,
      );
      return of(AnalyticRecorded());
    }),
  ));

  uncoupleRecoupleAddDrivingFault$ = createEffect(() => this.actions$.pipe(
    ofType(uncoupleRecoupleActions.UncoupleRecoupleAddDrivingFault),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    concatMap((
      [, tests]:
      [ReturnType<typeof uncoupleRecoupleActions.UncoupleRecoupleAddDrivingFault>, TestsModel, boolean],
    ) => {
      // TODO MES-9495 - remove old analytics
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT, tests),
        formatAnalyticsText(AnalyticsEvents.ADD_DRIVING_FAULT, tests),
        'Uncouple recouple',
        1,
      );
      // GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.ADD_FAULT, tests),
        GoogleAnalyticsEventsTitles.FAULT_TYPE,
        competencyLabels.uncoupleRecouple,
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.DRIVING,
      );
      return of(AnalyticRecorded());
    }),
  ));

  uncoupleRecoupleAddSeriousFault$ = createEffect(() => this.actions$.pipe(
    ofType(uncoupleRecoupleActions.UncoupleRecoupleAddSeriousFault),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    concatMap((
      [, tests]:
      [ReturnType<typeof uncoupleRecoupleActions.UncoupleRecoupleAddSeriousFault>, TestsModel, boolean],
    ) => {
      // TODO MES-9495 - remove old analytics
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT, tests),
        formatAnalyticsText(AnalyticsEvents.ADD_SERIOUS_FAULT, tests),
        'Uncouple recouple',
        1,
      );
      // GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.ADD_FAULT, tests),
        GoogleAnalyticsEventsTitles.FAULT_TYPE,
        competencyLabels.uncoupleRecouple,
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.SERIOUS,
      );
      return of(AnalyticRecorded());
    }),
  ));

  uncoupleRecoupleAddDangerousFault$ = createEffect(() => this.actions$.pipe(
    ofType(uncoupleRecoupleActions.UncoupleRecoupleAddDangerousFault),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    concatMap((
      [, tests]:
      [ReturnType<typeof uncoupleRecoupleActions.UncoupleRecoupleAddDangerousFault>, TestsModel, boolean],
    ) => {
      // TODO MES-9495 - remove old analytics
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT, tests),
        formatAnalyticsText(AnalyticsEvents.ADD_DANGEROUS_FAULT, tests),
        'Uncouple recouple',
        1,
      );
      // GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.ADD_FAULT, tests),
        GoogleAnalyticsEventsTitles.FAULT_TYPE,
        competencyLabels.uncoupleRecouple,
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.DANGEROUS,
      );
      return of(AnalyticRecorded());
    }),
  ));

  reverseLeftPopoverOpened$ = createEffect(() => this.actions$.pipe(
    ofType(reverseLeftActions.ReverseLeftPopoverOpened),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    concatMap((
      [, tests]:
      [ReturnType<typeof reverseLeftActions.ReverseLeftPopoverOpened>, TestsModel, boolean],
    ) => {
      // TODO MES-9495 - remove old analytics
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT, tests),
        formatAnalyticsText(AnalyticsEvents.REVERSE_LEFT_POPOVER_OPENED, tests),
      );
      // GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.NAVIGATION, tests),
        GoogleAnalyticsEventsTitles.OPENED,
        GoogleAnalyticsEventsValues.REVERSE_MANOEUVRE,
      );
      return of(AnalyticRecorded());
    }),
  ));

  reverseLeftPopoverClosed$ = createEffect(() => this.actions$.pipe(
    ofType(reverseLeftActions.ReverseLeftPopoverClosed),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    concatMap((
      [, tests]:
      [ReturnType<typeof reverseLeftActions.ReverseLeftPopoverClosed>, TestsModel, boolean],
    ) => {
      // TODO MES-9495 - remove old analytics
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT, tests),
        formatAnalyticsText(AnalyticsEvents.REVERSE_LEFT_POPOVER_CLOSED, tests),
      );
      // GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.NAVIGATION, tests),
        GoogleAnalyticsEventsTitles.CLOSED,
        GoogleAnalyticsEventsValues.REVERSE_MANOEUVRE,
      );
      return of(AnalyticRecorded());
    }),
  ));

  toggleAvoidanceSpeedReq$ = createEffect(() => this.actions$.pipe(
    ofType(
      avoidanceActions.AddAvoidanceSeriousFault,
      avoidanceActions.RemoveAvoidanceSeriousFault,
    ),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    concatMap(([action, tests]) => {
      const toggleValue = (action.type === avoidanceActions.AddAvoidanceSeriousFault.type)
        ? speedCheckToggleValues.speedNotMet
        : speedCheckToggleValues.speedMet;
      const toggleGA4Value = (action.type === avoidanceActions.AddAvoidanceSeriousFault.type)
        ? GoogleAnalyticsEventsValues.NOT_MET
        : GoogleAnalyticsEventsValues.MET;
      // TODO MES-9495 - remove old analytics
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT, tests),
        formatAnalyticsText(AnalyticsEvents.TOGGLE_AVOIDANCE_SPEED_REQUIREMENT, tests),
        `${competencyLabels['speedCheckAvoidance']} - ${toggleValue}`,
      );
      // GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.AVOIDANCE_MANOEUVRE, tests),
        GoogleAnalyticsEventsTitles.ITEM_STATUS,
        toggleGA4Value,
      );
      return of(AnalyticRecorded());
    }),
  ));

  recordAvoidanceFirstAttempt$ = createEffect(() => this.actions$.pipe(
    ofType(avoidanceActions.RecordAvoidanceFirstAttempt),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(getCurrentTest),
            select(getCatAmod1TestData),
            select(getAvoidance),
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
      [, tests, avoidance]:
      [ReturnType<typeof avoidanceActions.RecordAvoidanceFirstAttempt>, TestsModel, Avoidance, boolean],
    ) => {
      const attemptValue = avoidance.firstAttempt;
      // TODO MES-9495 - remove old analytics
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT, tests),
        formatAnalyticsText(AnalyticsEvents.RECORD_AVOIDANCE_FIRST_ATTEMPT, tests),
        `${competencyLabels['speedCheckAvoidance']} - ${attemptValue}`,
      );
      // GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.AVOIDANCE_MANOEUVRE, tests),
        GoogleAnalyticsEventsTitles.FIRST_ATTEMPT,
        `${competencyLabels['speedCheckAvoidance']} - ${attemptValue}`,
      );
      return of(AnalyticRecorded());
    }),
  ));

  recordAvoidanceSecondAttempt$ = createEffect(() => this.actions$.pipe(
    ofType(avoidanceActions.RecordAvoidanceSecondAttempt),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(getCurrentTest),
            select(getCatAmod1TestData),
            select(getAvoidance),
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
      [, tests, avoidance]:
      [ReturnType<typeof avoidanceActions.RecordAvoidanceSecondAttempt>, TestsModel, Avoidance, boolean],
    ) => {
      const attemptValue = avoidance.secondAttempt;
      // TODO MES-9495 - remove old analytics
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT, tests),
        formatAnalyticsText(AnalyticsEvents.RECORD_AVOIDANCE_SECOND_ATTEMPT, tests),
        `${competencyLabels['speedCheckAvoidance']} - ${attemptValue}`,
      );
      // GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.AVOIDANCE_MANOEUVRE, tests),
        GoogleAnalyticsEventsTitles.SECOND_ATTEMPT,
        `${competencyLabels['speedCheckAvoidance']} - ${attemptValue}`,
      );
      return of(AnalyticRecorded());
    }),
  ));

  toggleEmergencyStopSpeedReq$ = createEffect(() => this.actions$.pipe(
    ofType(
      emergencyStopActions.AddEmergencyStopSeriousFault,
      emergencyStopActions.RemoveEmergencyStopSeriousFault,
    ),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    concatMap(([action, tests]) => {
      // TODO MES-9495 - remove old analytics
      const toggleValue = (action.type === emergencyStopActions.AddEmergencyStopSeriousFault.type)
        ? speedCheckToggleValues.speedNotMet
        : speedCheckToggleValues.speedMet;
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT, tests),
        formatAnalyticsText(AnalyticsEvents.TOGGLE_EMERGENCY_STOP_SPEED_REQ, tests),
        `${competencyLabels['speedCheckEmergency']} - ${toggleValue}`,
      );
      // GA4 Analytics
      const GA4Toggle = (action.type === emergencyStopActions.AddEmergencyStopSeriousFault.type)
        ? GoogleAnalyticsEventsValues.NOT_MET
        : GoogleAnalyticsEventsValues.MET;
      this.analytics.logGAEvent(
        GoogleAnalyticsEvents.EMERGENCY_STOP,
        GoogleAnalyticsEventsTitles.SPEED_REQ,
        GA4Toggle,
      );
      return of(AnalyticRecorded());
    }),
  ));

  recordEmergencyStopFirstAttempt$ = createEffect(() => this.actions$.pipe(
    ofType(emergencyStopActions.RecordEmergencyStopFirstAttempt),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(getCurrentTest),
            select(getCatAmod1TestData),
            select(getEmergencyStop),
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
      [, tests, emergencyStop]:
      [ReturnType<typeof emergencyStopActions.RecordEmergencyStopFirstAttempt>, TestsModel, EmergencyStop, boolean],
    ) => {
      const attemptValue = emergencyStop.firstAttempt;
      // TODO MES-9495 - remove old analytics
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT, tests),
        formatAnalyticsText(AnalyticsEvents.RECORD_EMERGENCY_STOP_FIRST_ATTEMPT, tests),
        `${competencyLabels['speedCheckEmergency']} - ${attemptValue}`,
      );
      // GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.EMERGENCY_STOP, tests),
        GoogleAnalyticsEventsTitles.FIRST_ATTEMPT,
        `${competencyLabels['speedCheckEmergency']} - ${attemptValue}`,
      );
      return of(AnalyticRecorded());
    }),
  ));

  recordEmergencyStopSecondAttempt$ = createEffect(() => this.actions$.pipe(
    ofType(emergencyStopActions.RecordEmergencyStopSecondAttempt),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(getCurrentTest),
            select(getCatAmod1TestData),
            select(getEmergencyStop),
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
      [, tests, emergencyStop]:
      [ReturnType<typeof emergencyStopActions.RecordEmergencyStopSecondAttempt>, TestsModel, EmergencyStop, boolean],
    ) => {
      const attemptValue = emergencyStop.secondAttempt;
      // TODO MES-9495 - remove old analytics
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT, tests),
        formatAnalyticsText(AnalyticsEvents.RECORD_EMERGENCY_STOP_SECOND_ATTEMPT, tests),
        `${competencyLabels['speedCheckEmergency']} - ${attemptValue}`,
      );
      // GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.EMERGENCY_STOP, tests),
        GoogleAnalyticsEventsTitles.SECOND_ATTEMPT,
        `${competencyLabels['speedCheckEmergency']} - ${attemptValue}`,
      );
      return of(AnalyticRecorded());
    }),
  ));

  speedRequirementNotMetModalOpened$ = createEffect(() => this.actions$.pipe(
    ofType(testReportCatAMod1Actions.SpeedRequirementNotMetModalOpened),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    concatMap((
      [, tests]:
      [ReturnType<typeof testReportCatAMod1Actions.SpeedRequirementNotMetModalOpened>, TestsModel, boolean],
    ) => {
      // TODO MES-9495 - remove old analytics
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT, tests),
        formatAnalyticsText(AnalyticsEvents.SPEED_REQ_NOT_MET_MODAL_OPENED, tests),
        ModalReason.SPEED_REQUIREMENTS,
      );
      // GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.VALIDATION_ERROR, tests),
        GoogleAnalyticsEventsTitles.MODAL,
        GoogleAnalyticsEventsValues.SPEED_REQ_NOT_MET,
      );
      return of(AnalyticRecorded());
    }),
  ));

  emergencyStopDangerousFaultModelOpened$ = createEffect(() => this.actions$.pipe(
    ofType(testReportCatAMod1Actions.EmergencyStopDangerousFaultModelOpened),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    concatMap((
      [, tests]:
      [ReturnType<typeof testReportCatAMod1Actions.EmergencyStopDangerousFaultModelOpened>, TestsModel, boolean],
    ) => {
      // TODO MES-9495 - remove old analytics
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT, tests),
        formatAnalyticsText(AnalyticsEvents.EMERGENCY_STOP_DANGEROUS_FAULT_MODAL_OPENED, tests),
        ModalReason.EMERGENCY_STOP_DANGEROUS,
      );
      // GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.NAVIGATION, tests),
        GoogleAnalyticsEventsTitles.OPENED,
        ModalReason.EMERGENCY_STOP_DANGEROUS,
      );
      return of(AnalyticRecorded());
    }),
  ));

  emergencyStopSeriousFaultModelOpened$ = createEffect(() => this.actions$.pipe(
    ofType(testReportCatAMod1Actions.EmergencyStopSeriousFaultModelOpened),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    concatMap((
      [, tests]:
      [ReturnType<typeof testReportCatAMod1Actions.EmergencyStopSeriousFaultModelOpened>, TestsModel, boolean],
    ) => {
      // TODO MES-9495 - remove old analytics
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT, tests),
        formatAnalyticsText(AnalyticsEvents.EMERGENCY_STOP_SERIOUS_FAULT_MODAL_OPENED, tests),
        ModalReason.EMERGENCY_STOP_SERIOUS,
      );
      // GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.NAVIGATION, tests),
        GoogleAnalyticsEventsTitles.OPENED,
        ModalReason.EMERGENCY_STOP_SERIOUS,
      );
      return of(AnalyticRecorded());
    }),
  ));

  setSingleFaultCompetencyOutcome$ = createEffect(() => this.actions$.pipe(
    ofType(singleFaultCompetencyActions.SetSingleFaultCompetencyOutcome),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    concatMap((
      [action, tests]:
      [ReturnType<typeof singleFaultCompetencyActions.SetSingleFaultCompetencyOutcome>, TestsModel, boolean],
    ) => {
      // TODO MES-9495 - remove old analytics
      if (action.outcome === CompetencyOutcome.DF) {
        this.analytics.logEvent(
          formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT, tests),
          formatAnalyticsText(AnalyticsEvents.ADD_SINGLE_FAULT, tests),
          fullCompetencyLabels[action.competencyName],
        );
      } else if (action.outcome === CompetencyOutcome.D) {
        this.analytics.logEvent(
          formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT, tests),
          formatAnalyticsText(AnalyticsEvents.ADD_DANGEROUS_SINGLE_FAULT, tests),
          fullCompetencyLabels[action.competencyName],
        );
      } else if (action.outcome === CompetencyOutcome.S) {
        this.analytics.logEvent(
          formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT, tests),
          formatAnalyticsText(AnalyticsEvents.ADD_SERIOUS_SINGLE_FAULT, tests),
          fullCompetencyLabels[action.competencyName],
        );
      }
      // GA4 Analytics
      if (action.outcome === CompetencyOutcome.DF) {
        this.analytics.logGAEvent(
          analyticsEventTypePrefix(GoogleAnalyticsEvents.ADD_FAULT, tests),
          GoogleAnalyticsEventsTitles.FAULT_TYPE,
          fullCompetencyLabels[action.competencyName],
          GoogleAnalyticsEventsTitles.SEVERITY,
          ValidFaultTypes.DRIVING,
        );
      } else if (action.outcome === CompetencyOutcome.D) {
        this.analytics.logGAEvent(
          analyticsEventTypePrefix(GoogleAnalyticsEvents.ADD_FAULT, tests),
          GoogleAnalyticsEventsTitles.FAULT_TYPE,
          fullCompetencyLabels[action.competencyName],
          GoogleAnalyticsEventsTitles.SEVERITY,
          ValidFaultTypes.DANGEROUS,
        );
      } else if (action.outcome === CompetencyOutcome.S) {
        this.analytics.logGAEvent(
          analyticsEventTypePrefix(GoogleAnalyticsEvents.ADD_FAULT, tests),
          GoogleAnalyticsEventsTitles.FAULT_TYPE,
          fullCompetencyLabels[action.competencyName],
          GoogleAnalyticsEventsTitles.SEVERITY,
          ValidFaultTypes.SERIOUS,
        );
      }
      return of(AnalyticRecorded());
    }),
  ));

  removeSingleFaultCompetencyOutcome$ = createEffect(() => this.actions$.pipe(
    ofType(singleFaultCompetencyActions.RemoveSingleFaultCompetencyOutcome),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    concatMap((
      [action, tests]:
      [ReturnType<typeof singleFaultCompetencyActions.RemoveSingleFaultCompetencyOutcome>, TestsModel, boolean],
    ) => {
      // TODO MES-9495 - remove old analytics
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT, tests),
        formatAnalyticsText(AnalyticsEvents.REMOVE_SINGLE_FAULT, tests),
        fullCompetencyLabels[action.competencyName],
      );
      // GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.REMOVE_SINGLE_FAULT, tests),
        GoogleAnalyticsEventsTitles.FAULT_TYPE,
        fullCompetencyLabels[action.competencyName],
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.DRIVING,
      );
      return of(AnalyticRecorded());
    }),
  ));

  removeSingleDangerousFaultCompetencyOutcome$ = createEffect(() => this.actions$.pipe(
    ofType(singleFaultCompetencyActions.RemoveSingleDangerousFaultCompetencyOutcome),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    concatMap((
      [action, tests]:
      // eslint-disable-next-line max-len
      [ReturnType<typeof singleFaultCompetencyActions.RemoveSingleDangerousFaultCompetencyOutcome>, TestsModel, boolean],
    ) => {
      // TODO MES-9495 - remove old analytics
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT, tests),
        formatAnalyticsText(AnalyticsEvents.REMOVE_DANGEROUS_SINGLE_FAULT, tests),
        fullCompetencyLabels[action.competencyName],
      );
      // GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.REMOVE_SINGLE_FAULT, tests),
        GoogleAnalyticsEventsTitles.FAULT_TYPE,
        fullCompetencyLabels[action.competencyName],
        GoogleAnalyticsEventsTitles.SEVERITY,
        GoogleAnalyticsEventsValues.DANGEROUS,
      );
      return of(AnalyticRecorded());
    }),
  ));

  removeSingleSeriousFaultCompetencyOutcome$ = createEffect(() => this.actions$.pipe(
    ofType(singleFaultCompetencyActions.RemoveSingleSeriousFaultCompetencyOutcome),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    concatMap((
      [action, tests]:
      [ReturnType<typeof singleFaultCompetencyActions.RemoveSingleSeriousFaultCompetencyOutcome>, TestsModel, boolean],
    ) => {
      // TODO MES-9495 - remove old analytics
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT, tests),
        formatAnalyticsText(AnalyticsEvents.REMOVE_SERIOUS_SINGLE_FAULT, tests),
        fullCompetencyLabels[action.competencyName],
      );
      // GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.REMOVE_SINGLE_FAULT, tests),
        GoogleAnalyticsEventsTitles.FAULT_TYPE,
        fullCompetencyLabels[action.competencyName],
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.SERIOUS,
      );
      return of(AnalyticRecorded());
    }),
  ));

  pcvDoorExerciseAddDrivingFault$ = createEffect(() => this.actions$.pipe(
    ofType(pcvDoorExerciseActions.PcvDoorExerciseAddDrivingFault),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    concatMap((
      [, tests]:
      [ReturnType<typeof pcvDoorExerciseActions.PcvDoorExerciseAddDrivingFault>, TestsModel, boolean],
    ) => {
      // TODO MES-9495 - remove old analytics
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT, tests),
        formatAnalyticsText(AnalyticsEvents.PCV_DOOR_EXERCISE_ADD_DRIVING_FAULT, tests),
        fullCompetencyLabels.pcvDoorExercise,
      );
      // GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.ADD_FAULT, tests),
        GoogleAnalyticsEventsTitles.FAULT_TYPE,
        fullCompetencyLabels.pcvDoorExercise,
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.DRIVING,
      );
      return of(AnalyticRecorded());
    }),
  ));

  pcvDoorExerciseAddSeriousFault$ = this.actions$.pipe(
    ofType(pcvDoorExerciseActions.PcvDoorExerciseAddSeriousFault),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    concatMap((
      [, tests]:
      [ReturnType<typeof pcvDoorExerciseActions.PcvDoorExerciseAddSeriousFault>, TestsModel, boolean],
    ) => {
      // TODO MES-9495 - remove old analytics
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT, tests),
        formatAnalyticsText(AnalyticsEvents.PCV_DOOR_EXERCISE_ADD_SERIOUS_FAULT, tests),
        fullCompetencyLabels.pcvDoorExercise,
      );
      // GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.ADD_FAULT, tests),
        GoogleAnalyticsEventsTitles.FAULT_TYPE,
        fullCompetencyLabels.pcvDoorExercise,
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.SERIOUS,
      );
      return of(AnalyticRecorded());
    }),
  );

  pcvDoorExerciseAddDangerousFault$ = this.actions$.pipe(
    ofType(pcvDoorExerciseActions.PcvDoorExerciseAddDangerousFault),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    concatMap((
      [, tests]:
      [ReturnType<typeof pcvDoorExerciseActions.PcvDoorExerciseAddDangerousFault>, TestsModel, boolean],
    ) => {
      // TODO MES-9495 - remove old analytics
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT, tests),
        formatAnalyticsText(AnalyticsEvents.PCV_DOOR_EXERCISE_ADD_DANGEROUS_FAULT, tests),
        fullCompetencyLabels.pcvDoorExercise,
      );
      // GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.ADD_FAULT, tests),
        GoogleAnalyticsEventsTitles.FAULT_TYPE,
        fullCompetencyLabels.pcvDoorExercise,
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.DANGEROUS,
      );
      return of(AnalyticRecorded());
    }),
  );

  pcvDoorExerciseRemoveDrivingFault$ = this.actions$.pipe(
    ofType(pcvDoorExerciseActions.PcvDoorExerciseRemoveDrivingFault),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    concatMap((
      [, tests]:
      [ReturnType<typeof pcvDoorExerciseActions.PcvDoorExerciseRemoveDrivingFault>, TestsModel, boolean],
    ) => {
      // TODO MES-9495 - remove old analytics
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT, tests),
        formatAnalyticsText(AnalyticsEvents.PCV_DOOR_EXERCISE_REMOVE_DRIVING_FAULT, tests),
        fullCompetencyLabels.pcvDoorExercise,
      );
      // GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.REMOVE_FAULT, tests),
        GoogleAnalyticsEventsTitles.FAULT_TYPE,
        fullCompetencyLabels.pcvDoorExercise,
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.DRIVING,
      );
      return of(AnalyticRecorded());
    }),
  );

  pcvDoorExerciseRemoveSeriousFault$ = this.actions$.pipe(
    ofType(pcvDoorExerciseActions.PcvDoorExerciseRemoveSeriousFault),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    concatMap((
      [, tests]:
      [ReturnType<typeof pcvDoorExerciseActions.PcvDoorExerciseRemoveSeriousFault>, TestsModel, boolean],
    ) => {
      // TODO MES-9495 - remove old analytics
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT, tests),
        formatAnalyticsText(AnalyticsEvents.PCV_DOOR_EXERCISE_REMOVE_SERIOUS_FAULT, tests),
        fullCompetencyLabels.pcvDoorExercise,
      );
      // GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.REMOVE_FAULT, tests),
        GoogleAnalyticsEventsTitles.FAULT_TYPE,
        fullCompetencyLabels.pcvDoorExercise,
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.SERIOUS,
      );
      return of(AnalyticRecorded());
    }),
  );

  pcvDoorExerciseRemoveDangerousFault$ = this.actions$.pipe(
    ofType(pcvDoorExerciseActions.PcvDoorExerciseRemoveDangerousFault),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    concatMap((
      [, tests]:
      [ReturnType<typeof pcvDoorExerciseActions.PcvDoorExerciseRemoveDangerousFault>, TestsModel, boolean],
    ) => {
      // TODO MES-9495 - remove old analytics
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT, tests),
        formatAnalyticsText(AnalyticsEvents.PCV_DOOR_EXERCISE_REMOVE_DANGEROUS_FAULT, tests),
        fullCompetencyLabels.pcvDoorExercise,
      );
      // GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.REMOVE_FAULT, tests),
        GoogleAnalyticsEventsTitles.FAULT_TYPE,
        fullCompetencyLabels.pcvDoorExercise,
        GoogleAnalyticsEventsTitles.SEVERITY,
        ValidFaultTypes.DANGEROUS,
      );
      return of(AnalyticRecorded());
    }),
  );

  startTimer$ = createEffect(() => this.actions$.pipe(
    ofType(testReportActions.StartTimer),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    concatMap((
      [, tests]:
      [ReturnType<typeof testReportActions.StartTimer>, TestsModel, boolean],
    ) => {
      // TODO MES-9495 - remove old analytics
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT, tests),
        formatAnalyticsText(AnalyticsEvents.START_TIMER, tests),
      );
      // GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.START_TIMER, tests),
      );
      return of(AnalyticRecorded());
    }),
  ));

  studentLevelChanged$ = createEffect(() => this.actions$.pipe(
    ofType(StudentLevelChanged),
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
            select(getLessonAndTheme),
            select(getStudentLevel),
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
      [, tests, studentLevel]:
      [ReturnType<typeof StudentLevelChanged>, TestsModel, StudentLevel, boolean],
    ) => {
      // TODO MES-9495 - remove old analytics
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT, tests),
        formatAnalyticsText(AnalyticsEvents.STUDENT_LEVEL_CHANGED, tests),
        `student level changed to ${studentLevel}`,
      );
      // GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.STUDENT_EXPERIENCE, tests),
        GoogleAnalyticsEventsTitles.LEVEL,
        studentLevel,
      );
      return of(AnalyticRecorded());
    }),
  ));

  addLessonTheme$ = createEffect(() => this.actions$.pipe(
    ofType(lessonThemeActions.LessonThemeAdded),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    concatMap((
      [action, tests]:
      [ReturnType<typeof lessonThemeActions.LessonThemeAdded>, TestsModel, boolean],
    ) => {
      // TODO MES-9495 - remove old analytics
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT, tests),
        formatAnalyticsText(AnalyticsEvents.LESSON_THEME_ADDED, tests),
        lessonThemeValues[action.lessonTheme],
      );
      // GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.LESSON_THEME, tests),
        GoogleAnalyticsEventsTitles.ADDED,
        lessonThemeValues[action.lessonTheme],
      );
      return of(AnalyticRecorded());
    }),
  ));

  removeLessonTheme$ = createEffect(() => this.actions$.pipe(
    ofType(lessonThemeActions.LessonThemeRemoved),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    concatMap((
      [action, tests]:
      [ReturnType<typeof lessonThemeActions.LessonThemeRemoved>, TestsModel, boolean],
    ) => {
      // TODO MES-9495 - remove old analytics
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT, tests),
        formatAnalyticsText(AnalyticsEvents.LESSON_THEME_REMOVED, tests),
        lessonThemeValues[action.lessonTheme],
      );
      // GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.LESSON_THEME, tests),
        GoogleAnalyticsEventsTitles.REMOVED,
        lessonThemeValues[action.lessonTheme],
      );
      return of(AnalyticRecorded());
    }),
  ));

  otherReasonChanged$ = createEffect(() => this.actions$.pipe(
    ofType(OtherChanged),
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
            select(getLessonAndTheme),
            select(getOther),
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
      [, tests]:
      [ReturnType<typeof OtherChanged>, TestsModel, string, boolean],
    ) => {
      // TODO MES-9495 - remove old analytics
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT, tests),
        formatAnalyticsText(AnalyticsEvents.OTHER_REASON_CHANGED, tests),
        'Free text entered',
      );
      // GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.FEEDBACK, tests),
        GoogleAnalyticsEventsTitles.FEEDBACK_CATEGORY,
        GoogleAnalyticsEventsValues.OTHER_REASON,
        GoogleAnalyticsEventsTitles.REASON,
        GoogleAnalyticsEventsValues.FREE_TEXT_ENTERED,
      );
      return of(AnalyticRecorded());
    }),
  ));

  lessonPlanningQuestionScoreChanged$ = createEffect(() => this.actions$.pipe(
    ofType(LessonPlanningQuestionScoreChanged),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    concatMap((
      [{
        question,
        score,
      }, tests]:
      [ReturnType<typeof LessonPlanningQuestionScoreChanged>, TestsModel, boolean],
    ) => {
      // TODO MES-9495 - remove old analytics
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT, tests),
        formatAnalyticsText(AnalyticsEvents.LESSON_PLANNING_CHANGED, tests),
        `lesson planning changed: question ${question}, score ${score}`,
      );
      // GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(`${GoogleAnalyticsEvents.LESSON_PLANNING}_Q${question}`, tests),
        GoogleAnalyticsEventsTitles.QUESTION_SCORE,
        String(score),
      );
      return of(AnalyticRecorded());
    }),
  ));

  riskManagementQuestionScoreChanged$ = createEffect(() => this.actions$.pipe(
    ofType(RiskManagementQuestionScoreChanged),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    concatMap((
      [{
        question,
        score,
      }, tests]:
      [ReturnType<typeof RiskManagementQuestionScoreChanged>, TestsModel, boolean],
    ) => {
      // TODO MES-9495 - remove old analytics
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT, tests),
        formatAnalyticsText(AnalyticsEvents.RISK_MANAGEMENT_CHANGED, tests),
        `risk management changed: question ${question}, score ${score}`,
      );
      // GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(`${GoogleAnalyticsEvents.RISK_MANAGEMENT}_Q${question}`, tests),
        GoogleAnalyticsEventsTitles.QUESTION_SCORE,
        String(score),
      );
      return of(AnalyticRecorded());
    }),
  ));

  teachingLearningStrategyQuestionScoreChanged$ = createEffect(() => this.actions$.pipe(
    ofType(TeachingLearningStrategiesQuestionScoreChanged),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    concatMap((
      [{
        question,
        score,
      }, tests]:
      [ReturnType<typeof TeachingLearningStrategiesQuestionScoreChanged>, TestsModel, boolean],
    ) => {
      // TODO MES-9495 - remove old analytics
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT, tests),
        formatAnalyticsText(AnalyticsEvents.TEACHING_LEARNING_STRATEGY_CHANGED, tests),
        `teaching learning strategy changed: question ${question}, score ${score}`,
      );
      // GA4 analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(`${GoogleAnalyticsEvents.LEARNING_STRATEGY}_Q${question}`, tests),
        GoogleAnalyticsEventsTitles.QUESTION_SCORE,
        String(score),
      );
      return of(AnalyticRecorded());
    }),
  ));

  testReportAssessmentOverallScore$ = createEffect(() => this.actions$.pipe(
    ofType(
      AssessmentOverallScoreChanged,
    ),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode
      ? true
      : this.appConfigProvider.getAppConfig()?.journal?.enablePracticeModeAnalytics),
    concatMap((
      [action, tests]:
      [ReturnType<typeof AssessmentOverallScoreChanged>, TestsModel, boolean],
    ) => {
      // TODO MES-9495 - remove old analytics
      this.analytics.logEvent(
        formatAnalyticsText(AnalyticsEventCategories.TEST_REPORT, tests),
        formatAnalyticsText(AnalyticsEvents.ASSESSMENT_OVERALL_SCORE_CHANGED, tests),
        `overall assessment score changed: ${action.score}`,
      );
      // GA4 Analytics
      this.analytics.logGAEvent(
        analyticsEventTypePrefix(GoogleAnalyticsEvents.OVERALL_ASSESSMENT, tests),
        GoogleAnalyticsEventsTitles.SCORE,
        String(action.score),
      );
      return of(AnalyticRecorded());
    }),
  ));

}
