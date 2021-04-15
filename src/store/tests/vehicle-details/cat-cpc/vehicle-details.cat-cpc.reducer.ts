import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import { VehicleDetails } from '@dvsa/mes-test-schema/categories/CPC';

import * as vehicleDetailsActions from '../vehicle-details.actions';

const initialState: VehicleDetails = {
  registrationNumber: null,
  gearboxCategory: null,
  configuration: null,
};

export const vehicleDetailsCatCPCReducer = createReducer(
  initialState,
  on(vehicleDetailsActions.VehicleRegistrationChanged, (state, { registrationNumber }): VehicleDetails => ({
    ...state,
    registrationNumber,
  })),
  on(vehicleDetailsActions.GearboxCategoryChanged, (state, { gearboxCategory }): VehicleDetails => ({
    ...state,
    gearboxCategory,
  })),
  on(vehicleDetailsActions.ClearGearboxCategory, (state): VehicleDetails => ({
    ...state,
    gearboxCategory: null,
  })),
  on(vehicleDetailsActions.PopulateVehicleConfiguration, (state, { configuration }): VehicleDetails => ({
    ...state,
    configuration,
  })),
);

export const getVehicleDetails = createFeatureSelector<VehicleDetails>('vehicleDetails');
