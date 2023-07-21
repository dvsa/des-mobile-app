import { CatDUniqueTypes } from '@dvsa/mes-test-schema/categories/D';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import { uniq } from 'lodash';
import * as vehicleDetailsActions from '../vehicle-details.actions';

const initialState: CatDUniqueTypes.VehicleDetails = {
  registrationNumber: '',
  motStatus: null,
  motEvidence: null,
  motEvidenceProvided: null,
  make: null,
  model: null,
  testExpiryDate: null,
  previouslySearchedRegNumbers: [],
};

export const vehicleDetailsCatDReducer = createReducer(
  initialState,
  on(vehicleDetailsActions.VehicleRegistrationChanged, (state, {
    registrationNumber,
  }): CatDUniqueTypes.VehicleDetails => ({
    ...state,
    registrationNumber,
  })),
  on(vehicleDetailsActions.MotDataChanged, (state, {
    status,
    make,
    model,
    testExpiryDate,
  }): CatDUniqueTypes.VehicleDetails => ({
    ...state,
    motStatus: status,
    make,
    model,
    testExpiryDate,
  })),
  on(vehicleDetailsActions.ClearMotData, (state): CatDUniqueTypes.VehicleDetails => ({
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
  }): CatDUniqueTypes.VehicleDetails => ({
    ...state,
    motEvidence: evidence,
  })),
  on(vehicleDetailsActions.AlternativeMotEvidenceProvidedChanged, (
    state, { evidenceProvided },
  ): CatDUniqueTypes.VehicleDetails => ({
    ...state,
    motEvidenceProvided: evidenceProvided,
  })),
  on(vehicleDetailsActions.GearboxCategoryChanged, (state, {
    gearboxCategory,
  }): CatDUniqueTypes.VehicleDetails => ({
    ...state,
    gearboxCategory,
  })),
  on(vehicleDetailsActions.ClearGearboxCategory, (state): CatDUniqueTypes.VehicleDetails => ({
    ...state,
    gearboxCategory: null,
  })),
  on(vehicleDetailsActions.PopulateVehicleDimensions, (state, {
    vehicleWidth,
    vehicleLength,
  }) => ({
    ...state,
    vehicleLength,
    vehicleWidth,
  })),
);

export const getVehicleDetails = createFeatureSelector<CatDUniqueTypes.VehicleDetails>('vehicleDetails');
