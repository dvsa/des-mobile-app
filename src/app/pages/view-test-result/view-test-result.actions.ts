import { createAction } from '@ngrx/store';

export const ViewTestResultViewDidEnter = createAction(
  '[View Test Result] View Test Result Did Enter',
  (applicationReference: string) => ({ applicationReference }),
);
