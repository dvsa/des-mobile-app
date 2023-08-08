import { CatBUniqueTypes } from '@dvsa/mes-test-schema/categories/B';
import { createSelector } from '@ngrx/store';
import { selectVehicleDetails } from '@store/tests/vehicle-details/cat-b/vehicle-details.cat-b.reducer';

export const getSchoolCar = (vehicleDetails: CatBUniqueTypes.VehicleDetails) => vehicleDetails.schoolCar;
export const selectSchoolCar = createSelector(
  selectVehicleDetails,
  ({ schoolCar }) => schoolCar,
);
export const getDualControls = (vehicleDetails: CatBUniqueTypes.VehicleDetails) => vehicleDetails.dualControls;
export const selectDualControls = createSelector(
  selectVehicleDetails,
  ({ dualControls }) => dualControls,
);
