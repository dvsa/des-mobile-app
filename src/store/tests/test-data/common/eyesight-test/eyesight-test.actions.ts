import { createAction, props } from '@ngrx/store';

export const EyesightTestPassed = createAction(
  '[EyesightTest] Set passed',
);

export const EyesightTestFailed = createAction(
  '[EyesightTest] Set failed',
);

export const EyesightTestReset = createAction(
  '[EyesightTest] Reset state',
);

export const EyesightTestAddComment = createAction(
  '[EyesightTest] Add comment',
  props<{ payload: string }>(),
);
