import { createAction } from '@ngrx/store';

export const UnuploadedTestsViewDidEnter = createAction(
  '[UnuploadedTestsPage] View did enter',
);

export const ContinueUnuploadedTest = createAction(
  '[UnuploadedTestsPage] Continue test',
  (testStatus: string) => ({ testStatus }),
);
