import { CatCMUniqueTypes } from '@dvsa/mes-test-schema/categories/CM';

export const getVehicleLength = (vehicleDetails: CatCMUniqueTypes.VehicleDetails) => vehicleDetails.vehicleLength;
export const getVehicleWidth = (vehicleDetails: CatCMUniqueTypes.VehicleDetails) => vehicleDetails.vehicleWidth;
export const getNumberOfSeats = (vehicleDetails: CatCMUniqueTypes.VehicleDetails) => vehicleDetails.numberOfSeats;
// export const getVehicleHeight = (vehicleDetails: CatCMUniqueTypes.VehicleDetails) => vehicleDetails.vehicleWidth;
