import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import { CatCMUniqueTypes } from '@dvsa/mes-test-schema/categories/CM';
import * as vehicleDetailsActions from '../vehicle-details.actions';
import * as manoeuvreVehicleDetailsActions from './vehicle-details.cat-manoeuvre.actions';

const initialState: CatCMUniqueTypes.VehicleDetails = {
  registrationNumber: '',
};

export const vehicleDetailsCatManoeuvreReducer = createReducer(
  initialState,
  on(vehicleDetailsActions.VehicleRegistrationChanged, (state, {
    registrationNumber,
  }): CatCMUniqueTypes.VehicleDetails => ({
    ...state,
    registrationNumber,
  })),
  on(vehicleDetailsActions.MotStatusChanged, (state, {
    motStatus,
  }): CatCMUniqueTypes.VehicleDetails => ({
    ...state,
    motStatus,
  })),
  on(manoeuvreVehicleDetailsActions.PopulateManoeuvreVehicleDimensions, (state, {
    vehicleWidth,
    vehicleLength,
    vehicleHeight,
    numberOfSeats,
  }): CatCMUniqueTypes.VehicleDetails => ({
    ...state,
    vehicleLength,
    vehicleWidth,
    vehicleHeight,
    numberOfSeats,
  })),
);

export const getVehicleDetails = createFeatureSelector<CatCMUniqueTypes.VehicleDetails>('vehicleDetails');
