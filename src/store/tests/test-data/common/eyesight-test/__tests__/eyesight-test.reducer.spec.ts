import { EyesightTest } from '@dvsa/mes-test-schema/categories/common';
import { eyesightTestReducer, initialState } from '../eyesight-test.reducer';
import {
  EyesightTestPassed,
  EyesightTestFailed,
  EyesightTestReset,
  EyesightTestAddComment,
} from '../eyesight-test.actions';

describe('Eyesight Test Reducer', () => {

  describe('EYESIGHT_TEST_PASSED', () => {
    it('updates the complete status to true', () => {
      const state: EyesightTest = {};
      const result = eyesightTestReducer(state, new EyesightTestPassed());
      expect(result.complete).toEqual(true);
    });

    it('removes an eyesight test serious fault', () => {
      const state: EyesightTest = {
        complete: true,
        seriousFault: true,
      };
      const result = eyesightTestReducer(state, new EyesightTestPassed());
      expect(result.complete).toEqual(true);
      expect(result.seriousFault).toEqual(false);
    });
  });

  describe('EYESIGHT_TEST_FAILED', () => {
    it('updates the eyesight status to failed', () => {
      const state: EyesightTest = {
        complete: false,
      };
      const result = eyesightTestReducer(state, new EyesightTestFailed());
      expect(result.complete).toBe(true);
      expect(result.seriousFault).toBe(true);
    });
  });

  describe('EYESIGHT_TEST_RESET', () => {
    it('sets the state to the initial state', () => {
      const state: EyesightTest = {
        complete: true,
      };
      const result = eyesightTestReducer(state, new EyesightTestReset());
      expect(result).toBe(initialState);
    });
  });

  describe('EYESIGHT_TEST_ADD_COMMENT', () => {
    it('sets the eyesight test fault comments', () => {
      const state: EyesightTest = {
        complete: true,
        seriousFault: true,
      };
      const result = eyesightTestReducer(state, new EyesightTestAddComment('Eyesight test comment'));
      expect(result.faultComments).toEqual('Eyesight test comment');
    });
  });
});
