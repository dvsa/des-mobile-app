import { VehicleDetails } from '@dvsa/mes-test-schema/categories/common';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { isAnyOf } from '@shared/helpers/simplifiers';

export const getRegistrationNumber = (vehicleDetails: VehicleDetails) => vehicleDetails.registrationNumber;
export const getGearboxCategory = (vehicleDetails: VehicleDetails) => vehicleDetails.gearboxCategory;
export const isManual = (vehicleDetails: VehicleDetails) => vehicleDetails.gearboxCategory === 'Manual' || false;
export const isAutomatic = (vehicleDetails: VehicleDetails) => vehicleDetails.gearboxCategory === 'Automatic' || false;
export const showVrnButton = (category: TestCategory): boolean => isAnyOf(category, [
  TestCategory.B,
  TestCategory.C, TestCategory.C1, TestCategory.CE, TestCategory.C1E,
  TestCategory.CM, TestCategory.C1M, TestCategory.CEM, TestCategory.C1EM,
  TestCategory.DM, TestCategory.D1M, TestCategory.DEM, TestCategory.D1EM,
  TestCategory.D, TestCategory.D1, TestCategory.DE, TestCategory.D1E,
]);
