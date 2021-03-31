import { CatADI2UniqueTypes } from '@dvsa/mes-test-schema/categories/ADI2';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import * as vehicleDetailsActions from '../vehicle-details.actions';

const initialState: CatADI2UniqueTypes.VehicleDetails = {
  registrationNumber: '',
};

export const vehicleDetailsCatADIPart2Reducer = createReducer(
  initialState,
  on(vehicleDetailsActions.VehicleRegistrationChanged, (state, { payload }): CatADI2UniqueTypes.VehicleDetails => ({
    ...state,
    registrationNumber: payload,
  })),
  on(vehicleDetailsActions.SchoolCarToggled, (state): CatADI2UniqueTypes.VehicleDetails => ({
    ...state,
    schoolCar: !state.schoolCar,
  })),
  on(vehicleDetailsActions.DualControlsToggled, (state): CatADI2UniqueTypes.VehicleDetails => ({
    ...state,
    dualControls: !state.dualControls,
  })),
  on(vehicleDetailsActions.GearboxCategoryChanged, (state, { payload }): CatADI2UniqueTypes.VehicleDetails => ({
    ...state,
    gearboxCategory: payload,
  })),
  on(vehicleDetailsActions.ClearGearboxCategory, (state): CatADI2UniqueTypes.VehicleDetails => ({
    ...state,
    gearboxCategory: null,
  })),
);

export const getVehicleDetails = createFeatureSelector<CatADI2UniqueTypes.VehicleDetails>('vehicleDetails');
