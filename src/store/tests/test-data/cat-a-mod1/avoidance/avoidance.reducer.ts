import { Avoidance } from '@dvsa/mes-test-schema/categories/AM1';
import * as avoidanceActions from './avoidance.actions';
import { CompetencyOutcome } from '../../../../../shared/models/competency-outcome';

export const initialState: Avoidance = {};

export function avoidanceReducer(
  state: Avoidance = initialState,
  action: avoidanceActions.Types,
): Avoidance {
  switch (action.type) {
    case avoidanceActions.RECORD_AVOIDANCE_FIRST_ATTEMPT:
      return {
        ...state,
        firstAttempt: action.attemptedSpeed,
      };
    case avoidanceActions.RECORD_AVOIDANCE_SECOND_ATTEMPT:
      return {
        ...state,
        secondAttempt: action.attemptedSpeed,
      };
    case avoidanceActions.ADD_AVOIDANCE_SERIOUS_FAULT:
      return {
        ...state,
        outcome: CompetencyOutcome.S,
      };
    case avoidanceActions.REMOVE_AVOIDANCE_SERIOUS_FAULT:
      return {
        ...state,
        outcome: null,
      };
    case avoidanceActions.ADD_AVOIDANCE_SPEED_REQUIREMENT_COMMENT:
      return {
        ...state,
        comments: action.comment,
      };
    default:
      return state;
  }
}
