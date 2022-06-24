import { VehicleDetails } from '@dvsa/mes-test-schema/categories/ADI3';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import * as vehicleDetailsActions from '../vehicle-details.actions';

const initialState: VehicleDetails = {
  registrationNumber: '',
};

export const vehicleDetailsCatADIPart3Reducer = createReducer(
  initialState,
  on(vehicleDetailsActions.VehicleRegistrationChanged, (state, { registrationNumber }): VehicleDetails => ({
    ...state,
    registrationNumber,
  })),
  on(vehicleDetailsActions.DualControlsToggled, (state): VehicleDetails => ({
    ...state,
    dualControls: !state.dualControls,
  })),
  on(vehicleDetailsActions.GearboxCategoryChanged, (state, { gearboxCategory }): VehicleDetails => ({
    ...state,
    gearboxCategory,
  })),
  on(vehicleDetailsActions.ClearGearboxCategory, (state): VehicleDetails => ({
    ...state,
    gearboxCategory: null,
  })),
);

export const getVehicleDetails = createFeatureSelector<VehicleDetails>('vehicleDetails');
