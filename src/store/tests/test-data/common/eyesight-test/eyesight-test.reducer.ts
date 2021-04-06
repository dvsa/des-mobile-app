import { EyesightTest } from '@dvsa/mes-test-schema/categories/common';
import { createReducer, on } from '@ngrx/store';
import * as eyesightTestActions from './eyesight-test.actions';

export const initialState: EyesightTest = {};

export const eyesightTestReducer = createReducer(
  initialState,
  on(eyesightTestActions.EyesightTestPassed, (): EyesightTest => ({
    complete: true,
    seriousFault: false,
  })),
  on(eyesightTestActions.EyesightTestFailed, (): EyesightTest => ({
    complete: true,
    seriousFault: true,
  })),
  on(eyesightTestActions.EyesightTestReset, (): EyesightTest => ({
    ...initialState,
  })),
  on(eyesightTestActions.EyesightTestAddComment, (state, { comment }): EyesightTest => ({
    ...state,
    faultComments: comment,
  })),
);
