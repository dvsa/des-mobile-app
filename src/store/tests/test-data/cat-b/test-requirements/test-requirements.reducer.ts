import { CatBUniqueTypes } from '@dvsa/mes-test-schema/categories/B';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import * as testRequirementsActions from '../../common/test-requirements/test-requirements.actions';

export const initialState: CatBUniqueTypes.TestRequirements = {};

export const testRequirementsReducer = createReducer(
  initialState,
  on(testRequirementsActions.ToggleLegalRequirement, (state, { legalRequirement }) => ({
    ...state,
    [legalRequirement]: !legalRequirement,
  })),
);

export const getTestRequirementsCatB = createFeatureSelector<CatBUniqueTypes.TestRequirements>('testRequirements');
