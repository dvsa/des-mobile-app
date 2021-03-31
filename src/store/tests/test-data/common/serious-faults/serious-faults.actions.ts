import { Action } from '@ngrx/store';
import { Competencies } from '../../test-data.constants';

export const ADD_SERIOUS_FAULT = '[Competency] Add Serious Fault';
export const REMOVE_SERIOUS_FAULT = '[Competency] Remove Serious Fault';
export const ADD_SERIOUS_FAULT_COMMENT = '[Office] Add Serious Fault Comment';

export class AddSeriousFault implements Action {
  constructor(public payload: Competencies) { }
  readonly type = ADD_SERIOUS_FAULT;
}

export class RemoveSeriousFault implements Action {
  constructor(public payload: Competencies) { }
  readonly type = REMOVE_SERIOUS_FAULT;
}

export class AddSeriousFaultComment implements Action {
  constructor(public competencyName: string, public comment: string) { }
  readonly type = ADD_SERIOUS_FAULT_COMMENT;
}

export type Types =
  | AddSeriousFault
  | RemoveSeriousFault
  | AddSeriousFaultComment;
