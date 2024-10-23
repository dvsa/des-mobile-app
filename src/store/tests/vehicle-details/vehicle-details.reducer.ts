import { VehicleDetails } from '@dvsa/mes-test-schema/categories/common';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import * as vehicleDetailsActions from './vehicle-details.actions';

const initialState: VehicleDetails = {
  registrationNumber: '',
};

export const vehicleDetailsReducer = createReducer(
  initialState,
  on(
    vehicleDetailsActions.VehicleRegistrationChanged,
    (state, { registrationNumber }): VehicleDetails => ({
      ...state,
      registrationNumber,
    })
  ),
  on(
    vehicleDetailsActions.MotStatusChanged,
    (state, { motStatus }): VehicleDetails => ({
      ...state,
      motStatus,
    })
  ),
  on(
    vehicleDetailsActions.MotEvidenceChanged,
    (state, { motEvidence }): VehicleDetails => ({
      ...state,
      motEvidence,
    })
  ),
  on(
    vehicleDetailsActions.MotEvidenceProvidedToggled,
    (state, { motEvidenceProvided }): VehicleDetails => ({
      ...state,
      motEvidenceProvided,
    })
  ),
  on(
    vehicleDetailsActions.VehicleMakeChanged,
    (state, { make }): VehicleDetails => ({
      ...state,
      make,
    })
  ),
  on(
    vehicleDetailsActions.VehicleModelChanged,
    (state, { model }): VehicleDetails => ({
      ...state,
      model,
    })
  ),
  on(
    vehicleDetailsActions.VehicleExpiryDateChanged,
    (state, { testExpiryDate }): VehicleDetails => ({
      ...state,
      testExpiryDate,
    })
  ),
  on(
    vehicleDetailsActions.ResetMOTDetails,
    (state): VehicleDetails => ({
      ...state,
      motStatus: undefined,
      motEvidence: undefined,
      motEvidenceProvided: undefined,
      make: undefined,
      model: undefined,
      testExpiryDate: undefined,
    })
  ),
  on(
    vehicleDetailsActions.MotEvidenceProvidedReset,
    (state): VehicleDetails => ({
      ...state,
      motEvidenceProvided: undefined,
    })
  ),
  on(vehicleDetailsActions.VRNListUpdated, (state, { vrn }) => ({
    ...state,
    previouslySearchedRegNumbers: state?.previouslySearchedRegNumbers?.includes(vrn)
      ? state.previouslySearchedRegNumbers
      : [...(state?.previouslySearchedRegNumbers || []), vrn],
  })),
  on(
    vehicleDetailsActions.GearboxCategoryChanged,
    (state, { gearboxCategory }): VehicleDetails => ({
      ...state,
      gearboxCategory,
    })
  ),
  on(
    vehicleDetailsActions.ClearGearboxCategory,
    (state): VehicleDetails => ({
      ...state,
      gearboxCategory: null,
    })
  )
);

export const getVehicleDetails = createFeatureSelector<VehicleDetails>('vehicleDetails');
