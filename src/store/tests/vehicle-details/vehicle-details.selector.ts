import { VehicleDetails } from '@dvsa/mes-test-schema/categories/common';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { isAnyOf } from '@shared/helpers/simplifiers';

export const getRegistrationNumber = (vehicleDetails: VehicleDetails) => vehicleDetails.registrationNumber;
export const getGearboxCategory = (vehicleDetails: VehicleDetails) => vehicleDetails.gearboxCategory;
export const isManual = (vehicleDetails: VehicleDetails) => vehicleDetails.gearboxCategory === 'Manual' || false;
export const isAutomatic = (vehicleDetails: VehicleDetails) => vehicleDetails.gearboxCategory === 'Automatic' || false;
export const showVrnButton = (category: TestCategory): boolean => isAnyOf(category, [
  TestCategory.ADI2,
  TestCategory.ADI3,
  TestCategory.B,
  TestCategory.C, TestCategory.C1, TestCategory.CE, TestCategory.C1E,
  TestCategory.CM, TestCategory.C1M, TestCategory.CEM, TestCategory.C1EM,
  TestCategory.DM, TestCategory.D1M, TestCategory.DEM, TestCategory.D1EM,
  TestCategory.D, TestCategory.D1, TestCategory.DE, TestCategory.D1E,
  TestCategory.EUAMM1, TestCategory.EUA1M1, TestCategory.EUA2M1, TestCategory.EUAM1,
  TestCategory.EUAMM2, TestCategory.EUA1M2, TestCategory.EUA2M2, TestCategory.EUAM2,
  TestCategory.CCPC, TestCategory.DCPC,
  TestCategory.F, TestCategory.G, TestCategory.H, TestCategory.K,
]);
