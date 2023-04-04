import { createPopulateVehicleDimensionsAction } from '@store/tests/vehicle-details/vehicle-details.action.creator';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { Application } from '@dvsa/mes-journal-schema';

describe('createPopulateVehicleDimensionsAction', () => {
  [
    TestCategory.CM,
    TestCategory.C1M,
    TestCategory.CEM,
    TestCategory.C1EM,
    TestCategory.DM,
    TestCategory.D1M,
    TestCategory.DEM,
    TestCategory.D1EM,
  ].forEach((val) => {
    it(`should return PopulateManoeuvreVehicleDimensions if the category is ${val}`, () => {
      expect(createPopulateVehicleDimensionsAction(val, {
        vehicleWidth: 1,
        vehicleLength: 1,
        vehicleHeight: 1,
        vehicleSeats: 1,
      } as Application))
        .toEqual({
          vehicleWidth: 1,
          vehicleLength: 1,
          vehicleHeight: 1,
          numberOfSeats: 1,
          type: '[Vehicle Details] Populate Vehicle Dimensions',
        });
    });
  });
  it('should return PopulateVehicleDimensions if the switch defaults', () => {
    expect(createPopulateVehicleDimensionsAction(TestCategory.B, {
      vehicleWidth: 1,
      vehicleLength: 1,
    } as Application))
      .toEqual({
        vehicleWidth: 1,
        vehicleLength: 1,
        type: '[Vehicle Details] Populate Vehicle Dimensions',
      });
  });
});
