import { CatBUniqueTypes } from '@dvsa/mes-test-schema/categories/B';
import { createFeatureSelector, combineReducers, Action } from '@ngrx/store';
import { drivingFaultsReducer } from '../common/driving-faults/driving-faults.reducer';
import { dangerousFaultsReducer } from '../common/dangerous-faults/dangerous-faults.reducer';
import { seriousFaultsReducer } from '../common/serious-faults/serious-faults.reducer';
import { vehicleChecksReducer } from './vehicle-checks/vehicle-checks.reducer';
import { controlledStopReducer } from '../common/controlled-stop/controlled-stop.reducer';
import { ecoReducer } from '../common/eco/eco.reducer';
import { etaReducer } from '../common/eta/eta.reducer';
import { eyesightTestReducer } from '../common/eyesight-test/eyesight-test.reducer';
import { manoeuvresReducer } from './manoeuvres/manoeuvres.reducer';
import { testRequirementsReducer } from './test-requirements/test-requirements.reducer';

export const initialState: CatBUniqueTypes.TestData = {
  dangerousFaults: {},
  drivingFaults: {},
  manoeuvres: {},
  seriousFaults: {},
  testRequirements: {},
  ETA: {},
  eco: {},
  controlledStop: {},
  eyesightTest: {},
  vehicleChecks: {
    tellMeQuestion: {},
    showMeQuestion: {},
  },
};

export function testDataReducer(
  state = initialState,
  action: Action,
): Required<CatBUniqueTypes.TestData> {
  return combineReducers({
    drivingFaults: drivingFaultsReducer,
    dangerousFaults: dangerousFaultsReducer,
    seriousFaults: seriousFaultsReducer,
    vehicleChecks: vehicleChecksReducer,
    controlledStop: controlledStopReducer,
    eco: ecoReducer,
    ETA: etaReducer,
    eyesightTest: eyesightTestReducer,
    manoeuvres: manoeuvresReducer,
    testRequirements: testRequirementsReducer,
  })(state as Required<CatBUniqueTypes.TestData>, action);
}

export const getTestData = createFeatureSelector<CatBUniqueTypes.TestData>('testData');
