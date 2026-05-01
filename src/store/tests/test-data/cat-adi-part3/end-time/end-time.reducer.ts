import { createReducer, on } from '@ngrx/store';
import { DateTime } from '@shared/helpers/date-time';
import * as endTimeActionTypes from './end-time.actions';

const initialState: string = null;

const timeFormat = "yyyy-MM-dd'T'HH:mm";

export const endTimeReducer = createReducer(
  initialState,
  on(endTimeActionTypes.EndTimeChanged, (_, { time }) => DateTime.at(time, 'UK').format(timeFormat))
);
