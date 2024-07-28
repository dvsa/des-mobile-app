import { Application } from '@dvsa/mes-journal-schema';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { PopulateManoeuvreVehicleDimensions } from '@store/tests/vehicle-details/cat-manoeuvres/vehicle-details.cat-manoeuvre.actions';
import { PopulateVehicleDimensions } from '@store/tests/vehicle-details/vehicle-details.actions';

type VehicleDimensionsUnion =
	| ReturnType<typeof PopulateManoeuvreVehicleDimensions>
	| ReturnType<typeof PopulateVehicleDimensions>;

export const createPopulateVehicleDimensionsAction = (
	testCategory: string,
	application: Application
): VehicleDimensionsUnion => {
	switch (testCategory) {
		case TestCategory.CM:
		case TestCategory.C1M:
		case TestCategory.CEM:
		case TestCategory.C1EM:
		case TestCategory.DM:
		case TestCategory.D1M:
		case TestCategory.DEM:
		case TestCategory.D1EM:
			return PopulateManoeuvreVehicleDimensions(
				application.vehicleWidth,
				application.vehicleLength,
				application.vehicleHeight,
				application.vehicleSeats
			);
		default:
			return PopulateVehicleDimensions(application.vehicleWidth, application.vehicleLength);
	}
};
