import { Action } from '@ngrx/store';

export const INTERPRETER_ACCOMPANIMENT_TOGGLED = '[Accompaniment] [Cat CPC] Interpreter accompaniment toggled';
export const SUPERVISOR_ACCOMPANIMENT_TOGGLED = '[Accompaniment] [Cat CPC] Supervisor accompaniment toggled';

export class InterpreterAccompanimentToggled implements Action {
  readonly type = INTERPRETER_ACCOMPANIMENT_TOGGLED;
}

export class SupervisorAccompanimentToggled implements Action {
  readonly type = SUPERVISOR_ACCOMPANIMENT_TOGGLED;
}

export type Types =
  | InterpreterAccompanimentToggled
  | SupervisorAccompanimentToggled;
