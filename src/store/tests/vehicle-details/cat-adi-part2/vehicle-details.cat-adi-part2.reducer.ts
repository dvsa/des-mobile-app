import { CatADI2UniqueTypes } from '@dvsa/mes-test-schema/categories/ADI2';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import { uniq } from 'lodash';
import * as vehicleDetailsActions from '../vehicle-details.actions';

export const initialState: CatADI2UniqueTypes.VehicleDetails = {
  registrationNumber: '',
  motStatus: null,
  motEvidence: null,
  motEvidenceProvided: null,
  make: null,
  model: null,
  testExpiryDate: null,
  previouslySearchedRegNumbers: [],
};

export const vehicleDetailsCatADIPart2Reducer = createReducer(
  initialState,
  on(vehicleDetailsActions.VehicleRegistrationChanged, (state, {
    registrationNumber,
  }): CatADI2UniqueTypes.VehicleDetails => ({
    ...state,
    registrationNumber,
  })),
  on(vehicleDetailsActions.MotDataChanged, (state, {
    status,
    make,
    model,
    testExpiryDate,
  }): CatADI2UniqueTypes.VehicleDetails => ({
    ...state,
    motStatus: status,
    make,
    model,
    testExpiryDate,
  })),
  on(vehicleDetailsActions.ClearMotData, (state): CatADI2UniqueTypes.VehicleDetails => ({
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
  }): CatADI2UniqueTypes.VehicleDetails => ({
    ...state,
    motEvidence: evidence,
  })),
  on(vehicleDetailsActions.AlternativeMotEvidenceProvidedChanged, (
    state, { evidenceProvided },
  ): CatADI2UniqueTypes.VehicleDetails => ({
    ...state,
    motEvidenceProvided: evidenceProvided,
  })),
  on(vehicleDetailsActions.SchoolCarToggled, (state): CatADI2UniqueTypes.VehicleDetails => ({
    ...state,
    schoolCar: !state.schoolCar,
  })),
  on(vehicleDetailsActions.DualControlsToggled, (state): CatADI2UniqueTypes.VehicleDetails => ({
    ...state,
    dualControls: !state.dualControls,
  })),
  on(vehicleDetailsActions.GearboxCategoryChanged, (state, { gearboxCategory }): CatADI2UniqueTypes.VehicleDetails => ({
    ...state,
    gearboxCategory,
  })),
  on(vehicleDetailsActions.ClearGearboxCategory, (state): CatADI2UniqueTypes.VehicleDetails => ({
    ...state,
    gearboxCategory: null,
  })),
);

export const getVehicleDetails = createFeatureSelector<CatADI2UniqueTypes.VehicleDetails>('vehicleDetails');
