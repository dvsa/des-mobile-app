import { CatCUniqueTypes } from '@dvsa/mes-test-schema/categories/C';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import { uniq } from 'lodash';
import * as vehicleDetailsActions from '../vehicle-details.actions';

const initialState: CatCUniqueTypes.VehicleDetails = {
  registrationNumber: '',
  motStatus: null,
  motEvidence: null,
  motEvidenceProvided: null,
  make: null,
  model: null,
  testExpiryDate: null,
  previouslySearchedRegNumbers: [],
};

export const vehicleDetailsCatCReducer = createReducer(
  initialState,
  on(vehicleDetailsActions.VehicleRegistrationChanged, (state, {
    registrationNumber,
  }): CatCUniqueTypes.VehicleDetails => ({
    ...state,
    registrationNumber,
  })),
  on(vehicleDetailsActions.MotDataChanged, (state, {
    status,
    make,
    model,
    testExpiryDate,
  }): CatCUniqueTypes.VehicleDetails => ({
    ...state,
    motStatus: status,
    make,
    model,
    testExpiryDate,
  })),
  on(vehicleDetailsActions.ClearMotData, (state): CatCUniqueTypes.VehicleDetails => ({
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
  }): CatCUniqueTypes.VehicleDetails => ({
    ...state,
    motEvidence: evidence,
  })),
  on(vehicleDetailsActions.AlternativeMotEvidenceProvidedChanged, (
    state, { evidenceProvided },
  ): CatCUniqueTypes.VehicleDetails => ({
    ...state,
    motEvidenceProvided: evidenceProvided,
  })),
  on(vehicleDetailsActions.GearboxCategoryChanged, (state, {
    gearboxCategory,
  }): CatCUniqueTypes.VehicleDetails => ({
    ...state,
    gearboxCategory,
  })),
  on(vehicleDetailsActions.ClearGearboxCategory, (state): CatCUniqueTypes.VehicleDetails => ({
    ...state,
    gearboxCategory: null,
  })),
  on(vehicleDetailsActions.PopulateVehicleDimensions, (state, {
    vehicleWidth,
    vehicleLength,
  }): CatCUniqueTypes.VehicleDetails => ({
    ...state,
    vehicleLength,
    vehicleWidth,
  })),
);

export const getVehicleDetails = createFeatureSelector<CatCUniqueTypes.VehicleDetails>('vehicleDetails');
