import { EmergencyStop } from '@dvsa/mes-test-schema/categories/AM1';
import * as emergencyStopActions from './emergency-stop.actions';
import { CompetencyOutcome } from '../../../../../shared/models/competency-outcome';

export const initialState: EmergencyStop = {};

export function emergencyStopReducer(
  state: EmergencyStop = initialState,
  action: emergencyStopActions.Types,
): EmergencyStop {
  switch (action.type) {
    case emergencyStopActions.RECORD_EMERGENCY_STOP_FIRST_ATTEMPT:
      return {
        ...state,
        firstAttempt: action.attemptedSpeed,
      };
    case emergencyStopActions.RECORD_EMERGENCY_STOP_SECOND_ATTEMPT:
      return {
        ...state,
        secondAttempt: action.attemptedSpeed,
      };
    case emergencyStopActions.ADD_EMERGENCY_STOP_SERIOUS_FAULT:
      return {
        ...state,
        outcome: CompetencyOutcome.S,
      };
    case emergencyStopActions.REMOVE_EMERGENCY_STOP_SERIOUS_FAULT:
      return {
        ...state,
        outcome: null,
      };
    case emergencyStopActions.ADD_EMERGENCY_STOP_COMMENT:
      return {
        ...state,
        comments: action.comment,
      };
    default:
      return state;
  }
}
