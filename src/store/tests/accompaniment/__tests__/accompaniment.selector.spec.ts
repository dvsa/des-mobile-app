import { Accompaniment } from '@dvsa/mes-test-schema/categories/common';
import {
  getInstructorAccompaniment,
  getSupervisorAccompaniment,
  getOtherAccompaniment,
  getInterpreterAccompaniment,
} from '../accompaniment.selector';

describe('accompaniment selector', () => {
  const state: Accompaniment = {
    ADI: false,
    other: true,
    supervisor: false,
    interpreter: false,
  };

  describe('getInstructorAccompaniment', () => {
    it('should retrieve the instructor accompaniment indicator from the state', () => {
      expect(getInstructorAccompaniment(state)).toBe(false);
    });
  });

  describe('getSupervisorAccompaniment', () => {
    it('should retrieve the supervisor accompaniment indicator from the state', () => {
      expect(getSupervisorAccompaniment(state)).toBe(false);
    });
  });

  describe('getotherAccompaniment', () => {
    it('should retrieve the other accompaniment indicator from the state', () => {
      expect(getOtherAccompaniment(state)).toBe(true);
    });
  });

  describe('getInterpreterAccompaniment', () => {
    it('should retrieve the interpreter accompaniment indicator from the state', () => {
      expect(getInterpreterAccompaniment(state)).toBe(false);
    });
  });

});
