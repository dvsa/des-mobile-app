import { createReducer, on } from '@ngrx/store';
import * as startTimeActionTypes from './start-time.actions';
import { DateTime } from '@shared/helpers/date-time';

const initialState: string = null;

const timeFormat = 'YYYY-MM-DDTHH:mm';

export const startTimeReducer = createReducer(
  initialState,
  on(startTimeActionTypes.StartTimeChanged, (_, { time }) => DateTime.at(time)
    .format(timeFormat)),
);
