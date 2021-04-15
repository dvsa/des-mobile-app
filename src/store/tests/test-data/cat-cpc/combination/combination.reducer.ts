import { CombinationCodes } from '@dvsa/mes-test-schema/categories/CPC';
import { createReducer, on } from '@ngrx/store';
import * as combinationActionTypes from './combination.action';

const initialState: CombinationCodes = null;

export const combinationReducer = createReducer(
  initialState,
  on(combinationActionTypes.PopulateCombination, (_, { combination }) => combination),
);
