import { Action } from '@ngrx/store';
import { ExaminerActions } from '../../test-data.constants';

export const TOGGLE_ETA = '[Eta] Toggle Eta';

export class ToggleETA implements Action {
  constructor(public payload: ExaminerActions) { }
  readonly type = TOGGLE_ETA;
}

export type Types =
  | ToggleETA;
