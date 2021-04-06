import { createAction } from '@ngrx/store';

export const SetExaminerBooked = createAction(
  '[Test Actions] Set the examiner the test was booked against',
  (examinerBooked: number | string) => ({ examinerBooked }),
);
