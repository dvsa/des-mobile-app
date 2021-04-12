import { CatCEUniqueTypes } from '@dvsa/mes-test-schema/categories/CE';
import { createFeatureSelector, combineReducers, Action } from '@ngrx/store';

import { dangerousFaultsReducer } from '../common/dangerous-faults/dangerous-faults.reducer';
import { drivingFaultsReducer } from '../common/driving-faults/driving-faults.reducer';
import { ecoReducer } from '../common/eco/eco.reducer';
import { etaReducer } from '../common/eta/eta.reducer';
import { seriousFaultsReducer } from '../common/serious-faults/serious-faults.reducer';
import { testRequirementsCatCReducer } from './test-requirements/test-requirements.cat-c.reducer';
import { vehicleChecksCatCReducer } from './vehicle-checks/vehicle-checks.cat-c.reducer';
import { manoeuvresReducer } from '../common/manoeuvres/manoeuvres.reducer';
import { uncoupleRecoupleReducer } from '../common/uncouple-recouple/uncouple-recouple.reducer';

export const initialState: CatCEUniqueTypes.TestData = {
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
  uncoupleRecouple: {},
};

export function testDataCatCEReducer(
  state: CatCEUniqueTypes.TestData,
  action: Action,
): Required<CatCEUniqueTypes.TestData> {
  return combineReducers({
    drivingFaults: drivingFaultsReducer,
    dangerousFaults: dangerousFaultsReducer,
    seriousFaults: seriousFaultsReducer,
    vehicleChecks: vehicleChecksCatCReducer,
    eco: ecoReducer,
    ETA: etaReducer,
    manoeuvres: manoeuvresReducer,
    testRequirements: testRequirementsCatCReducer,
    uncoupleRecouple: uncoupleRecoupleReducer,
  })(state as Required<CatCEUniqueTypes.TestData>, action);
}

export const getTestData = createFeatureSelector<CatCEUniqueTypes.TestData>('testData');
