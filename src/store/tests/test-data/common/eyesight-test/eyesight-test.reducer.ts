import { EyesightTest } from '@dvsa/mes-test-schema/categories/common';
import * as eyesightTestActions from './eyesight-test.actions';

export const initialState: EyesightTest = {};

export function eyesightTestReducer(
  state = initialState,
  action: eyesightTestActions.Types,
): EyesightTest {
  switch (action.type) {
    case eyesightTestActions.EYESIGHT_TEST_PASSED:
      return {
        complete: true,
        seriousFault: false,
      };
    case eyesightTestActions.EYESIGHT_TEST_FAILED:
      return {
        complete: true,
        seriousFault: true,
      };
    case eyesightTestActions.EYESIGHT_TEST_RESET:
      return initialState;
    case eyesightTestActions.EYESIGHT_TEST_ADD_COMMENT:
      return {
        ...state,
        faultComments: action.comment,
      };
    default:
      return state;
  }
}
