import { createReducer, on } from '@ngrx/store';
import * as endTimeActionTypes from './end-time.actions';
import { DateTime } from '@shared/helpers/date-time';

const initialState: string = null;

const timeFormat = 'YYYY-MM-DDTHH:mm';

export const endTimeReducer = createReducer(
  initialState,
  on(endTimeActionTypes.EndTimeChanged, (_, { time }) => DateTime.at(time)
    .format(timeFormat)),
);
