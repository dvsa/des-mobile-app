// eslint-disable-next-line max-classes-per-file
import { Action } from '@ngrx/store';
import { Log } from '../../shared/models/log.model';

export const SAVE_LOG = '[GLOBAL] Save Log';
export const START_SENDING_LOGS = '[AppComponent] Start Sending Logs';
export const SEND_LOGS = '[LogsEffects] Send Logs';
export const SEND_LOGS_SUCCESS = '[LogsEffects] Send Logs Success';
export const SEND_LOGS_FAILURE = '[LogsEffects] Send Logs Failure';

export const LOAD_LOG = '[GLOBAL] Load Logs';
export const LOAD_LOG_STATE = '[GLOBAL] Load Log State';
export const PERSIST_LOG = '[LogsEffects] Persist Logs';

export class SaveLog implements Action {
  readonly type = SAVE_LOG;
  constructor(public payload: Log) {}
}

export class StartSendingLogs implements Action {
  readonly type = START_SENDING_LOGS;
}

export class SendLogs implements Action {
  readonly type = SEND_LOGS;
}

export class SendLogsSuccess implements Action {
  readonly type = SEND_LOGS_SUCCESS;
  constructor(public timestamps: number[]) {}
}

export class SendLogsFailure implements Action {
  readonly type = SEND_LOGS_FAILURE;
  constructor(public error: any) {}
}

export class PersistLog implements Action {
  readonly type = PERSIST_LOG;
}

export class LoadLog implements Action {
  readonly type = LOAD_LOG;
}

export class LoadLogState implements Action {
  readonly type = LOAD_LOG_STATE;
  constructor(public payload: Log[]) {}
}

export type Types =
  SaveLog |
  StartSendingLogs |
  SendLogs |
  SendLogsSuccess |
  SendLogsFailure |
  PersistLog|
  LoadLog|
  LoadLogState;
