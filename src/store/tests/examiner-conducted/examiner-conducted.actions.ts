import { createAction, props } from '@ngrx/store';

export const SetExaminerConducted = createAction(
  '[Test Actions] Set the examiner the test was conducted by',
  props<{ payload: number | string; }>(),
);
