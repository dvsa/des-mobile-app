import { Action } from '@ngrx/store';

export const ADD_AVOIDANCE_SERIOUS_FAULT = '[SpeedCheck] [CatAMod1] Add Avoidance Speed Req Serious Fault';
export const REMOVE_AVOIDANCE_SERIOUS_FAULT = '[SpeedCheck] [CatAMod1] Remove Avoidance Speed Req Serious Fault';
export const RECORD_AVOIDANCE_FIRST_ATTEMPT = '[SpeedCheck] [CatAMod1] Record Avoidance First Attempt';
export const RECORD_AVOIDANCE_SECOND_ATTEMPT = '[SpeedCheck] [CatAMod1] Record Avoidace Second Attempt';

export const ADD_AVOIDANCE_SPEED_REQUIREMENT_COMMENT = '[SpeedCheck] [CatAMod1] Add Avoidance Comment';

export class AddAvoidanceSeriousFault implements Action {
  readonly type = ADD_AVOIDANCE_SERIOUS_FAULT;
}

export class RemoveAvoidanceSeriousFault implements Action {
  readonly type = REMOVE_AVOIDANCE_SERIOUS_FAULT;
}

export class RecordAvoidanceFirstAttempt implements Action {
  readonly type = RECORD_AVOIDANCE_FIRST_ATTEMPT;
  constructor(public attemptedSpeed: number) {}
}

export class RecordAvoidanceSecondAttempt implements Action {
  readonly type = RECORD_AVOIDANCE_SECOND_ATTEMPT;
  constructor(public attemptedSpeed: number) {}
}

export class AddAvoidanceComment implements Action {
  constructor(public comment: string) {
  }

  readonly type = ADD_AVOIDANCE_SPEED_REQUIREMENT_COMMENT;
}

export type Types =
  | AddAvoidanceSeriousFault
  | RemoveAvoidanceSeriousFault
  | RecordAvoidanceFirstAttempt
  | RecordAvoidanceSecondAttempt
  | AddAvoidanceComment;
