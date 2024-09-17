import { CatDUniqueTypes } from '@dvsa/mes-test-schema/categories/D';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import { VehicleDetails } from '@dvsa/mes-test-schema/categories/common';
import * as vehicleDetailsActions from '../vehicle-details.actions';

const initialState: CatDUniqueTypes.VehicleDetails = {
  registrationNumber: '',
};

export const vehicleDetailsCatDReducer = createReducer(
  initialState,
  on(
    vehicleDetailsActions.VehicleRegistrationChanged,
    (state, { registrationNumber }): CatDUniqueTypes.VehicleDetails => ({
      ...state,
      registrationNumber,
    })
  ),
  on(
    vehicleDetailsActions.MotStatusChanged,
    (state, { motStatus }): CatDUniqueTypes.VehicleDetails => ({
      ...state,
      motStatus,
    })
  ),
  on(
    vehicleDetailsActions.GearboxCategoryChanged,
    (state, { gearboxCategory }): CatDUniqueTypes.VehicleDetails => ({
      ...state,
      gearboxCategory,
    })
  ),
  on(
    vehicleDetailsActions.ClearGearboxCategory,
    (state): CatDUniqueTypes.VehicleDetails => ({
      ...state,
      gearboxCategory: null,
    })
  ),
  on(vehicleDetailsActions.PopulateVehicleDimensions, (state, { vehicleWidth, vehicleLength }) => ({
    ...state,
    vehicleLength,
    vehicleWidth,
  })),
  on(vehicleDetailsActions.MotEvidenceChanged, (state, { motEvidence }): VehicleDetails => ({
    ...state,
    motEvidence,
  })),
  on(vehicleDetailsActions.MotEvidenceProvidedToggled, (state, { motEvidenceProvided }): VehicleDetails => ({
    ...state,
    motEvidenceProvided,
  })),
);

export const getVehicleDetails = createFeatureSelector<CatDUniqueTypes.VehicleDetails>('vehicleDetails');
