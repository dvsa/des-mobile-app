import { Eco } from '@dvsa/mes-test-schema/categories/common';
import { ecoReducer } from '../eco.reducer';
import { ToggleEco, ToggleControlEco, TogglePlanningEco } from '../eco.actions';

describe('Eco Reducer', () => {

  describe('TOGGLE_ECO', () => {
    it('should toggle eco (true when dispatched first time)', () => {
      const state: Eco = {};
      const result = ecoReducer(state, new ToggleEco());
      expect(result.completed).toEqual(true);
    });
    it('should toggle eco (false when dispatched second time)', () => {
      const state: Eco = {};
      const modifiedState = ecoReducer(state, new ToggleEco());
      const result = ecoReducer(modifiedState, new ToggleEco());
      expect(result.completed).toEqual(false);
    });
  });

  describe('TOGGLE_CONTROL_ECO', () => {
    it('should toggle control eco fault (true when dispatched first time)', () => {
      const state: Eco = {};
      const result = ecoReducer(state, new ToggleControlEco());
      expect(result.adviceGivenControl).toEqual(true);
    });
    it('should toggle control eco fault (false when dispatched second time)', () => {
      const state: Eco = {};
      const modifiedState = ecoReducer(state, new ToggleControlEco());
      const result = ecoReducer(modifiedState, new ToggleControlEco());
      expect(result.adviceGivenControl).toEqual(false);
    });
  });

  describe('TOGGLE_PLANNING_ECO', () => {
    it('should toggle the planning eco fault (true when dispatched first time)', () => {
      const state: Eco = {};
      const result = ecoReducer(state, new TogglePlanningEco());
      expect(result.adviceGivenPlanning).toEqual(true);
    });
    it('should toggle planning eco fault (false when dispatched second time)', () => {
      const state: Eco = {};
      const modifiedState = ecoReducer(state, new TogglePlanningEco());
      const result = ecoReducer(modifiedState, new TogglePlanningEco());
      expect(result.adviceGivenPlanning).toEqual(false);
    });
  });
});
