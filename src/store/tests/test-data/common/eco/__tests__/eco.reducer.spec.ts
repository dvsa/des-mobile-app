import { Eco } from '@dvsa/mes-test-schema/categories/common';
import { ToggleControlEco, ToggleEco, TogglePlanningEco } from '../eco.actions';
import { ecoReducer } from '../eco.reducer';

describe('Eco Reducer', () => {
  describe('TOGGLE_ECO', () => {
    it('should toggle eco (true when dispatched first time)', () => {
      const state: Eco = {};
      const result = ecoReducer(state, ToggleEco());
      expect(result.completed).toEqual(true);
    });
    it('should toggle eco (false when dispatched second time)', () => {
      const state: Eco = {};
      const modifiedState = ecoReducer(state, ToggleEco());
      const result = ecoReducer(modifiedState, ToggleEco());
      expect(result.completed).toEqual(false);
    });
  });

  describe('TOGGLE_CONTROL_ECO', () => {
    it('should toggle control eco fault (true when dispatched first time)', () => {
      const state: Eco = {};
      const result = ecoReducer(state, ToggleControlEco());
      expect(result.adviceGivenControl).toEqual(true);
    });
    it('should toggle control eco fault (false when dispatched second time)', () => {
      const state: Eco = {};
      const modifiedState = ecoReducer(state, ToggleControlEco());
      const result = ecoReducer(modifiedState, ToggleControlEco());
      expect(result.adviceGivenControl).toEqual(false);
    });
  });

  describe('TOGGLE_PLANNING_ECO', () => {
    it('should toggle the planning eco fault (true when dispatched first time)', () => {
      const state: Eco = {};
      const result = ecoReducer(state, TogglePlanningEco());
      expect(result.adviceGivenPlanning).toEqual(true);
    });
    it('should toggle planning eco fault (false when dispatched second time)', () => {
      const state: Eco = {};
      const modifiedState = ecoReducer(state, TogglePlanningEco());
      const result = ecoReducer(modifiedState, TogglePlanningEco());
      expect(result.adviceGivenPlanning).toEqual(false);
    });
  });
});
