import { TestRequirements } from '@dvsa/mes-test-schema/categories/AM2';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import * as testRequirementsActions from '../../common/test-requirements/test-requirements.actions';

export const initialState: TestRequirements = {};

export const testRequirementsCatAMod2Reducer = createReducer(
  initialState,
  on(testRequirementsActions.ToggleLegalRequirement, (state, {
    legalRequirement,
  }): TestRequirements => ({
    ...state,
    [legalRequirement]: !state[legalRequirement],
  })),
);

export const getTestRequirementsCatEUAM2 = createFeatureSelector<TestRequirements>('testRequirements');
