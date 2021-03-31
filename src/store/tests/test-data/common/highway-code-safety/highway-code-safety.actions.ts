import { Action } from '@ngrx/store';

export const TOGGLE_HIGHWAYCODE_SAFETY = '[HighwayCodeSafety] Toggle Highway code Safety';
export const HIGHWAY_CODE_SAFETY_ADD_DRIVING_FAULT = '[HighwayCodeSafety] Add Driving Fault';
export const HIGHWAY_CODE_SAFETY_ADD_SERIOUS_FAULT = '[HighwayCodeSafety] Add Serious Fault';
export const HIGHWAY_CODE_SAFETY_REMOVE_FAULT = '[HighwayCodeSafety] Remove Fault';
export const ADD_HIGHWAY_CODE_SAFETY_COMMENT = '[HighwayCodeSafety] Add Comment';

export class ToggleHighwayCodeSafety implements Action {
  readonly type = TOGGLE_HIGHWAYCODE_SAFETY;
}

export class HighwayCodeSafetyAddDrivingFault implements Action {
  readonly type = HIGHWAY_CODE_SAFETY_ADD_DRIVING_FAULT;
}
export class HighwayCodeSafetyAddSeriousFault implements Action {
  readonly type = HIGHWAY_CODE_SAFETY_ADD_SERIOUS_FAULT;
}

export class HighwayCodeSafetyRemoveFault implements Action {
  readonly type = HIGHWAY_CODE_SAFETY_REMOVE_FAULT;
}

export class HighwayCodeSafetyAddComment implements Action {
  readonly type = ADD_HIGHWAY_CODE_SAFETY_COMMENT;
  constructor(public comment: string) { }
}

export type Types =
  | ToggleHighwayCodeSafety
  | HighwayCodeSafetyAddDrivingFault
  | HighwayCodeSafetyAddSeriousFault
  | HighwayCodeSafetyRemoveFault
  | HighwayCodeSafetyAddComment;
