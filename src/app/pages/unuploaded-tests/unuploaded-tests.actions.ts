import { createAction } from '@ngrx/store';

export const UnuploadedTestsViewDidEnter = createAction(
  '[UnuploadedTestsPage] View did enter',
);

export const ContinueUnuploadedTest = createAction(
  '[UnuploadedTestsPage] Continue test',
  (testStatus: string) => ({ testStatus }),
);

export const LoadCompletedTestsFromUnsubmitted = createAction(
  '[UnuploadedTestsEffects] Load Completed Tests from un-uploaded',
  (numberOfDays: number = 14) => ({ numberOfDays }),
);

export const StoreUnuploadedSlotsInTests = createAction(
  '[UnuploadedTestsEffects] Set un-uploaded slots into tests',
);
