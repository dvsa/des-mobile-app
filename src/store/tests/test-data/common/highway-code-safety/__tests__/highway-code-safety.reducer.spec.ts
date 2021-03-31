import { HighwayCodeSafetyUnion } from '../../../../../../shared/unions/test-schema-unions';
import { highwayCodeSafetyReducer } from '../highway-code-safety.reducer';
import {
  ToggleHighwayCodeSafety,
  HighwayCodeSafetyAddDrivingFault,
  HighwayCodeSafetyAddSeriousFault,
  HighwayCodeSafetyRemoveFault,
  HighwayCodeSafetyAddComment,
} from '../highway-code-safety.actions';

describe('Highway Code Safety Reducer' , () => {

  describe('TOGGLE_HIGHWAY_CODE_SAFETY_STOP', () => {
    it('should toggle the highway code safety (true when dispatched first time)', () => {
      const state: HighwayCodeSafetyUnion = {};
      const result = highwayCodeSafetyReducer(state, new ToggleHighwayCodeSafety());
      expect(result.selected).toEqual(true);
    });
    it('should remove the highway code safety property when dispatched second time', () => {
      const state: HighwayCodeSafetyUnion = {};
      const modifiedState = highwayCodeSafetyReducer(state, new ToggleHighwayCodeSafety());
      const result = highwayCodeSafetyReducer(modifiedState, new ToggleHighwayCodeSafety());
      expect(result.selected).toEqual(false);
    });
  });

  describe('HIGHWAY_CODE_SAFETY_ADD_DRIVING_FAULT', () => {
    it('should add the correct fault', () => {
      const state: HighwayCodeSafetyUnion = {};
      const result = highwayCodeSafetyReducer(state, new HighwayCodeSafetyAddDrivingFault());
      expect(result.selected).toEqual(true);
      expect(result.drivingFault).toEqual(true);
    });
  });

  describe('HIGHWAY_CODE_SAFETY_ADD_SERIOUS_FAULT', () => {
    it('should add the correct fault', () => {
      const state: HighwayCodeSafetyUnion = {};
      const result = highwayCodeSafetyReducer(state, new HighwayCodeSafetyAddSeriousFault());
      expect(result.selected).toEqual(true);
      expect(result.seriousFault).toEqual(true);
    });
  });

  describe('ADD_HIGHWAY_CODE_SAFETY_COMMENT', () => {
    it('should add a fault comment', () => {
      const state: HighwayCodeSafetyUnion = {};
      const result = highwayCodeSafetyReducer(state, new HighwayCodeSafetyAddComment('Test'));
      expect(result.faultComments).toEqual('Test');
    });
  });

  describe('HIGHWAY_CODE_SAFETY_REMOVE_FAULT', () => {
    it('should remove the fault', () => {
      const state: HighwayCodeSafetyUnion = {};
      const modifiedState = highwayCodeSafetyReducer(state, new HighwayCodeSafetyAddSeriousFault());
      const result = highwayCodeSafetyReducer(modifiedState, new HighwayCodeSafetyRemoveFault());
      expect(result.selected).toEqual(true);
      expect(result.seriousFault).toBeUndefined();
      expect(result.faultComments).toBeUndefined();
    });
  });

});
