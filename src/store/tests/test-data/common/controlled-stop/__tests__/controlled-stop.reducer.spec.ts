import { ControlledStopUnion } from '@shared/unions/test-schema-unions';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { controlledStopReducer } from '../controlled-stop.reducer';
import {
  AddControlledStopComment,
  ControlledStopAddDangerousFault,
  ControlledStopAddDrivingFault,
  ControlledStopAddSeriousFault,
  ControlledStopRemoveFault,
  ToggleControlledStop,
} from '../controlled-stop.actions';

describe('Controlled Stop Reducer', () => {

  describe('TOGGLE_CONTROLLED_STOP', () => {
    it('should toggle the controlled stop (true when dispatched first time)', () => {
      const state: ControlledStopUnion = {};
      const result = controlledStopReducer(state, ToggleControlledStop());
      expect(result.selected).toEqual(true);
    });
    it('should remove the controlled stop property when dispatched second time', () => {
      const state: ControlledStopUnion = {};
      const modifiedState = controlledStopReducer(state, ToggleControlledStop());
      const result = controlledStopReducer(modifiedState, ToggleControlledStop());
      expect(result.selected).toEqual(false);
    });
  });

  describe('CONTROLLED_STOP_ADD_DRIVING_FAULT', () => {
    it('should add the correct fault', () => {
      const state: ControlledStopUnion = {};
      const result = controlledStopReducer(state, ControlledStopAddDrivingFault());
      expect(result.selected).toEqual(true);
      expect(result.fault).toEqual(CompetencyOutcome.DF);
    });
  });

  describe('CONTROLLED_STOP_ADD_SERIOUS_FAULT', () => {
    it('should add the correct fault', () => {
      const state: ControlledStopUnion = {};
      const result = controlledStopReducer(state, ControlledStopAddSeriousFault());
      expect(result.selected).toEqual(true);
      expect(result.fault).toEqual(CompetencyOutcome.S);
    });
  });

  describe('CONTROLLED_STOP_ADD_DANGEROUS_FAULT', () => {
    it('should add the correct fault', () => {
      const state: ControlledStopUnion = {};
      const result = controlledStopReducer(state, ControlledStopAddDangerousFault());
      expect(result.selected).toEqual(true);
      expect(result.fault).toEqual(CompetencyOutcome.D);
    });
  });

  describe('CONTROLLED_STOP_REMOVE_FAULT', () => {
    it('should remove the fault', () => {
      const state: ControlledStopUnion = {};
      const modifiedState = controlledStopReducer(state, ControlledStopAddDangerousFault());
      const result = controlledStopReducer(modifiedState, ControlledStopRemoveFault(CompetencyOutcome.D));
      expect(result.selected).toEqual(true);
      expect(result.fault).toBeUndefined();
      expect(result.faultComments).toBeUndefined();
    });
  });

  describe('ADD_CONTROLLED_STOP_COMMENT', () => {
    it('should add a fault comment', () => {
      const state: ControlledStopUnion = {};
      const result = controlledStopReducer(state, AddControlledStopComment('Test'));
      expect(result.faultComments).toEqual('Test');
    });
  });
});
