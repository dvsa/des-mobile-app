import { Avoidance } from '@dvsa/mes-test-schema/categories/AM1';
import { createReducer, on } from '@ngrx/store';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import * as avoidanceActions from './avoidance.actions';

export const initialState: Avoidance = {};

export const avoidanceReducer = createReducer(
  initialState,
  on(avoidanceActions.RecordAvoidanceFirstAttempt, (state, { attemptedSpeed }): Avoidance => ({
    ...state,
    firstAttempt: attemptedSpeed,
  })),
  on(avoidanceActions.RecordAvoidanceSecondAttempt, (state, { attemptedSpeed }): Avoidance => ({
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
  on(avoidanceActions.AddAvoidanceComment, (state, { comment }): Avoidance => ({
    ...state,
    comments: comment,
  })),
);
