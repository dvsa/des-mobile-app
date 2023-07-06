import { CatCUniqueTypes } from '@dvsa/mes-test-schema/categories/C';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import { VehicleDetails } from '@dvsa/mes-test-schema/categories/common';
import * as vehicleDetailsActions from '../vehicle-details.actions';

const initialState: CatCUniqueTypes.VehicleDetails = {
  registrationNumber: '',
};

export const vehicleDetailsCatCReducer = createReducer(
  initialState,
  on(
    vehicleDetailsActions.VehicleRegistrationChanged,
    (state, { registrationNumber }): CatCUniqueTypes.VehicleDetails => ({
      ...state,
      registrationNumber,
    })
  ),
  on(
    vehicleDetailsActions.MotStatusChanged,
    (state, { motStatus }): CatCUniqueTypes.VehicleDetails => ({
      ...state,
      motStatus,
    })
  ),
  on(
    vehicleDetailsActions.GearboxCategoryChanged,
    (state, { gearboxCategory }): CatCUniqueTypes.VehicleDetails => ({
      ...state,
      gearboxCategory,
    })
  ),
  on(
    vehicleDetailsActions.ClearGearboxCategory,
    (state): CatCUniqueTypes.VehicleDetails => ({
      ...state,
      gearboxCategory: null,
    })
  ),
  on(
    vehicleDetailsActions.PopulateVehicleDimensions,
    (state, { vehicleWidth, vehicleLength }): CatCUniqueTypes.VehicleDetails => ({
      ...state,
      vehicleLength,
      vehicleWidth,
    })
  ),
  on(vehicleDetailsActions.MotEvidenceChanged, (state, { motEvidence }): VehicleDetails => ({
    ...state,
    motEvidence,
  })),
  on(vehicleDetailsActions.MotEvidenceProvidedToggled, (state, { motEvidenceProvided }): VehicleDetails => ({
    ...state,
    motEvidenceProvided,
  })),
);

export const getVehicleDetails = createFeatureSelector<CatCUniqueTypes.VehicleDetails>('vehicleDetails');
