import { EmergencyStop, TestData } from '@dvsa/mes-test-schema/categories/AM1';

export const getEmergencyStop = (testData: TestData): EmergencyStop => {
  return testData.emergencyStop;
};
