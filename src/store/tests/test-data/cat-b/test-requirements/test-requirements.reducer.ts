import { CatBUniqueTypes } from '@dvsa/mes-test-schema/categories/B';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import { TestRequirementsUnion } from '@shared/unions/test-schema-unions';
import * as testRequirementsActions from '../../common/test-requirements/test-requirements.actions';

export const initialState: CatBUniqueTypes.TestRequirements = {};

export const testRequirementsReducer = createReducer(
  initialState,
  on(testRequirementsActions.ToggleLegalRequirement, (state, { legalRequirement }) => ({
    ...state,
    [legalRequirement]: !state[legalRequirement],
  })),
);

export const getTestRequirementsCatB = createFeatureSelector<TestRequirementsUnion>('testRequirements');
