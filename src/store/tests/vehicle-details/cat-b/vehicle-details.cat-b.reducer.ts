import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import { CatBUniqueTypes } from '@dvsa/mes-test-schema/categories/B';
import { selectCurrentTest } from '@store/tests/tests.selector';
import * as vehicleDetailsActions from '../vehicle-details.actions';

const initialState: CatBUniqueTypes.VehicleDetails = {
  registrationNumber: '',
};

export const vehicleDetailsReducer = createReducer(
  initialState,
  on(vehicleDetailsActions.VehicleRegistrationChanged, (state, {
    registrationNumber,
  }): CatBUniqueTypes.VehicleDetails => ({
    ...state,
    registrationNumber,
  })),
  on(vehicleDetailsActions.MotStatusChanged, (state, {
    motStatus,
  }): CatBUniqueTypes.VehicleDetails => ({
    ...state,
    motStatus,
  })),
  on(vehicleDetailsActions.SchoolCarToggled, (state): CatBUniqueTypes.VehicleDetails => ({
    ...state,
    schoolCar: !state.schoolCar,
  })),
  on(vehicleDetailsActions.DualControlsToggled, (state): CatBUniqueTypes.VehicleDetails => ({
    ...state,
    dualControls: !state.dualControls,
  })),
  on(vehicleDetailsActions.GearboxCategoryChanged, (state, { gearboxCategory }): CatBUniqueTypes.VehicleDetails => ({
    ...state,
    gearboxCategory,
  })),
  on(vehicleDetailsActions.ClearGearboxCategory, (state): CatBUniqueTypes.VehicleDetails => ({
    ...state,
    gearboxCategory: null,
  })),
);

export const getVehicleDetails = createFeatureSelector<CatBUniqueTypes.VehicleDetails>('vehicleDetails');

export const selectVehicleDetails = createSelector(
  selectCurrentTest,
  (test) => test.vehicleDetails as CatBUniqueTypes.VehicleDetails,
);
