import { CatBEUniqueTypes } from '@dvsa/mes-test-schema/categories/BE';
import { vehicleChecksExist } from '../vehicle-checks.cat-be.selector';

describe('Vehicle Checks Selector Cat BE', () => {

  describe('vehicleChecksExist', () => {
    it('should return false if there are no vehicle checks entered', () => {
      const emptyVehicleChecks: CatBEUniqueTypes.VehicleChecks = { showMeQuestions: [{}], tellMeQuestions: [{}] };
      const result = vehicleChecksExist(emptyVehicleChecks);
      expect(result).toBeFalsy();
    });
    it('should return true if there are vehicle checks (showMeQuestions) entered', () => {
      const populatedVehicleChecks: CatBEUniqueTypes.VehicleChecks = {
        showMeQuestions: [{ code: 'S01', description: 'test s01', outcome: 'P' }],
        tellMeQuestions: [{}],
      };
      const result = vehicleChecksExist(populatedVehicleChecks);
      expect(result).toBeTruthy();
    });
    it('should return true if there are vehicle checks (tellMeQuestions) entered', () => {
      const populatedVehicleChecks: CatBEUniqueTypes.VehicleChecks = {
        showMeQuestions: [{}],
        tellMeQuestions: [{ code: 'T01', description: 'test T01', outcome: 'DF' }],
      };
      const result = vehicleChecksExist(populatedVehicleChecks);
      expect(result).toBeTruthy();
    });
    it('should return false if there are vehicle checks but no outcome selected', () => {
      const populatedVehicleChecks: CatBEUniqueTypes.VehicleChecks = {
        showMeQuestions: [{ code: 'S01', description: 'test s01', outcome: null }],
        tellMeQuestions: [{ code: 'T01', description: 'test T01', outcome: null }],
      };
      const result = vehicleChecksExist(populatedVehicleChecks);
      expect(result).toBeFalsy();
    });
  });
});
