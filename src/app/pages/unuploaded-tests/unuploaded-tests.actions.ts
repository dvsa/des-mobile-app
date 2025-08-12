import { createAction } from '@ngrx/store';

export const UnuploadedTestsViewDidEnter = createAction('[UnuploadedTestsPage] View did enter');

export const UnuploadedTestsReturnToDashboardPressed = createAction(
  '[UnuploadedTestsPage] Return to dashboard via exit button'
);

export const ContinueUnuploadedTest = createAction('[UnuploadedTestsPage] Continue test', (testStatus: string) => ({
  testStatus,
}));

export const LoadCompletedTestsFromUnsubmitted = createAction(
  '[UnuploadedTestsEffects] Load Completed Tests from un-uploaded',
  (numberOfDays = 14) => ({ numberOfDays })
);
