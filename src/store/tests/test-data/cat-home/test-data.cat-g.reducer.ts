import { CatGUniqueTypes } from '@dvsa/mes-test-schema/categories/G';
import { createFeatureSelector, combineReducers, Action } from '@ngrx/store';

import { vehicleChecksCatHomeReducer }
  from '@store/tests/test-data/cat-home/vehicle-checks/vehicle-checks.cat-home.reducer';
import { dangerousFaultsReducer } from '../common/dangerous-faults/dangerous-faults.reducer';
import { drivingFaultsReducer } from '../common/driving-faults/driving-faults.reducer';
import { ecoReducer } from '../common/eco/eco.reducer';
import { etaReducer } from '../common/eta/eta.reducer';
import { seriousFaultsReducer } from '../common/serious-faults/serious-faults.reducer';
import { controlledStopReducer } from '../common/controlled-stop/controlled-stop.reducer';
import { testRequirementsCatHomeReducer } from './test-requirements/test-requirements.cat-home.reducer';
import { eyesightTestReducer } from '../common/eyesight-test/eyesight-test.reducer';
import { manoeuvresReducer } from '../common/manoeuvres/manoeuvres.reducer';
import { highwayCodeSafetyReducer } from '../common/highway-code-safety/highway-code-safety.reducer';

export const initialState: CatGUniqueTypes.TestData = {
  dangerousFaults: {},
  drivingFaults: {},
  manoeuvres: {},
  seriousFaults: {},
  testRequirements: {},
  ETA: {},
  eco: {},
  controlledStop: {},
  eyesightTest: {},
  highwayCodeSafety: {},
  vehicleChecks: {
    tellMeQuestions: [],
    showMeQuestions: [],
  },
};

export function testDataCatGReducer(
  state: CatGUniqueTypes.TestData,
  action: Action,
): Required<CatGUniqueTypes.TestData> {
  return combineReducers({
    drivingFaults: drivingFaultsReducer,
    dangerousFaults: dangerousFaultsReducer,
    seriousFaults: seriousFaultsReducer,
    vehicleChecks: vehicleChecksCatHomeReducer,
    controlledStop: controlledStopReducer,
    highwayCodeSafety: highwayCodeSafetyReducer,
    eco: ecoReducer,
    ETA: etaReducer,
    eyesightTest: eyesightTestReducer,
    manoeuvres: manoeuvresReducer,
    testRequirements: testRequirementsCatHomeReducer,
  })(state as Required<CatGUniqueTypes.TestData>, action);
}

export const getTestData = createFeatureSelector<CatGUniqueTypes.TestData>('testData');
