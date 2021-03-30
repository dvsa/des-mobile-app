import { createAction, props } from '@ngrx/store';

export const SetExaminerBooked = createAction(
  '[Test Actions] Set the examiner the test was booked against',
  props<{ payload: number | string; }>(),
);
