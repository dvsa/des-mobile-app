import { VehicleDetails } from '@dvsa/mes-test-schema/categories/common';
import {
  getRegistrationNumber,
  getGearboxCategory,
} from '../vehicle-details.selector';

describe('vehicle details selector', () => {
  const state: VehicleDetails = {
    gearboxCategory: 'Manual',
    registrationNumber: '11AAA',
  };

  describe('getRegistrationNumber', () => {
    it('should retrieve the registration number from the vehicle details', () => {
      expect(getRegistrationNumber(state)).toBe('11AAA');
    });
  });

  describe('getGearboxCategory', () => {
    it('should retrieve the gearbox category from the vehicle details', () => {
      expect(getGearboxCategory(state)).toBe('Manual');
    });
  });
});
