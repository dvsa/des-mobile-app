import { EyesightTest } from '@dvsa/mes-test-schema/categories/common';
import {
  EyesightTestAddComment,
  EyesightTestFailed,
  EyesightTestPassed,
  EyesightTestReset,
} from '../eyesight-test.actions';
import { eyesightTestReducer, initialState } from '../eyesight-test.reducer';

describe('Eyesight Test Reducer', () => {
  describe('EYESIGHT_TEST_PASSED', () => {
    it('updates the complete status to true', () => {
      const state: EyesightTest = {};
      const result = eyesightTestReducer(state, EyesightTestPassed());
      expect(result.complete).toEqual(true);
    });

    it('removes an eyesight test serious fault', () => {
      const state: EyesightTest = {
        complete: true,
        seriousFault: true,
      };
      const result = eyesightTestReducer(state, EyesightTestPassed());
      expect(result.complete).toEqual(true);
      expect(result.seriousFault).toEqual(false);
    });
  });

  describe('EYESIGHT_TEST_FAILED', () => {
    it('updates the eyesight status to failed', () => {
      const state: EyesightTest = {
        complete: false,
      };
      const result = eyesightTestReducer(state, EyesightTestFailed());
      expect(result.complete).toBe(true);
      expect(result.seriousFault).toBe(true);
    });
  });

  describe('EYESIGHT_TEST_RESET', () => {
    it('sets the state to the initial state', () => {
      const state: EyesightTest = {
        complete: true,
      };
      const result = eyesightTestReducer(state, EyesightTestReset());
      expect(result).toEqual(initialState);
    });
  });

  describe('EYESIGHT_TEST_ADD_COMMENT', () => {
    it('sets the eyesight test fault comments', () => {
      const state: EyesightTest = {
        complete: true,
        seriousFault: true,
      };
      const result = eyesightTestReducer(state, EyesightTestAddComment('Eyesight test comment'));
      expect(result.faultComments).toEqual('Eyesight test comment');
    });
  });
});
