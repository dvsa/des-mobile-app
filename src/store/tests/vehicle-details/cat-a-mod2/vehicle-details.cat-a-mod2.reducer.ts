import { VehicleDetails } from '@dvsa/mes-test-schema/categories/AM2';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import * as vehicleDetailsActions from '../vehicle-details.actions';
import * as vehicleDetailsCatAMod2Actions from './vehicle-details.cat-a-mod2.actions';

const initialState: VehicleDetails = {
  registrationNumber: '',
};

export const vehicleDetailsCatAMod2Reducer = createReducer(
  initialState,
  on(vehicleDetailsActions.VehicleRegistrationChanged, (state, {
    registrationNumber,
  }): VehicleDetails => ({
    ...state,
    registrationNumber,
  })),
  on(vehicleDetailsActions.GearboxCategoryChanged, (state, {
    gearboxCategory,
  }): VehicleDetails => ({
    ...state,
    gearboxCategory,
  })),
  on(vehicleDetailsActions.ClearGearboxCategory, (state): VehicleDetails => ({
    ...state,
    gearboxCategory: null,
  })),
  on(vehicleDetailsCatAMod2Actions.SchoolBikeToggled, (state): VehicleDetails => ({
    ...state,
    schoolBike: !state.schoolBike,
  })),
);

export const getVehicleDetails = createFeatureSelector<VehicleDetails>('vehicleDetails');
