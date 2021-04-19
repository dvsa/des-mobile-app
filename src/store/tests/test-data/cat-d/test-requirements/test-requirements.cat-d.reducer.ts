import { CatDUniqueTypes } from '@dvsa/mes-test-schema/categories/D';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import * as testRequirementsActions from '../../common/test-requirements/test-requirements.actions';

export const initialState: CatDUniqueTypes.TestRequirements = {};

export const testRequirementsCatDReducer = createReducer(
  initialState,
  on(testRequirementsActions.ToggleLegalRequirement, (state, { legalRequirement }) => ({
    ...state,
    [legalRequirement]: !state[legalRequirement],
  })),
);

export const getTestRequirementsCatD = createFeatureSelector<CatDUniqueTypes.TestRequirements>('testRequirements');
