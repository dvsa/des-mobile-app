import { EmergencyStop } from '@dvsa/mes-test-schema/categories/AM1';
import { createReducer, on } from '@ngrx/store';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import * as emergencyStopActions from './emergency-stop.actions';

export const initialState: EmergencyStop = {};

export const emergencyStopReducer = createReducer(
  initialState,
  on(emergencyStopActions.RecordEmergencyStopFirstAttempt, (state, { attemptedSpeed }): EmergencyStop => ({
    ...state,
    firstAttempt: attemptedSpeed,
  })),
  on(emergencyStopActions.RecordEmergencyStopSecondAttempt, (state, { attemptedSpeed }): EmergencyStop => ({
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
  on(emergencyStopActions.AddAnEmergencyStopComment, (state, { comment }): EmergencyStop => ({
    ...state,
    comments: comment,
  })),
);
