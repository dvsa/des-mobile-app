import { VehicleDetails } from '@dvsa/mes-test-schema/categories/common';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import { CatBUniqueTypes } from '@dvsa/mes-test-schema/categories/B';
import { uniq } from 'lodash';
import * as vehicleDetailsActions from '../vehicle-details.actions';

const initialState: CatBUniqueTypes.VehicleDetails = {
  registrationNumber: '',
  motStatus: null,
  motEvidence: null,
  motEvidenceProvided: null,
  make: null,
  model: null,
  testExpiryDate: null,
  previouslySearchedRegNumbers: [],
};

export const vehicleDetailsReducer = createReducer(
  initialState,
  on(vehicleDetailsActions.VehicleRegistrationChanged, (state, {
    registrationNumber,
  }): CatBUniqueTypes.VehicleDetails => ({
    ...state,
    registrationNumber,
  })),
  on(vehicleDetailsActions.MotDataChanged, (state, {
    status,
    make,
    model,
    testExpiryDate,
  }): CatBUniqueTypes.VehicleDetails => ({
    ...state,
    motStatus: status,
    make,
    model,
    testExpiryDate,
  })),
  on(vehicleDetailsActions.ClearMotData, (state): CatBUniqueTypes.VehicleDetails => ({
    ...state,
    motStatus: null,
    make: null,
    model: null,
    testExpiryDate: null,
    motEvidence: null,
    motEvidenceProvided: null,
  })),
  on(vehicleDetailsActions.PreviouslySearchedRegChanged, (state, { reg }) => ({
    ...state,
    previouslySearchedRegNumbers: uniq([
      ...(state?.previouslySearchedRegNumbers || []),
      reg,
    ]),
  })),
  on(vehicleDetailsActions.AlternativeMotEvidenceDetailsChanged, (state, {
    evidence,
  }): CatBUniqueTypes.VehicleDetails => ({
    ...state,
    motEvidence: evidence,
  })),
  on(vehicleDetailsActions.AlternativeMotEvidenceProvidedChanged, (
    state, { evidenceProvided },
  ): CatBUniqueTypes.VehicleDetails => ({
    ...state,
    motEvidenceProvided: evidenceProvided,
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

export const getVehicleDetails = createFeatureSelector<VehicleDetails>('vehicleDetails');
