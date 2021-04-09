import { CatADI2UniqueTypes } from '@dvsa/mes-test-schema/categories/ADI2';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import * as testRequirementsActions from '../../common/test-requirements/test-requirements.actions';

export const initialState: CatADI2UniqueTypes.TestRequirements = {};

export const testRequirementsCatADI2Reducer = createReducer(
  initialState,
  on(testRequirementsActions.ToggleLegalRequirement, (state, { legalRequirement }) => ({
    ...state,
    [legalRequirement]: !state[legalRequirement]
  })),
);

export const getTestRequirementsCatADI2 =
  createFeatureSelector<CatADI2UniqueTypes.TestRequirements>('testRequirements');
