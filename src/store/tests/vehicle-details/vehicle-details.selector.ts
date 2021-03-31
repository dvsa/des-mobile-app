import { VehicleDetails } from '@dvsa/mes-test-schema/categories/common';

export const getRegistrationNumber = (vehicleDetails: VehicleDetails) => vehicleDetails.registrationNumber;
export const getGearboxCategory = (vehicleDetails: VehicleDetails) => vehicleDetails.gearboxCategory;
export const isManual = (vehicleDetails: VehicleDetails) => vehicleDetails.gearboxCategory === 'Manual' || false;
export const isAutomatic = (vehicleDetails: VehicleDetails) => vehicleDetails.gearboxCategory === 'Automatic' || false;
