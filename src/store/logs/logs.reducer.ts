import { createFeatureSelector, createReducer, on } from '@ngrx/store';

import { Log } from '@shared/models/log.model';
import * as logsActions from './logs.actions';
import { LogsModel } from './logs.model';

export const logsFeatureKey = 'logs';

export const initialState: LogsModel = [];

export const logsReducer = createReducer(
  initialState,
  on(logsActions.SaveLog, (state: LogsModel, { logPayload }) => {
    if (state) {
      return state.length > 0 ? [...state, logPayload.payload] : [logPayload.payload];
    }
    return [];
  }),
  on(logsActions.SendLogsSuccess, (state: LogsModel, { timestamps }) => {
    return state.filter((log: Log) => !timestamps.includes(log.timestamp));
  }),
  on(logsActions.LoadLogState, (state: LogsModel, { payload }) => {
    let holdingArray = [];
    if (state && state.length > 0) {
      holdingArray = [...state];
    }
    if (payload && payload.length > 0) {
      holdingArray = [...payload];
    }
    return holdingArray;
  }),
  on(logsActions.ClearLogs, () => initialState)
);

export const getLogsState = createFeatureSelector<LogsModel>('logs');
