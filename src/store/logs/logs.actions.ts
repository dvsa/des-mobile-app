import { createAction, props } from '@ngrx/store';
import { Log } from '../../app/shared/models/log.model';

export const SaveLog = createAction(
  '[GLOBAL] Save Log',
  props<{payload: Log}>(),
);

export const StartSendingLogs = createAction(
  '[AppComponent] Start Sending Logs',
);

export const SendLogs = createAction(
  '[LogsEffects] Send Logs',
);

export const SendLogsSuccess = createAction(
  '[LogsEffects] Send Logs Success',
  props<{timestamps: number[]}>(),
);

export const SendLogsFailure = createAction(
  '[LogsEffects] Send Logs Failure',
  props<{error: any}>(),
);

export const PersistLog = createAction(
  '[LogsEffects] Persist Logs',
);

export const LoadLog = createAction(
  '[GLOBAL] Load Logs',
);

export const LoadLogState = createAction(
  '[GLOBAL] Load Log State',
  props<{payload: Log[]}>(),
);
