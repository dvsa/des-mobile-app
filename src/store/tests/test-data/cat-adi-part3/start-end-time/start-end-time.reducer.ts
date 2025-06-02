import { StandardsChecksTestLength } from '@dvsa/mes-test-schema/categories/ADI3';
import { createReducer, on } from '@ngrx/store';
import { DateTime } from '@shared/helpers/date-time';
import * as StartEndTimeActionTypes from './start-end-time.actions';

const initialStringState: string = null;
const initialStandardsChecksDurationState: StandardsChecksTestLength = null;
const initialBoolState: boolean = false;

const timeFormat = 'YYYY-MM-DDTHH:mm';

export const endTimeReducer = createReducer(
  initialStringState,
  on(StartEndTimeActionTypes.EndTimeChanged, (_, { time }) => DateTime.at(time).format(timeFormat))
);

export const startEndTimeConfirmedReducer = createReducer(
  initialBoolState,
  on(StartEndTimeActionTypes.ConfirmStartEndTimeChanged, (_, { selected }) => selected)
);

export const testDurationReducer = createReducer(
  initialStandardsChecksDurationState,
  on(
    StartEndTimeActionTypes.StandardsChecksDurationDataChanged,
    (_, { standardChecksDuration }) => standardChecksDuration
  )
);

export const startTimeReducer = createReducer(
  initialStringState,
  on(StartEndTimeActionTypes.StartTimeChanged, (_, { time }) => DateTime.at(time).format(timeFormat))
);
