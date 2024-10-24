import { CatBUniqueTypes } from '@dvsa/mes-test-schema/categories/B';
import { VehicleDetails } from '@dvsa/mes-test-schema/categories/common';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import * as vehicleDetailsActions from '../vehicle-details.actions';

const initialState: CatBUniqueTypes.VehicleDetails = {
  registrationNumber: '',
};

export const vehicleDetailsReducer = createReducer(
  initialState,
  on(
    vehicleDetailsActions.VehicleRegistrationChanged,
    (state, { registrationNumber }): CatBUniqueTypes.VehicleDetails => ({
      ...state,
      registrationNumber,
    })
  ),
  on(
    vehicleDetailsActions.MotStatusChanged,
    (state, { motStatus }): CatBUniqueTypes.VehicleDetails => ({
      ...state,
      motStatus,
    })
  ),
  on(
    vehicleDetailsActions.SchoolCarToggled,
    (state): CatBUniqueTypes.VehicleDetails => ({
      ...state,
      schoolCar: !state.schoolCar,
    })
  ),
  on(
    vehicleDetailsActions.DualControlsToggled,
    (state): CatBUniqueTypes.VehicleDetails => ({
      ...state,
      dualControls: !state.dualControls,
    })
  ),
  on(
    vehicleDetailsActions.GearboxCategoryChanged,
    (state, { gearboxCategory }): CatBUniqueTypes.VehicleDetails => ({
      ...state,
      gearboxCategory,
    })
  ),
  on(
    vehicleDetailsActions.ClearGearboxCategory,
    (state): CatBUniqueTypes.VehicleDetails => ({
      ...state,
      gearboxCategory: null,
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
  }))
);

export const getVehicleDetails = createFeatureSelector<VehicleDetails>('vehicleDetails');
