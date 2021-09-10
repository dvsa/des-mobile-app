import { createAction } from '@ngrx/store';

export const TestStartDateChanged = createAction(
  '[OfficePage] Test Start Date Changed',
  (previousStartDate: string, customStartDate: string) => ({ previousStartDate, customStartDate }),
);

export const OfficeViewDidEnter = createAction(
  '[OfficePage] Office view did enter',
);

export const CompleteTest = createAction(
  '[OfficePage] Complete Test',
);

export const SavingWriteUpForLater = createAction(
  '[OfficePage] Saving write-up for later',
);

export const OfficeValidationError = createAction(
  '[OfficePage] Validation error',
  (errorMessage: string) => ({ errorMessage }),
);

export type OfficeActionTypes =
  | ReturnType<typeof TestStartDateChanged>
  | ReturnType<typeof CompleteTest>
  | ReturnType<typeof OfficeViewDidEnter>
  | ReturnType<typeof SavingWriteUpForLater>;
