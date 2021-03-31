import { Action } from '@ngrx/store';
import { FaultPayload } from '../../test-data.models';

export const ADD_DRIVING_FAULT = '[Competency] Add Driving Fault';
export const REMOVE_DRIVING_FAULT = '[Competency] Remove Driving Fault';
export const THROTTLE_ADD_DRIVING_FAULT = '[Competency] Debounce Add Driving Fault';
export const ADD_DRIVING_FAULT_COMMENT = '[Office] Add driving fault comment';

export class AddDrivingFault implements Action {
  constructor(public payload: FaultPayload) { }
  readonly type = ADD_DRIVING_FAULT;
}

export class ThrottleAddDrivingFault implements Action {
  constructor(public payload: FaultPayload) { }
  readonly type = THROTTLE_ADD_DRIVING_FAULT;
}

export class RemoveDrivingFault implements Action {
  constructor(public payload: FaultPayload) { }
  readonly type = REMOVE_DRIVING_FAULT;
}

export class AddDrivingFaultComment implements Action {
  constructor(public competencyName: string, public comment: string) { }
  readonly type = ADD_DRIVING_FAULT_COMMENT;
}

export type Types =
  | AddDrivingFault
  | ThrottleAddDrivingFault
  | RemoveDrivingFault
  | AddDrivingFaultComment;
