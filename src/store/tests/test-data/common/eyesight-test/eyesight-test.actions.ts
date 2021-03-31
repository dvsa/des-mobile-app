import { Action } from '@ngrx/store';

export const EYESIGHT_TEST_PASSED = '[EyesightTest] Set passed';
export const EYESIGHT_TEST_FAILED = '[EyesightTest] Set failed';
export const EYESIGHT_TEST_RESET = '[EyesightTest] Reset state';
export const EYESIGHT_TEST_ADD_COMMENT = '[EyesightTest] Add comment';

export class EyesightTestPassed implements Action {
  readonly type = EYESIGHT_TEST_PASSED;
}

export class EyesightTestFailed implements Action {
  readonly type = EYESIGHT_TEST_FAILED;
}

export class EyesightTestReset implements Action {
  readonly type = EYESIGHT_TEST_RESET;
}

export class EyesightTestAddComment implements Action {
  readonly type = EYESIGHT_TEST_ADD_COMMENT;
  constructor(public comment: string) { }
}

export type Types =
  | EyesightTestPassed
  | EyesightTestFailed
  | EyesightTestReset
  | EyesightTestAddComment;
