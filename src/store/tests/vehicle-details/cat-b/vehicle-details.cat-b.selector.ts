import { CatBUniqueTypes } from '@dvsa/mes-test-schema/categories/B';

export const getSchoolCar = (vehicleDetails: CatBUniqueTypes.VehicleDetails) => vehicleDetails.schoolCar;
export const getDualControls = (vehicleDetails: CatBUniqueTypes.VehicleDetails) => vehicleDetails.dualControls;
