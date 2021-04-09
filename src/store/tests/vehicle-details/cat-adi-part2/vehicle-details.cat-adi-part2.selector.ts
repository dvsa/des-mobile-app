import { CatADI2UniqueTypes } from '@dvsa/mes-test-schema/categories/ADI2';

export const getSchoolCar = (vehicleDetails: CatADI2UniqueTypes.VehicleDetails) => vehicleDetails.schoolCar;
export const getDualControls = (vehicleDetails: CatADI2UniqueTypes.VehicleDetails) => vehicleDetails.dualControls;
