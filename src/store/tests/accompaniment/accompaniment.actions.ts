import { createAction } from '@ngrx/store';

export const InstructorAccompanimentToggled = createAction('[Accompaniment] Instructor accompaniment toggled');

export const SupervisorAccompanimentToggled = createAction('[Accompaniment] Supervisor accompaniment toggled');

export const OtherAccompanimentToggled = createAction('[Accompaniment] Other accompaniment toggled');

export const InterpreterAccompanimentToggled = createAction('[Accompaniment] Interpreter accompaniment toggled');

export const InstructorAccompanimentConfirmed = createAction('[Accompaniment] Instructor accompaniment Confirmed');

export const SupervisorAccompanimentConfirmed = createAction('[Accompaniment] Supervisor accompaniment Confirmed');

export const OtherAccompanimentConfirmed = createAction('[Accompaniment] Other accompaniment Confirmed');

export const InterpreterAccompanimentConfirmed = createAction('[Accompaniment] Interpreter accompaniment Confirmed');
