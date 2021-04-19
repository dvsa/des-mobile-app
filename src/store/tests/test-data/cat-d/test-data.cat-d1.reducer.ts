import { CatD1UniqueTypes } from '@dvsa/mes-test-schema/categories/D1';
import { createFeatureSelector, combineReducers, Action } from '@ngrx/store';

import { dangerousFaultsReducer } from '../common/dangerous-faults/dangerous-faults.reducer';
import { drivingFaultsReducer } from '../common/driving-faults/driving-faults.reducer';
import { ecoReducer } from '../common/eco/eco.reducer';
import { etaReducer } from '../common/eta/eta.reducer';
import { seriousFaultsReducer } from '../common/serious-faults/serious-faults.reducer';
import { testRequirementsCatDReducer } from './test-requirements/test-requirements.cat-d.reducer';
import { vehicleChecksCatDReducer } from './vehicle-checks/vehicle-checks.cat-d.reducer';
import { safetyQuestionsCatDReducer } from './safety-questions/safety-questions.cat-d.reducer';
import { manoeuvresReducer } from '../common/manoeuvres/manoeuvres.reducer';
import { pcvDoorExerciseReducer } from './pcv-door-exercise/pcv-door-exercise.reducer';

export const initialState: CatD1UniqueTypes.TestData = {
  dangerousFaults: {},
  drivingFaults: {},
  manoeuvres: {},
  seriousFaults: {},
  testRequirements: {},
  ETA: {},
  eco: {},
  vehicleChecks: {
    tellMeQuestions: [],
    showMeQuestions: [],
  },
  safetyQuestions: {
    questions: [],
  },
};

export function testDataCatD1Reducer(
  state: CatD1UniqueTypes.TestData,
  action: Action,
): Required<CatD1UniqueTypes.TestData> {
  return combineReducers({
    drivingFaults: drivingFaultsReducer,
    dangerousFaults: dangerousFaultsReducer,
    seriousFaults: seriousFaultsReducer,
    vehicleChecks: vehicleChecksCatDReducer,
    safetyQuestions: safetyQuestionsCatDReducer,
    eco: ecoReducer,
    ETA: etaReducer,
    manoeuvres: manoeuvresReducer,
    testRequirements: testRequirementsCatDReducer,
    pcvDoorExercise: pcvDoorExerciseReducer,
  })(state as Required<CatD1UniqueTypes.TestData>, action);
}

export const getTestData = createFeatureSelector<CatD1UniqueTypes.TestData>('testData');
