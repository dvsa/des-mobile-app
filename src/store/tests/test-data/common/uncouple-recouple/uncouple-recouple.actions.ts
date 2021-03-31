import { Action } from '@ngrx/store';

export const TOGGLE_UNCOUPLE_RECOUPLE = '[UncoupleRecouple] Toggle Uncouple Recouple';
export const UNCOUPLE_RECOUPLE_ADD_DRIVING_FAULT = '[UncoupleRecouple] Add Driving Fault';
export const UNCOUPLE_RECOUPLE_ADD_SERIOUS_FAULT = '[UncoupleRecouple] Add Serious Fault';
export const UNCOUPLE_RECOUPLE_ADD_DANGEROUS_FAULT = '[UncoupleRecouple] Add Dangerous Fault';
export const UNCOUPLE_RECOUPLE_REMOVE_FAULT = '[UncoupleRecouple] Remove Fault';
export const ADD_UNCOUPLE_RECOUPLE_COMMENT = '[UncoupleRecouple] Add Comment';

export class ToggleUncoupleRecouple implements Action {
  readonly type = TOGGLE_UNCOUPLE_RECOUPLE;
}

export class UncoupleRecoupleAddDrivingFault implements Action {
  readonly type = UNCOUPLE_RECOUPLE_ADD_DRIVING_FAULT;
}
export class UncoupleRecoupleAddSeriousFault implements Action {
  readonly type = UNCOUPLE_RECOUPLE_ADD_SERIOUS_FAULT;
}

export class UncoupleRecoupleAddDangerousFault implements Action {
  readonly type = UNCOUPLE_RECOUPLE_ADD_DANGEROUS_FAULT;
}

export class UncoupleRecoupleRemoveFault implements Action {
  readonly type = UNCOUPLE_RECOUPLE_REMOVE_FAULT;
}

export class AddUncoupleRecoupleComment implements Action {
  readonly type = ADD_UNCOUPLE_RECOUPLE_COMMENT;
  constructor(public comment: string) { }
}

export type Types =
  | ToggleUncoupleRecouple
  | UncoupleRecoupleAddDrivingFault
  | UncoupleRecoupleAddSeriousFault
  | UncoupleRecoupleAddDangerousFault
  | UncoupleRecoupleRemoveFault
  | AddUncoupleRecoupleComment;
