import { VehicleDetails } from '@dvsa/mes-test-schema/categories/common';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import * as vehicleDetailsActions from './vehicle-details.actions';

const initialState: VehicleDetails = {
  registrationNumber: '',
};

export const vehicleDetailsReducer = createReducer(
  initialState,
  on(vehicleDetailsActions.VehicleRegistrationChanged, (state, { payload }): VehicleDetails => ({
    ...state,
    registrationNumber: payload,
  })),
  on(vehicleDetailsActions.GearboxCategoryChanged, (state, { payload }): VehicleDetails => ({
    ...state,
    gearboxCategory: payload,
  })),
  on(vehicleDetailsActions.ClearGearboxCategory, (state): VehicleDetails => ({
    ...state,
    gearboxCategory: null,
  })),
);

export const getVehicleDetails = createFeatureSelector<VehicleDetails>('vehicleDetails');
