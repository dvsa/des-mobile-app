import { Avoidance } from '@dvsa/mes-test-schema/categories/AM1';
import * as avoidanceActions from './avoidance.actions';
import { CompetencyOutcome } from '../../../../../shared/models/competency-outcome';
import { createReducer, on } from '@ngrx/store';

export const initialState: Avoidance = {};

export const avoidanceReducer = createReducer(
  initialState,
  on(avoidanceActions.RecordAvoidanceFirstAttempt, (state): Avoidance => ({
    ...state,
    firstAttempt: attemptedSpeed,
  })),
  on(avoidanceActions.RecordAvoidanceSecondAttempt, (state): Avoidance => ({
    ...state,
    secondAttempt: attemptedSpeed,
  })),
  on(avoidanceActions.AddAvoidanceSeriousFault, (state): Avoidance => ({
    ...state,
    outcome: CompetencyOutcome.S,
  })),
  on(avoidanceActions.RemoveAvoidanceSeriousFault, (state): Avoidance => ({
    ...state,
    outcome: null,
  })),
  on(avoidanceActions.AddAvoidanceComment, (state): Avoidance => ({
    ...state,
    comments: comment,
  })),
)
