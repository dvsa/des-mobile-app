import { CatC1UniqueTypes } from '@dvsa/mes-test-schema/categories/C1';
import { createFeatureSelector, combineReducers, Action } from '@ngrx/store';

import { dangerousFaultsReducer } from '../common/dangerous-faults/dangerous-faults.reducer';
import { drivingFaultsReducer } from '../common/driving-faults/driving-faults.reducer';
import { ecoReducer } from '../common/eco/eco.reducer';
import { etaReducer } from '../common/eta/eta.reducer';
import { seriousFaultsReducer } from '../common/serious-faults/serious-faults.reducer';
import { testRequirementsCatCReducer } from './test-requirements/test-requirements.cat-c.reducer';
import { vehicleChecksCatCReducer } from './vehicle-checks/vehicle-checks.cat-c.reducer';
import { manoeuvresReducer } from '../common/manoeuvres/manoeuvres.reducer';

export const initialState: CatC1UniqueTypes.TestData = {
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

export function testDataCatC1Reducer(
  state: CatC1UniqueTypes.TestData,
  action: Action,
): Required<CatC1UniqueTypes.TestData> {
  return combineReducers({
    drivingFaults: drivingFaultsReducer,
    dangerousFaults: dangerousFaultsReducer,
    seriousFaults: seriousFaultsReducer,
    vehicleChecks: vehicleChecksCatCReducer,
    eco: ecoReducer,
    ETA: etaReducer,
    manoeuvres: manoeuvresReducer,
    testRequirements: testRequirementsCatCReducer,
  })(state as Required<CatC1UniqueTypes.TestData>, action);
}

export const getTestData = createFeatureSelector<CatC1UniqueTypes.TestData>('testData');
