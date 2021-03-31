import { ETA } from '@dvsa/mes-test-schema/categories/common';
import * as etaActions from './eta.actions';

export const initialState: ETA = {};

export function etaReducer(
  state = initialState,
  action: etaActions.Types,
): ETA {
  switch (action.type) {
    case etaActions.TOGGLE_ETA:
      return {
        ...state,
        [action.payload]: !state[action.payload],
      };
    default:
      return state;
  }
}
