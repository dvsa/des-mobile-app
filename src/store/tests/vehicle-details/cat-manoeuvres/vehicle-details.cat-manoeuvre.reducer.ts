import { VehicleDetails } from '@dvsa/mes-test-schema/categories/common';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import { CatCMUniqueTypes } from '@dvsa/mes-test-schema/categories/CM';
import * as vehicleDetailsActions from '../vehicle-details.actions';

const initialState: CatCMUniqueTypes.VehicleDetails = {
  registrationNumber: '',
};

export const vehicleDetailsCatManoeuvreReducer = createReducer(
  initialState,
  on(vehicleDetailsActions.VehicleRegistrationChanged, (state, { registrationNumber }): VehicleDetails => ({
    ...state,
    registrationNumber,
  })),
);

export const getVehicleDetails = createFeatureSelector<CatCMUniqueTypes.VehicleDetails>('vehicleDetails');
