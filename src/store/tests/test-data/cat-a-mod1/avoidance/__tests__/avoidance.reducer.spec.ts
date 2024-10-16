import { Avoidance } from '@dvsa/mes-test-schema/categories/AM1';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import * as avoidanceActions from '../avoidance.actions';
import { avoidanceReducer, initialState } from '../avoidance.reducer';

describe('avoidance reducer', () => {
  describe('handle ToggleEmergencyStopSpeedReq', () => {
    it('should set outcome to S', () => {
      const state = { ...initialState };
      const action = avoidanceActions.AddAvoidanceSeriousFault();
      const result = avoidanceReducer(state, action);
      expect(result).toEqual({
        ...initialState,
        outcome: CompetencyOutcome.S,
      } as Avoidance);
    });

    it('should set outcome to null', () => {
      const state: Avoidance = {
        ...initialState,
        outcome: CompetencyOutcome.S,
      };
      const action = avoidanceActions.RemoveAvoidanceSeriousFault();
      const result = avoidanceReducer(state, action);
      expect(result).toEqual({
        ...initialState,
        outcome: null,
      } as Avoidance);
    });
  });

  describe('handle RecordAvoidanceFirstAttempt', () => {
    it('should set the firstAttempt to attemptedSpeed', () => {
      const state = { ...initialState };
      const attemptedSpeed = 48;
      const action = avoidanceActions.RecordAvoidanceFirstAttempt(attemptedSpeed);
      const result = avoidanceReducer(state, action);
      expect(result).toEqual({
        ...initialState,
        firstAttempt: attemptedSpeed,
      } as Avoidance);
    });
  });

  describe('handle RecordAvoidanceSecondAttempt', () => {
    it('should set the secondAttempt to attemptedSpeed', () => {
      const state = { ...initialState };
      const attemptedSpeed = 48;
      const action = avoidanceActions.RecordAvoidanceSecondAttempt(attemptedSpeed);
      const result = avoidanceReducer(state, action);
      expect(result).toEqual({
        ...initialState,
        secondAttempt: attemptedSpeed,
      } as Avoidance);
    });
  });
});
