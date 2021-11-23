import { Injectable } from '@angular/core';
import {
  Actions, createEffect, ofType,
} from '@ngrx/effects';
import {
  switchMap, withLatestFrom, map, concatMap, delay, filter,
} from 'rxjs/operators';
import { Store, select, Action } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest, isTestReportPracticeTest } from '@store/tests/tests.selector';
import * as testsActions from '@store/tests/tests.actions';
import * as testRequirementsActions
  from '@store/tests/test-data/common/test-requirements/test-requirements.actions';
import * as manoeuvresActions from '@store/tests/test-data/common/manoeuvres/manoeuvres.actions';
import * as uncoupleRecoupleActions
  from '@store/tests/test-data/common/uncouple-recouple/uncouple-recouple.actions';
import * as vehicleChecksActions from '@store/tests/test-data/cat-b/vehicle-checks/vehicle-checks.actions';
import * as ecoActions from '@store//tests/test-data/common/eco/eco.actions';
import * as etaActions from '@store//tests/test-data/common/eta/eta.actions';
import * as dangerousFaultsActions
  from '@store/tests/test-data/common/dangerous-faults/dangerous-faults.actions';
import * as seriousFaultsActions from '@store//tests/test-data/common/serious-faults/serious-faults.actions';
import * as drivingFaultsActions from '@store/tests/test-data/common/driving-faults/driving-faults.actions';
import * as controlledStopActions from '@store/tests/test-data/common/controlled-stop/controlled-stop.actions';
import * as activityCodeActions from '@store/tests/activity-code/activity-code.actions';
import * as avoidanceActions from '@store/tests/test-data/cat-a-mod1/avoidance/avoidance.actions';
import * as emergencyStopActions from '@store/tests/test-data/cat-a-mod1/emergency-stop/emergency-stop.actions';
import * as singleFaultCompetenciesActions
  from '@store/tests/test-data/common/single-fault-competencies/single-fault-competencies.actions';
import * as highwayCodeActions from
  '@store/tests/test-data/common/highway-code-safety/highway-code-safety.actions';
import { TestResultProvider } from '@providers/test-result/test-result';
import { ActivityCode, TestResultCommonSchema } from '@dvsa/mes-test-schema/categories/common';
import { of } from 'rxjs';
import { isEmpty } from 'lodash';
import * as testReportActions from './test-report.actions';

export type NeverType<T> = T extends null ? never : T;

@Injectable()
export class TestReportEffects {

  constructor(
    private actions$: Actions,
    private store$: Store<StoreModel>,
    private testResultProvider: TestResultProvider,
  ) {}

  calculateTestResult$ = createEffect(() => this.actions$.pipe(
    ofType(
      testReportActions.CalculateTestResult,
    ),
    concatMap((action) => of(action).pipe(
      withLatestFrom(
        this.store$.pipe(
          select(getTests),
          map(getCurrentTest),
        ),
      ),
    )),
    switchMap((
      [, currentTest]: [ReturnType<typeof testReportActions.CalculateTestResult>, NeverType<TestResultCommonSchema>],
    ) => {
      return this.testResultProvider.calculateTestResult(currentTest.category, currentTest.testData)
        .pipe(
          switchMap((result: ActivityCode) => {

            const actions: Action[] = [activityCodeActions.SetActivityCode(result)];
            if (!isEmpty(currentTest.activityCode) && currentTest.activityCode !== result) {
              const label = result === '1' ? 'fail to pass' : 'pass to fail';
              actions.push(testsActions.TestOutcomeChanged(label));
            }

            return actions;
          }),
        );
    }),
  ));

  persistTestReport$ = this.actions$.pipe(
    ofType(
      drivingFaultsActions.AddDrivingFault,
      drivingFaultsActions.RemoveDrivingFault,
      seriousFaultsActions.RemoveSeriousFault,
      seriousFaultsActions.AddSeriousFault,
      dangerousFaultsActions.AddDangerousFault,
      dangerousFaultsActions.RemoveDangerousFault,
      manoeuvresActions.RecordManoeuvresSelection,
      manoeuvresActions.AddManoeuvreDrivingFault,
      manoeuvresActions.AddManoeuvreSeriousFault,
      manoeuvresActions.AddManoeuvreDangerousFault,
      manoeuvresActions.RemoveManoeuvreFault,
      manoeuvresActions.RecordManoeuvresDeselection,
      uncoupleRecoupleActions.ToggleUncoupleRecouple,
      uncoupleRecoupleActions.UncoupleRecoupleAddDrivingFault,
      uncoupleRecoupleActions.UncoupleRecoupleAddSeriousFault,
      uncoupleRecoupleActions.UncoupleRecoupleAddDangerousFault,
      uncoupleRecoupleActions.UncoupleRecoupleRemoveFault,
      controlledStopActions.ToggleControlledStop,
      controlledStopActions.ControlledStopAddDrivingFault,
      controlledStopActions.ControlledStopAddSeriousFault,
      controlledStopActions.ControlledStopAddDangerousFault,
      controlledStopActions.ControlledStopRemoveFault,
      vehicleChecksActions.ShowMeQuestionPassed,
      vehicleChecksActions.ShowMeQuestionDrivingFault,
      vehicleChecksActions.ShowMeQuestionSeriousFault,
      vehicleChecksActions.ShowMeQuestionDangerousFault,
      vehicleChecksActions.ShowMeQuestionRemoveFault,
      ecoActions.ToggleEco,
      ecoActions.ToggleControlEco,
      ecoActions.TogglePlanningEco,
      etaActions.ToggleETA,
      testRequirementsActions.ToggleLegalRequirement,
      avoidanceActions.AddAvoidanceSeriousFault,
      avoidanceActions.RemoveAvoidanceSeriousFault,
      avoidanceActions.RecordAvoidanceFirstAttempt,
      avoidanceActions.RecordAvoidanceSecondAttempt,
      emergencyStopActions.AddEmergencyStopSeriousFault,
      emergencyStopActions.RemoveEmergencyStopSeriousFault,
      emergencyStopActions.RecordEmergencyStopFirstAttempt,
      emergencyStopActions.RecordEmergencyStopSecondAttempt,
      singleFaultCompetenciesActions.SetSingleFaultCompetencyOutcome,
      singleFaultCompetenciesActions.RemoveSingleFaultCompetencyOutcome,
      singleFaultCompetenciesActions.RemoveSingleSeriousFaultCompetencyOutcome,
      singleFaultCompetenciesActions.RemoveSingleDangerousFaultCompetencyOutcome,
      highwayCodeActions.HighwayCodeSafetyAddDrivingFault,
      highwayCodeActions.HighwayCodeSafetyAddSeriousFault,
      highwayCodeActions.HighwayCodeSafetyRemoveFault,
      highwayCodeActions.ToggleHighwayCodeSafety,
    ),
    concatMap((action) => of(action).pipe(
      withLatestFrom(
        this.store$.pipe(
          select(getTests),
          map(isTestReportPracticeTest),
        ),
      ),
    )),
    filter(([, isTestReportPracticeTestValue]) => !isTestReportPracticeTestValue),
    delay(1000), // Added a 1 second delay to allow other action to complete/effects to fire
    map(() => testsActions.PersistTests()),
  );

  terminateTestFromTestReport$ = createEffect(() => this.actions$.pipe(
    ofType(
      testReportActions.TerminateTestFromTestReport,
    ),
    map(() => activityCodeActions.SetActivityCode(null)),
  ));
}
