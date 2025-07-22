import { createAction } from '@ngrx/store';

export const TestStartEndTimeEditButtonPressed = createAction('[StartAndEndTime] Time Edit Button Pressed');
export const TestIsTooShortReturn = createAction('[StartAndEndTime] Test Is Too Short Return Button Pressed');
export const TestIsTooShortContinue = createAction('[StartAndEndTime] Test Is Too Short Continue Button Pressed');

export const TestStartEndTimeConfirmBoxChanged = createAction(
  '[StartAndEndTime] Time Edit Checkbox Pressed',
  (selected: boolean) => ({ selected })
);
