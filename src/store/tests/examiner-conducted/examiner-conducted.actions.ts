import { createAction } from '@ngrx/store';

export const SetExaminerConducted = createAction(
  '[Test Actions] Set the examiner the test was conducted by',
  (examinerConducted: number | string) => ({ examinerConducted }),
);
