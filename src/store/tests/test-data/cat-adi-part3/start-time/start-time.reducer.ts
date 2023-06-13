import { createReducer, on } from '@ngrx/store';
import * as moment from 'moment';
import * as startTimeActionTypes from './start-time.actions';

const initialState: string = null;

const timeFormat = 'YYYY-MM-DDTHH:mm';

export const startTimeReducer = createReducer(
  initialState,
  on(startTimeActionTypes.StartTimeChanged, (_, { time }) => moment(time)
    .format(timeFormat)),
);
