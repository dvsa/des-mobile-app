import { CatCMUniqueTypes } from '@dvsa/mes-test-schema/categories/CM';
import { VehicleDetails } from '@dvsa/mes-test-schema/categories/common';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import * as vehicleDetailsActions from '../vehicle-details.actions';
import * as manoeuvreVehicleDetailsActions from './vehicle-details.cat-manoeuvre.actions';

const initialState: CatCMUniqueTypes.VehicleDetails = {
  registrationNumber: '',
};

export const vehicleDetailsCatManoeuvreReducer = createReducer(
  initialState,
  on(
    vehicleDetailsActions.VehicleRegistrationChanged,
    (state, { registrationNumber }): CatCMUniqueTypes.VehicleDetails => ({
      ...state,
      registrationNumber,
    })
  ),
  on(
    vehicleDetailsActions.MotStatusChanged,
    (state, { motStatus }): CatCMUniqueTypes.VehicleDetails => ({
      ...state,
      motStatus,
    })
  ),
  on(
    manoeuvreVehicleDetailsActions.PopulateManoeuvreVehicleDimensions,
    (state, { vehicleWidth, vehicleLength, vehicleHeight, numberOfSeats }): CatCMUniqueTypes.VehicleDetails => ({
      ...state,
      vehicleLength,
      vehicleWidth,
      vehicleHeight,
      numberOfSeats,
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
    previouslySearchedRegNumbers: [...(state?.previouslySearchedRegNumbers || []), vrn],
  }))
);

export const getVehicleDetails = createFeatureSelector<CatCMUniqueTypes.VehicleDetails>('vehicleDetails');
