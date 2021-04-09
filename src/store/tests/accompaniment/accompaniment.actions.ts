import { createAction } from '@ngrx/store';

export const InstructorAccompanimentToggled = createAction(
  '[Accompaniment] Instructor accompaniment toggled',
);

export const SupervisorAccompanimentToggled = createAction(
  '[Accompaniment] Supervisor accompaniment toggled',
);

export const OtherAccompanimentToggled = createAction(
  '[Accompaniment] Other accompaniment toggled',
);

export const InterpreterAccompanimentToggled = createAction(
  '[Accompaniment] Interpreter accompaniment toggled',
);
