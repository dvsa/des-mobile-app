import { createFeatureSelector, createReducer, on } from '@ngrx/store';

import { Log } from '@shared/models/log.model';
import * as logsActions from './logs.actions';
import { LogsModel } from './logs.model';

export const logsFeatureKey = 'logs';

export const initialState: LogsModel = [];

export const logsReducer = createReducer(
  initialState,
  on(logsActions.SaveLog, (state: LogsModel, { payload }) => [...state, payload]),
  on(logsActions.SendLogsSuccess, (state: LogsModel, { timestamps }) => {
    return state.filter((log: Log) => !timestamps.includes(log.timestamp));
  }),
  on(logsActions.LoadLogState, (state: LogsModel, { payload }) => [...state, ...payload])
);

export const getLogsState = createFeatureSelector<LogsModel>('logs');
