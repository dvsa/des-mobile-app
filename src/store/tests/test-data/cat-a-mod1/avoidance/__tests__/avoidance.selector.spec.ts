
import { getAvoidance, getAvoidanceAttempted } from '../avoidance.selector';
import { TestData, Avoidance } from '@dvsa/mes-test-schema/categories/AM1';

describe('emergency stop selector', () => {
  describe('getEmergencyStop', () => {
    it('should return emergencyStop from testData', () => {
      const testData: TestData = {
        avoidance: {
          firstAttempt: 44,
          secondAttempt: 50,
        } as Avoidance,
      };

      const result = getAvoidance(testData);

      expect(result).toBe(testData.avoidance);
    });
  });

  describe('getAvoidanceAttempted', () => {
    it('should return false when first and second attempted are not set', () => {
      const testData: TestData = {
        avoidance: {
        } as Avoidance,
      };

      const result = getAvoidanceAttempted(testData.avoidance);

      expect(result).toBe(false);
    });

    it('should return true when first attempt is set but second attempted is not', () => {
      const testData: TestData = {
        avoidance: {
          firstAttempt: 54,
        } as Avoidance,
      };

      const result = getAvoidanceAttempted(testData.avoidance);

      expect(result).toBe(true);
    });

    it('should return true when first and second attempted is set', () => {
      const testData: TestData = {
        avoidance: {
          firstAttempt: 45,
          secondAttempt: 51,
        } as Avoidance,
      };

      const result = getAvoidanceAttempted(testData.avoidance);

      expect(result).toBe(true);
    });
  });
});
