import { CatBUniqueTypes } from '@dvsa/mes-test-schema/categories/B';
import {
  getRegistrationNumber,
  getGearboxCategory,
} from '../../vehicle-details.selector';

import {
  getSchoolCar,
  getDualControls,
} from '../vehicle-details.cat-b.selector';

describe('vehicle details selector', () => {
  const state: CatBUniqueTypes.VehicleDetails = {
    dualControls: true,
    gearboxCategory: 'Manual',
    registrationNumber: '11AAA',
    schoolCar: false,
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

  describe('getSchoolCar', () => {
    it('should retrieve the school car indicator from the vehicle details', () => {
      expect(getSchoolCar(state)).toBe(false);
    });
  });

  describe('getDualControls', () => {
    it('should retrieve the dual controls indicator from the vehicle details', () => {
      expect(getDualControls(state)).toBe(true);
    });
  });
});
