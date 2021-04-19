import { CatDUniqueTypes } from '@dvsa/mes-test-schema/categories/D';
import { getVehicleLength, getVehicleWidth } from '../vehicle-details.cat-d.selector';

describe('vehicle details CAT D selector', () => {
  const state: CatDUniqueTypes.VehicleDetails = {
    vehicleLength: 10,
    vehicleWidth: 3.5,
  };

  describe('getVehicleLength', () => {
    it('should retrieve vehicle length from the vehicle details', () => {
      expect(getVehicleLength(state)).toBe(10);
    });
  });

  describe('getVehicleWidth', () => {
    it('should retrieve the vehicle width from the vehicle details', () => {
      expect(getVehicleWidth(state)).toBe(3.5);
    });
  });
});
