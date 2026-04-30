import { createReducer, on } from '@ngrx/store';
import { DateTime } from '@shared/helpers/date-time';
import * as startTimeActionTypes from './start-time.actions';

const initialState: string = null;

const timeFormat = "yyyy-MM-dd'T'HH:mm";

export const startTimeReducer = createReducer(
  initialState,
  on(startTimeActionTypes.StartTimeChanged, (_, { time }) => DateTime.at(time, 'UK').format(timeFormat))
);
