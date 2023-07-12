import { createAction } from '@ngrx/store';
import { GearboxCategory } from '@dvsa/mes-test-schema/categories/common';
import { Configuration } from '@dvsa/mes-test-schema/categories/CPC';
import { MotDetails } from '@providers/vehicle-details-api/vehicle-details-api.model';

export const VehicleRegistrationChanged = createAction(
  '[Vehicle Details] Registration changed',
  (registrationNumber: string) => ({ registrationNumber }),
);

export const MotStatusChanged = createAction(
  '[Vehicle Details] Mot status changed',
  (motStatus: string) => ({ motStatus }),
);

export const AlternativeMotEvidenceProvidedChanged = createAction(
  '[Vehicle Details] Alternative evidence provided changed',
  (evidenceProvided: boolean) => ({ evidenceProvided }),
);

export const MotDataChanged = createAction(
  '[Vehicle Details] Mot data changed',
  (motDetails: MotDetails) => ({ ...motDetails }),
);

export const ClearMotData = createAction(
  '[Vehicle Details] Clear mot data',
);

export const AlternativeMotEvidenceDetailsChanged = createAction(
  '[Vehicle Details] Mot evidence changed',
  (evidence: string) => ({ evidence }),
);

export const PreviouslySearchedRegChanged = createAction(
  '[Vehicle Details] Previously searched for reg changed',
  (reg: string) => ({ reg }),
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

export const DualControlsToggledYes = createAction(
  '[Vehicle Details] Dual controls yes selected',
);

export const DualControlsToggledNo = createAction(
  '[Vehicle Details] Dual controls no selected',
);

export const GearboxCategoryChanged = createAction(
  '[Vehicle Details] Gearbox category changed',
  (gearboxCategory: GearboxCategory) => ({ gearboxCategory }),
);

export const ClearGearboxCategory = createAction(
  '[Vehicle Details] Clear gearbox category',
);

export const PopulateVehicleDimensions = createAction(
  '[Vehicle Details] Populate Vehicle Dimensions',
  (vehicleWidth: number, vehicleLength: number) => ({
    vehicleWidth,
    vehicleLength,
  }),
);

export const PopulateVehicleConfiguration = createAction(
  '[Vehicle Details] Populate Vehicle Configuration',
  (configuration: Configuration) => ({ configuration }),
);
