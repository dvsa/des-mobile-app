import { createAction } from '@ngrx/store';

export const SetExaminerKeyed = createAction(
  '[Test Actions] Set the examiner the test was keyed by',
  (examinerKeyed: number) => ({ examinerKeyed }),
);
