import { CatDUniqueTypes } from '@dvsa/mes-test-schema/categories/D';

export const getVehicleLength = (vehicleDetails: CatDUniqueTypes.VehicleDetails) => vehicleDetails.vehicleLength;
export const getVehicleWidth = (vehicleDetails: CatDUniqueTypes.VehicleDetails) => vehicleDetails.vehicleWidth;
