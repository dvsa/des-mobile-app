import { createAction, props } from '@ngrx/store';

export const SetExaminerKeyed = createAction(
  '[Test Actions] Set the examiner the test was keyed by',
  props<{ payload: number; }>(),
);
