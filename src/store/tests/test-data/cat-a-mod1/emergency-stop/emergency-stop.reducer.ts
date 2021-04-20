import { EmergencyStop } from '@dvsa/mes-test-schema/categories/AM1';
import * as emergencyStopActions from './emergency-stop.actions';
import { CompetencyOutcome } from '../../../../../shared/models/competency-outcome';
import { createReducer, on } from '@ngrx/store';

export const initialState: EmergencyStop = {};

export const emergencyStopReducer = createReducer(
  initialState,
  on(emergencyStopActions.RecordEmergencyStopFirstAttempt, (state): EmergencyStop => ({
    ...state,
    firstAttempt: attemptedSpeed,
  })),
  on(emergencyStopActions.RecordEmergencyStopSecondAttempt, (state): EmergencyStop => ({
    ...state,
    secondAttempt: attemptedSpeed,
  })),
  on(emergencyStopActions.AddEmergencyStopSeriousFault, (state): EmergencyStop => ({
    ...state,
    outcome: CompetencyOutcome.S,
  })),
  on(emergencyStopActions.RemoveEmergencyStopSeriousFault, (state): EmergencyStop => ({
    ...state,
    outcome: null,
  })),
  on(emergencyStopActions.AddAnEmergencyStopComment, (state): EmergencyStop => ({
    ...state,
    comments: comment,
  })),
)
