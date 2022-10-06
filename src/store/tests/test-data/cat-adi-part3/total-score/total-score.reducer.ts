import { createReducer, on } from '@ngrx/store';
import * as totalScoreActionTypes from './total-score.actions';

const initialState: number = 0;

export const totalScoreReducer = createReducer(
  initialState,
  on(totalScoreActionTypes.TotalScoreChanged, (_, { score }) => score),
);
