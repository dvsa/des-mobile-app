import { Configuration } from '@dvsa/mes-test-schema/categories/CPC';
import { GearboxCategory } from '@dvsa/mes-test-schema/categories/common';
import { createAction } from '@ngrx/store';
import {
  ModalEvent
} from '@pages/waiting-room-to-car/components/mot-components/mot-failed-modal/mot-failed-modal.component';
import {MOTAbortedMethod} from '@pages/waiting-room-to-car/components/vehicle-registration/vehicle-registration';

export const VehicleRegistrationChanged = createAction(
  '[Vehicle Details] Registration changed',
  (registrationNumber: string) => ({ registrationNumber })
);

export const MotFailedModalOpened = createAction('[Vehicle Details] Mot failed modal opened');

export const MotStatusChanged = createAction('[Vehicle Details] Mot status changed', (motStatus: string) => ({
  motStatus,
}));

export const MotFailedModalOutcome = createAction('[Vehicle Details] Mot failed modal outcome', (modalEvent: ModalEvent) => ({
  modalEvent,
}));

export const MotSearchButtonPressed = createAction('[Vehicle Details] Mot search button pressed');

export const MotNoEvidenceBannerCancelled = createAction('[Vehicle Details] Mot no evidence banner cancelled');

export const InvalidMotTerminate = createAction('[Vehicle Details] Invalid mot terminate');

export const MotCallAborted = createAction('[Vehicle Details] Mot call aborted', (method: MOTAbortedMethod) => ({
  method,
}));

export const MotEvidenceChanged = createAction('[Vehicle Details] Mot evidence changed', (motEvidence: string) => ({
  motEvidence,
}));

export const MotEvidenceProvidedToggled = createAction(
  '[Vehicle Details] Mot evidence provided toggled',
  (motEvidenceProvided: boolean) => ({ motEvidenceProvided })
);

export const MotFailedModalValidationError = createAction('[Vehicle Details] Invalid mot modal validation error');

export const MotEvidenceProvidedReset = createAction('[Vehicle Details] Mot evidence provided reset');

export const VehicleMakeChanged = createAction('[Vehicle Details] Vehicle make changed', (make: string) => ({ make }));

export const VehicleModelChanged = createAction('[Vehicle Details] Vehicle model changed', (model: string) => ({
  model,
}));
export const VehicleExpiryDateChanged = createAction(
  '[Vehicle Details] Vehicle expiry date changed',
  (testExpiryDate: string) => ({ testExpiryDate })
);
export const VRNListUpdated = createAction('[Vehicle Details] Searched VRN list updated', (vrn: string) => ({ vrn }));

export const SchoolCarToggled = createAction('[Vehicle Details] School car toggled');

export const SchoolBikeToggled = createAction('[Vehicle Details] School bike toggled');

export const DualControlsToggled = createAction('[Vehicle Details] Dual controls toggled');

export const DualControlsToggledYes = createAction('[Vehicle Details] Dual controls yes selected');

export const DualControlsToggledNo = createAction('[Vehicle Details] Dual controls no selected');

export const GearboxCategoryChanged = createAction(
  '[Vehicle Details] Gearbox category changed',
  (gearboxCategory: GearboxCategory) => ({ gearboxCategory })
);

export const ClearGearboxCategory = createAction('[Vehicle Details] Clear gearbox category');

export const PopulateVehicleDimensions = createAction(
  '[Vehicle Details] Populate Vehicle Dimensions',
  (vehicleWidth: number, vehicleLength: number) => ({ vehicleWidth, vehicleLength })
);

export const PopulateVehicleConfiguration = createAction(
  '[Vehicle Details] Populate Vehicle Configuration',
  (configuration: Configuration) => ({ configuration })
);
