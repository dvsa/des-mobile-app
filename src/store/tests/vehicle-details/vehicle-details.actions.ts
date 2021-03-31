import { createAction, props } from '@ngrx/store';
import { GearboxCategory } from '@dvsa/mes-test-schema/categories/common';
import { Configuration } from '@dvsa/mes-test-schema/categories/CPC';

export const VehicleRegistrationChanged = createAction(
  '[Vehicle Details] Registration changed',
  props<{ payload: string }>(),
);

export const SchoolCarToggled = createAction(
  '[Vehicle Details] School car toggled',
);

export const SchoolBikeToggled = createAction(
  '[Vehicle Details] School bike toggled',
);

export const DualControlsToggled = createAction(
  '[Vehicle Details] Dual controls toggled',
);

export const GearboxCategoryChanged = createAction(
  '[Vehicle Details] Gearbox category changed',
  props<{ payload: GearboxCategory }>(),
);

export const ClearGearboxCategory = createAction(
  '[Vehicle Details] Clear gearbox category',
);

export const PopulateVehicleDimensions = createAction(
  '[Vehicle Details] Populate Vehicle Dimensions',
  props<{ vehicleWidth: number, vehicleLength: number }>(),
);

export const PopulateVehicleConfiguration = createAction(
  '[Vehicle Details] Populate Vehicle Configuration',
  props<{ payload: Configuration }>(),
);
