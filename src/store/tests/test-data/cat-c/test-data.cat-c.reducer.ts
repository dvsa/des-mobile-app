import { CatCUniqueTypes } from '@dvsa/mes-test-schema/categories/C';
import { Action, combineReducers, createFeatureSelector } from '@ngrx/store';

import { dangerousFaultsReducer } from '../common/dangerous-faults/dangerous-faults.reducer';
import { drivingFaultsReducer } from '../common/driving-faults/driving-faults.reducer';
import { ecoReducer } from '../common/eco/eco.reducer';
import { etaReducer } from '../common/eta/eta.reducer';
import { manoeuvresReducer } from '../common/manoeuvres/manoeuvres.reducer';
import { seriousFaultsReducer } from '../common/serious-faults/serious-faults.reducer';
import { testRequirementsCatCReducer } from './test-requirements/test-requirements.cat-c.reducer';
import { vehicleChecksCatCReducer } from './vehicle-checks/vehicle-checks.cat-c.reducer';

export const initialState: CatCUniqueTypes.TestData = {
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
};

export function testDataCatCReducer(
  state: CatCUniqueTypes.TestData,
  action: Action
): Required<CatCUniqueTypes.TestData> {
  return combineReducers({
    drivingFaults: drivingFaultsReducer,
    dangerousFaults: dangerousFaultsReducer,
    seriousFaults: seriousFaultsReducer,
    vehicleChecks: vehicleChecksCatCReducer,
    eco: ecoReducer,
    ETA: etaReducer,
    manoeuvres: manoeuvresReducer,
    testRequirements: testRequirementsCatCReducer,
  })(state as Required<CatCUniqueTypes.TestData>, action);
}

export const getTestData = createFeatureSelector<CatCUniqueTypes.TestData>('testData');
