import { VehicleDetails } from '@dvsa/mes-test-schema/categories/CPC';

export const getVehicleConfiguration = (vehicleDetails: VehicleDetails) => vehicleDetails.configuration;
