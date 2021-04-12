import { CatCUniqueTypes } from '@dvsa/mes-test-schema/categories/C';

export const getVehicleLength = (vehicleDetails: CatCUniqueTypes.VehicleDetails) => vehicleDetails.vehicleLength;
export const getVehicleWidth = (vehicleDetails: CatCUniqueTypes.VehicleDetails) => vehicleDetails.vehicleWidth;
