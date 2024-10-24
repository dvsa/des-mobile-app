import { ETA } from '@dvsa/mes-test-schema/categories/common';
import { ExaminerActions } from '../../../test-data.constants';
import { ToggleETA } from '../eta.actions';
import { etaReducer } from '../eta.reducer';

describe('ETA Reducer', () => {
  describe('TOGGLE_ETA', () => {
    it('should toggle ETA verbal to true when dispatched first time', () => {
      const state: ETA = {};
      const result = etaReducer(state, ToggleETA(ExaminerActions.verbal));
      expect(result.verbal).toEqual(true);
    });
    it('should toggle ETA verbal to false when dispatched second time', () => {
      const state: ETA = {};
      const modifiedState = etaReducer(state, ToggleETA(ExaminerActions.verbal));
      const result = etaReducer(modifiedState, ToggleETA(ExaminerActions.verbal));
      expect(result.verbal).toEqual(false);
    });
    it('should toggle ETA physical to true when dispatched first time', () => {
      const state: ETA = {};
      const result = etaReducer(state, ToggleETA(ExaminerActions.physical));
      expect(result.physical).toBe(true);
    });
    it('should toggle ETA physical to false when dispatched second time', () => {
      const state: ETA = {};
      const modifiedState = etaReducer(state, ToggleETA(ExaminerActions.physical));
      const result = etaReducer(modifiedState, ToggleETA(ExaminerActions.physical));
      expect(result.physical).toEqual(false);
    });
  });
});
