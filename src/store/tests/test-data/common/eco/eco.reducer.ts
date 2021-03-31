import { Eco } from '@dvsa/mes-test-schema/categories/common';
import * as ecoActions from './eco.actions';

export const initialState: Eco = {};

export function ecoReducer(
  state = initialState,
  action: ecoActions.Types,
): Eco {
  switch (action.type) {
    case ecoActions.TOGGLE_ECO:
      return {
        ...state,
        completed: !state.completed,
      };
    case ecoActions.TOGGLE_CONTROL_ECO:
      return {
        ...state,
        adviceGivenControl: !state.adviceGivenControl,
      };
    case ecoActions.TOGGLE_PLANNING_ECO:
      return {
        ...state,
        adviceGivenPlanning: !state.adviceGivenPlanning,
      };
    default:
      return state;
  }
}
