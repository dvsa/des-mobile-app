import { VehicleDetails } from '@dvsa/mes-test-schema/categories/AM2';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import * as vehicleDetailsActions from '../vehicle-details.actions';

const initialState: VehicleDetails = {
  registrationNumber: '',
};

export const vehicleDetailsCatAMod2Reducer = createReducer(
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
  ),
  on(
    vehicleDetailsActions.SchoolBikeToggled,
    (state): VehicleDetails => ({
      ...state,
      schoolBike: !state.schoolBike,
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
  on(vehicleDetailsActions.VRNListUpdated, (state, { vrn }) => ({
    ...state,
    previouslySearchedRegNumbers: [...(state?.previouslySearchedRegNumbers || []), vrn],
  }))
);

export const getVehicleDetails = createFeatureSelector<VehicleDetails>('vehicleDetails');
