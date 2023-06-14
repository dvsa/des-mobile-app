import { createReducer, on } from '@ngrx/store';
import * as moment from 'moment';
import * as endTimeActionTypes from './end-time.actions';

const initialState: string = null;

const timeFormat = 'YYYY-MM-DDTHH:mm';

export const endTimeReducer = createReducer(
  initialState,
  on(endTimeActionTypes.EndTimeChanged, (_, { time }) => moment(time)
    .format(timeFormat)),
);
