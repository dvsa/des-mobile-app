import { EmergencyStop } from '@dvsa/mes-test-schema/categories/AM1';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import * as emergencyStopActions from '../emergency-stop.actions';
import { emergencyStopReducer, initialState } from '../emergency-stop.reducer';

describe('emergency stop reducer', () => {
  describe('handle serious fault', () => {
    it('should set outcome to S', () => {
      const state = { ...initialState };
      const action = emergencyStopActions.AddEmergencyStopSeriousFault();
      const result = emergencyStopReducer(state, action);
      expect(result).toEqual({
        ...initialState,
        outcome: CompetencyOutcome.S,
      } as EmergencyStop);
    });

    it('should set outcome to null', () => {
      const state = {
        ...initialState,
        outcome: CompetencyOutcome.S,
      } as EmergencyStop;
      const action = emergencyStopActions.RemoveEmergencyStopSeriousFault();
      const result = emergencyStopReducer(state, action);
      expect(result).toEqual({
        ...initialState,
        outcome: null,
      } as EmergencyStop);
    });
  });

  describe('handle RecordEmergencyStopFirstAttempt', () => {
    it('should set the firstAttempt to attemptedSpeed', () => {
      const state = { ...initialState };
      const attemptedSpeed = 48;
      const action = emergencyStopActions.RecordEmergencyStopFirstAttempt(attemptedSpeed);
      const result = emergencyStopReducer(state, action);
      expect(result).toEqual({
        ...initialState,
        firstAttempt: attemptedSpeed,
      } as EmergencyStop);
    });
  });

  describe('handle RecordEmergencyStopSecondAttempt', () => {
    it('should set the secondAttempt to attemptedSpeed', () => {
      const state = { ...initialState };
      const attemptedSpeed = 48;
      const action = emergencyStopActions.RecordEmergencyStopSecondAttempt(attemptedSpeed);
      const result = emergencyStopReducer(state, action);
      expect(result).toEqual({
        ...initialState,
        secondAttempt: attemptedSpeed,
      } as EmergencyStop);
    });
  });
});
