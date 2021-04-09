import { CatADI2UniqueTypes } from '@dvsa/mes-test-schema/categories/ADI2';
import {
  getVehicleChecksDangerous,
  getVehicleChecksSerious,
  vehicleChecksExist,
} from '../vehicle-checks.cat-adi-part2.selector';

describe('Vehicle Checks Selector Cat ADI2', () => {

  describe('getVehicleChecksSerious', () => {
    it('should return false if there are no serious vehicle checks recorded', ()  => {
      const emptySerious: CatADI2UniqueTypes.VehicleChecks = { seriousFault: false };
      const result = getVehicleChecksSerious(emptySerious);
      expect(result).toBe(false);
    });
    it('should return true if there are serious vehicle checks recorded', ()  => {
      const serious: CatADI2UniqueTypes.VehicleChecks = { seriousFault: true };
      const result = getVehicleChecksSerious(serious);
      expect(result).toBe(true);
    });
  });

  describe('getVehicleChecksDangerous', () => {
    it('should return false if there are no dangerous vehicle checks recorded', ()  => {
      const emptyDangerous: CatADI2UniqueTypes.VehicleChecks = { dangerousFault: false };
      const result = getVehicleChecksDangerous(emptyDangerous);
      expect(result).toBe(false);
    });
    it('should return true if there are dangerous vehicle checks recorded', ()  => {
      const dangerous: CatADI2UniqueTypes.VehicleChecks = { dangerousFault: true };
      const result = getVehicleChecksDangerous(dangerous);
      expect(result).toBe(true);
    });
  });

  describe('vehicleChecksExist', () => {
    it('should return false if there are no vehicle checks entered', ()  => {
      const emptyVehicleChecks: CatADI2UniqueTypes.VehicleChecks = { tellMeQuestions: [{}] };
      const result = vehicleChecksExist(emptyVehicleChecks);
      expect(result).toBeFalsy();
    });
    it('should return true if there are vehicle checks (tellMeQuestions) entered', ()  => {
      const populatedVehicleChecks: CatADI2UniqueTypes.VehicleChecks =
        {
          tellMeQuestions: [{ code: 'T01', description: 'test T01', outcome: 'DF' }],
        };
      const result = vehicleChecksExist(populatedVehicleChecks);
      expect(result).toBeTruthy();
    });
    it('should return false if there are vehicle checks but no outcome selected', ()  => {
      const populatedVehicleChecks: CatADI2UniqueTypes.VehicleChecks =
        {
          tellMeQuestions: [{ code: 'T01', description: 'test T01', outcome: null }],
        };
      const result = vehicleChecksExist(populatedVehicleChecks);
      expect(result).toBeFalsy();
    });
  });
});
