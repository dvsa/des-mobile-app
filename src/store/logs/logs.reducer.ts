import { createReducer, on, createFeatureSelector } from '@ngrx/store';

import { Log } from '../../app/shared/models/log.model';
import { LogsModel } from './logs.model';
import * as logsActions from './logs.actions';

export const logsFeatureKey = 'logs';

export const initialState: LogsModel = [];

export const logsReducer = createReducer(
  initialState,
  on(logsActions.SaveLog, (state: LogsModel, { payload }) => ([
    ...state,
    payload,
  ])),
  on(logsActions.SendLogsSuccess, (state: LogsModel, { timestamps }) => {
    return state.filter((log: Log) => !timestamps.includes(log.timestamp));
  }),
  on(logsActions.LoadLogState, (state: LogsModel, { payload }) => ([
    ...state,
    ...payload,
  ])),
);

export const getLogsState = createFeatureSelector<LogsModel>('logs');
