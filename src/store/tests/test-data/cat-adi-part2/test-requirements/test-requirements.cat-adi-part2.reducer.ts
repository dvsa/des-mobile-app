import * as testRequirementsActions from '../../common/test-requirements/test-requirements.actions';
import { CatADI2UniqueTypes } from '@dvsa/mes-test-schema/categories/ADI2';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';

export const initialState: CatADI2UniqueTypes.TestRequirements = {};

export const testRequirementsCatADI2Reducer = createReducer(
  initialState,
  on(testRequirementsActions.ToggleLegalRequirement, (state, { payload }) => ({
    ...state,
    [payload]: !state[payload]
  })),
);

export const getTestRequirementsCatADI2 =
  createFeatureSelector<CatADI2UniqueTypes.TestRequirements>('testRequirements');
