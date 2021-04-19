import { TestData } from '@dvsa/mes-test-schema/categories/AM2';
import { createFeatureSelector, combineReducers, Action } from '@ngrx/store';
import { seriousFaultsReducer } from '../common/serious-faults/serious-faults.reducer';
import { safetyAndBalanceCatAMod2Reducer } from './safety-and-balance/safety-and-balance.cat-a-mod2.reducer';
import { testRequirementsCatAMod2Reducer } from './test-requirements/test-requirements.cat-a-mod-2.reducer';
import { drivingFaultsReducer } from '../common/driving-faults/driving-faults.reducer';
import { dangerousFaultsReducer } from '../common/dangerous-faults/dangerous-faults.reducer';
import { ecoReducer } from '../common/eco/eco.reducer';
import { etaReducer } from '../common/eta/eta.reducer';
import { eyesightTestReducer } from '../common/eyesight-test/eyesight-test.reducer';

export const initialState: TestData = {
  testRequirements: {},
  ETA: {},
  drivingFaults: {},
  seriousFaults: {},
  dangerousFaults: {},
  safetyAndBalanceQuestions: {
    safetyQuestions: [],
    balanceQuestions: [],
  },
  eco: {},
  eyesightTest: {},
};

export function testDataCatAMod2Reducer(
  state = initialState,
  action: Action,
): Required<TestData> {
  return combineReducers({
    testRequirements: testRequirementsCatAMod2Reducer,
    drivingFaults: drivingFaultsReducer,
    dangerousFaults: dangerousFaultsReducer,
    seriousFaults: seriousFaultsReducer,
    eco: ecoReducer,
    ETA: etaReducer,
    safetyAndBalanceQuestions: safetyAndBalanceCatAMod2Reducer,
    eyesightTest: eyesightTestReducer,
  })(state as Required<TestData>, action);
}

export const getTestData = createFeatureSelector<TestData>('testData');
