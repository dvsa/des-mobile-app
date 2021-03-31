import { HighwayCodeSafetyUnion } from '../../../../../shared/unions/test-schema-unions';

import * as highwayCodeSafetyActions from './highway-code-safety.actions';
import { createFeatureSelector } from '@ngrx/store';

export const initialState: HighwayCodeSafetyUnion = {};

export function highwayCodeSafetyReducer(
  state = initialState,
  action: highwayCodeSafetyActions.Types,
): HighwayCodeSafetyUnion {
  switch (action.type) {
    case highwayCodeSafetyActions.TOGGLE_HIGHWAYCODE_SAFETY:
      return {
        ...state,
        selected: !state.selected,
      };
    case highwayCodeSafetyActions.HIGHWAY_CODE_SAFETY_ADD_DRIVING_FAULT:
      return {
        ...state,
        drivingFault: true,
        selected: true,
      };
    case highwayCodeSafetyActions.HIGHWAY_CODE_SAFETY_ADD_SERIOUS_FAULT:
      return {
        ...state,
        seriousFault: true,
        selected: true,
      };
    case highwayCodeSafetyActions.HIGHWAY_CODE_SAFETY_REMOVE_FAULT:
      return {
        selected: state.selected,
      };
    case highwayCodeSafetyActions.ADD_HIGHWAY_CODE_SAFETY_COMMENT:
      return {
        ...state,
        faultComments: action.comment,
      };
    default:
      return state;
  }
}

export const getHighwayCodeSafety = createFeatureSelector<HighwayCodeSafetyUnion>('highwayCodeSafety');
