import { testReportReducer, initialState } from '../test-report.reducer';
import { ToggleSeriousFaultMode, ToggleDangerousFaultMode } from '../test-report.actions';

describe('TestReportReducer reducer', () => {
  describe('TOGGLE_SERIOUS_FAULT_MODE', () => {
    it('should enable serious fault mode', () => {
      const result = testReportReducer(initialState, ToggleSeriousFaultMode());
      expect(result.seriousMode).toEqual(true);
    });
    it('should disable serious fault mode', () => {
      const state = {
        ...initialState,
        seriousMode: true,
      };
      const result = testReportReducer(state, ToggleSeriousFaultMode());
      expect(result.seriousMode).toEqual(false);
    });
  });
  describe('TOGGLE_DANGEROUS_FAULT_MODE', () => {
    it('should enable dangerous fault mode', () => {
      const result = testReportReducer(initialState, ToggleDangerousFaultMode());
      expect(result.dangerousMode).toEqual(true);
    });
    it('should disable dangerous fault mode', () => {
      const state = {
        ...initialState,
        dangerousMode: true,
      };
      const result = testReportReducer(state, ToggleDangerousFaultMode());
      expect(result.dangerousMode).toEqual(false);
    });
  });
});
