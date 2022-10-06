import { createReducer, on } from '@ngrx/store';
import * as endTimeActionTypes from './end-time.actions';

const initialState: string = null;

export const endTimeReducer = createReducer(
  initialState,
  on(endTimeActionTypes.EndTimeChanged, (_, { time }) => time),
);
