import { Action } from '@ngrx/store';

import { Competencies } from '../../test-data.constants';

export const ADD_DANGEROUS_FAULT = '[Competency] Add Dangerous Fault';
export const REMOVE_DANGEROUS_FAULT = '[Competency] Remove Dangerous Fault';
export const ADD_DANGEROUS_FAULT_COMMENT = '[Office] Add Dangerous Fault Comment';

export class AddDangerousFault implements Action {
  constructor(public payload: Competencies) { }
  readonly type = ADD_DANGEROUS_FAULT;
}

export class RemoveDangerousFault implements Action {
  constructor(public payload: Competencies) { }
  readonly type = REMOVE_DANGEROUS_FAULT;
}

export class AddDangerousFaultComment implements Action {
  constructor(public competencyName: string, public comment: string) { }
  readonly type = ADD_DANGEROUS_FAULT_COMMENT;
}

export type Types =
  | AddDangerousFault
  | RemoveDangerousFault
  | AddDangerousFaultComment;
