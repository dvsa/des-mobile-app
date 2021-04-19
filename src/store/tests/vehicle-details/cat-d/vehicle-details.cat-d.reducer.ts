import { CatDUniqueTypes } from '@dvsa/mes-test-schema/categories/D';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import * as vehicleDetailsActions from '../vehicle-details.actions';

const initialState: CatDUniqueTypes.VehicleDetails = {
  registrationNumber: '',
};

export const vehicleDetailsCatDReducer = createReducer(
  initialState,
  on(vehicleDetailsActions.VehicleRegistrationChanged, (state, { registrationNumber }) => ({
    ...state,
    registrationNumber,
  })),
  on(vehicleDetailsActions.GearboxCategoryChanged, (state, { gearboxCategory }) => ({
    ...state,
    gearboxCategory,
  })),
  on(vehicleDetailsActions.ClearGearboxCategory, (state) => ({
    ...state,
    gearboxCategory: null,
  })),
  on(vehicleDetailsActions.PopulateVehicleDimensions, (state, { vehicleWidth, vehicleLength }) => ({
    ...state,
    vehicleLength,
    vehicleWidth,
  })),
);

export const getVehicleDetails = createFeatureSelector<CatDUniqueTypes.VehicleDetails>('vehicleDetails');
