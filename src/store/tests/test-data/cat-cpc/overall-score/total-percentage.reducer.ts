import { createReducer, on } from '@ngrx/store';
import * as totalPercentageActionTypes from './total-percentage.action';

const initialState: number = 0;

export const totalPercentageReducer = createReducer(
  initialState,
  on(totalPercentageActionTypes.PopulateTestScore, (_, { score }) => score),
);
