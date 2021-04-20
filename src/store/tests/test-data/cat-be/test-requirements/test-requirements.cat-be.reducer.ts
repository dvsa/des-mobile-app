import { CatBEUniqueTypes } from '@dvsa/mes-test-schema/categories/BE';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import * as testRequirementsActions from '../../common/test-requirements/test-requirements.actions';

export const initialState: CatBEUniqueTypes.TestRequirements = {};

export const testRequirementsCatBEReducer = createReducer(
  initialState,
  on(testRequirementsActions.ToggleLegalRequirement, (state, { legalRequirement }) => ({
    ...state,
    [legalRequirement]: !state[legalRequirement],
  })),
);

export const getTestRequirementsCatBE = createFeatureSelector<CatBEUniqueTypes.TestRequirements>('testRequirements');
