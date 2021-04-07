import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { VehicleDetailsByCategoryProvider } from '../vehicle-details-by-category';
// import { getVehicleDetails } from '../../../modules/tests/vehicle-details/cat-c/vehicle-details.cat-c.reducer';
// import {
//   getVehicleLength,
//   getVehicleWidth,
// } from '../../../modules/tests/vehicle-details/cat-c/vehicle-details.cat-c.selector';

describe('VehicleDetailsByCategoryProvider', () => {
  let provider: VehicleDetailsByCategoryProvider;

  beforeEach(() => {
    provider = new VehicleDetailsByCategoryProvider();
  });

  describe('getVehicleDetailsByCategoryCode', () => {
    // it('should return Cat C vehicle details for a C category code', () => {
    //   expect(() => {
    //     const vehicleData = provider.getVehicleDetailsByCategoryCode(TestCategory.C);
    //     expect(vehicleData).toEqual({
    //       vehicleDetails: getVehicleDetails,
    //       vehicleLength: getVehicleLength,
    //       vehicleWidth: getVehicleWidth,
    //     });
    //   }).not.toThrowError('Error getting test category vehicle details');
    // });
    it('should throw an error when there is no matching test category', () => {
      expect(() => {
        provider.getVehicleDetailsByCategoryCode('z' as TestCategory);
      }).toThrowError('Error getting test category vehicle details');
    });
    it('should throw an error when test category is undefined', () => {
      expect(() => {
        provider.getVehicleDetailsByCategoryCode(undefined);
      }).toThrowError('Error getting test category vehicle details');
    });
  });
});
