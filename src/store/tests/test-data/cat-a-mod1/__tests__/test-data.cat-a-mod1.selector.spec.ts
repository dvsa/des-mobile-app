import { TestData } from '@dvsa/mes-test-schema/categories/AM1';
import {
  hasSeriousFault,
  hasDangerousFault,
  getETAFaultText,
} from '../../common/test-data.selector';
import {
  getDrivingFaultCount,
} from '../test-data.cat-a-mod1.selector';
import { Competencies } from '../../test-data.constants';

describe('TestDataSelectors', () => {
  const state: TestData = {
    drivingFaults: {
      precautions: 1,
    },
    seriousFaults: {
      precautions: true,
    },
    dangerousFaults: {
      precautions: true,
    },
    ETA: {
      physical: false,
      verbal: false,
    },
  };

  describe('getDrivingFaultCount', () => {
    it('should return the driving fault count', () => {
      expect(getDrivingFaultCount(state, Competencies.precautions)).toBe(1);
    });
    it('should return undefined when there hasnt been any driving faults', () => {
      expect(getDrivingFaultCount(state, Competencies.moveOffSafety)).toBeUndefined();
    });
  });

  describe('hasSeriousFault', () => {
    it('should return true if a competency has a serious fault', () => {
      expect(hasSeriousFault(state, Competencies.precautions)).toEqual(true);
    });
    it('should return false if a competency does not have a serious fault', () => {
      expect(hasSeriousFault(state, Competencies.moveOffSafety)).toBeFalsy();
    });
  });

  describe('hasDangerousFault', () => {
    it('should return true if a competency has a dangerous fault', () => {
      expect(hasDangerousFault(state, Competencies.precautions)).toEqual(true);
    });
    it('should return false if a competency does not have a dangerous fault', () => {
      expect(hasDangerousFault(state, Competencies.moveOffSafety)).toBeFalsy();
    });
  });

  describe('getETAFaultText', () => {
    it('should return null if no ETA faults', () => {
      const result = getETAFaultText(state.ETA);
      expect(result).toBeUndefined();
    });
    it('should return `Physical and Verbal` if both ETA faults', () => {
      state.ETA.physical = true;
      state.ETA.verbal = true;
      const result = getETAFaultText(state.ETA);
      expect(result).toEqual('Physical and Verbal');
    });
    it('should return `Physical` if just physical ETA fault', () => {
      state.ETA.physical = true;
      state.ETA.verbal = false;
      const result = getETAFaultText(state.ETA);
      expect(result).toEqual('Physical');
    });
    it('should return `Verbal` if just verbal ETA fault', () => {
      state.ETA.physical = false;
      state.ETA.verbal = true;
      const result = getETAFaultText(state.ETA);
      expect(result).toEqual('Verbal');
    });
  });
});
