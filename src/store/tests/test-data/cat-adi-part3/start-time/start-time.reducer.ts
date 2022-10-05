import { createReducer, on } from '@ngrx/store';
import * as startTimeActionTypes from './start-time.actions';

const initialState: string = null;

export const startTimeReducer = createReducer(
  initialState,
  on(startTimeActionTypes.StartTimeChanged, (_, { time }) => time),
);
