import { Action } from '@ngrx/store';

export const TOGGLE_CONTROLLED_STOP = '[ControlledStop] Toggle Controlled Stop';
export const CONTROLLED_STOP_ADD_DRIVING_FAULT = '[ControlledStop] Add Driving Fault';
export const CONTROLLED_STOP_ADD_SERIOUS_FAULT = '[ControlledStop] Add Serious Fault';
export const CONTROLLED_STOP_ADD_DANGEROUS_FAULT = '[ControlledStop] Add Dangerous Fault';
export const CONTROLLED_STOP_REMOVE_FAULT = '[ControlledStop] Remove Fault';
export const ADD_CONTROLLED_STOP_COMMENT = '[ControlledStop] Add Comment';

export class ToggleControlledStop implements Action {
  readonly type = TOGGLE_CONTROLLED_STOP;
}

export class ControlledStopAddDrivingFault implements Action {
  readonly type = CONTROLLED_STOP_ADD_DRIVING_FAULT;
}
export class ControlledStopAddSeriousFault implements Action {
  readonly type = CONTROLLED_STOP_ADD_SERIOUS_FAULT;
}

export class ControlledStopAddDangerousFault implements Action {
  readonly type = CONTROLLED_STOP_ADD_DANGEROUS_FAULT;
}

export class ControlledStopRemoveFault implements Action {
  readonly type = CONTROLLED_STOP_REMOVE_FAULT;
}

export class AddControlledStopComment implements Action {
  readonly type = ADD_CONTROLLED_STOP_COMMENT;
  constructor(public comment: string) { }
}

export type Types =
  | ToggleControlledStop
  | ControlledStopAddDrivingFault
  | ControlledStopAddSeriousFault
  | ControlledStopAddDangerousFault
  | ControlledStopRemoveFault
  | AddControlledStopComment;
