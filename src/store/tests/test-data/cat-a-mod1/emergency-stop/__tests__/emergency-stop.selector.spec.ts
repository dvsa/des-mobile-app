
import { getEmergencyStop } from '../emergency-stop.selector';
import { TestData } from '@dvsa/mes-test-schema/categories/AM1';

describe('emergency stop selector', () => {
  describe('getEmergencyStop', () => {
    it('should return emergencyStop from testData', () => {
      const testData: TestData = {
        emergencyStop: {
          firstAttempt: 44,
          secondAttempt: 50,
        },
      };

      const result = getEmergencyStop(testData);

      expect(result).toBe(testData.emergencyStop);
    });
  });
});
