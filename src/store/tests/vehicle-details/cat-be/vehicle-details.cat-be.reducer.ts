import { CatBEUniqueTypes } from '@dvsa/mes-test-schema/categories/BE';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import * as vehicleDetailsActions from '../vehicle-details.actions';

const initialState: CatBEUniqueTypes.VehicleDetails = {
  registrationNumber: '',
};

export const vehicleDetailsCatBEReducer = createReducer(
  initialState,
  on(vehicleDetailsActions.VehicleRegistrationChanged, (state, {
    registrationNumber,
  }): CatBEUniqueTypes.VehicleDetails => ({
    ...state,
    registrationNumber,
  })),
  on(vehicleDetailsActions.SchoolCarToggled, (state): CatBEUniqueTypes.VehicleDetails => ({
    ...state,
    schoolCar: !state.schoolCar,
  })),
  on(vehicleDetailsActions.DualControlsToggled, (state): CatBEUniqueTypes.VehicleDetails => ({
    ...state,
    dualControls: !state.dualControls,
  })),
  on(vehicleDetailsActions.GearboxCategoryChanged, (state, {
    gearboxCategory,
  }): CatBEUniqueTypes.VehicleDetails => ({
    ...state,
    gearboxCategory,
  })),
  on(vehicleDetailsActions.ClearGearboxCategory, (state): CatBEUniqueTypes.VehicleDetails => ({
    ...state,
    gearboxCategory: null,
  })),
  on(vehicleDetailsActions.PopulateVehicleDimensions, (state, {
    vehicleWidth,
    vehicleLength,
  }): CatBEUniqueTypes.VehicleDetails => ({
    ...state,
    vehicleLength,
    vehicleWidth,
  })),
);

export const getVehicleDetails = createFeatureSelector<CatBEUniqueTypes.VehicleDetails>('vehicleDetails');
