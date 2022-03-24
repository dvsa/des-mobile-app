import { CatFUniqueTypes } from '@dvsa/mes-test-schema/categories/F';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import * as testRequirementsActions from '../../common/test-requirements/test-requirements.actions';

export const initialState: CatFUniqueTypes.TestRequirements = {};

export const testRequirementsCatHomeReducer = createReducer(
  initialState,
  on(testRequirementsActions.ToggleLegalRequirement, (state, { legalRequirement }) => ({
    ...state,
    [legalRequirement]: !state[legalRequirement],
  })),
);

export const getTestRequirementsCatHome = createFeatureSelector<CatFUniqueTypes.TestRequirements>('testRequirements');
