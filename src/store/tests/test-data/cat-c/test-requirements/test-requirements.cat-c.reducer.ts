import { CatCUniqueTypes } from '@dvsa/mes-test-schema/categories/C';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import * as testRequirementsActions from '../../common/test-requirements/test-requirements.actions';

export const initialState: CatCUniqueTypes.TestRequirements = {};

export const testRequirementsCatCReducer = createReducer(
  initialState,
  on(testRequirementsActions.ToggleLegalRequirement, (state, { legalRequirement }) => ({
    ...state,
    [legalRequirement]: !state[legalRequirement],
  })),
);

export const getTestRequirementsCatC = createFeatureSelector<CatCUniqueTypes.TestRequirements>(
  'testRequirements',
);
