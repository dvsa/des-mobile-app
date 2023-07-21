import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import { CatCMUniqueTypes } from '@dvsa/mes-test-schema/categories/CM';
import { uniq } from 'lodash';
import * as vehicleDetailsActions from '../vehicle-details.actions';
import * as manoeuvreVehicleDetailsActions from './vehicle-details.cat-manoeuvre.actions';

const initialState: CatCMUniqueTypes.VehicleDetails = {
  registrationNumber: '',
  motStatus: null,
  motEvidence: null,
  motEvidenceProvided: null,
  make: null,
  model: null,
  testExpiryDate: null,
  previouslySearchedRegNumbers: [],
};

export const vehicleDetailsCatManoeuvreReducer = createReducer(
  initialState,
  on(vehicleDetailsActions.VehicleRegistrationChanged, (state, {
    registrationNumber,
  }): CatCMUniqueTypes.VehicleDetails => ({
    ...state,
    registrationNumber,
  })),
  on(vehicleDetailsActions.MotDataChanged, (state, {
    status,
    make,
    model,
    testExpiryDate,
  }): CatCMUniqueTypes.VehicleDetails => ({
    ...state,
    motStatus: status,
    make,
    model,
    testExpiryDate,
  })),
  on(vehicleDetailsActions.ClearMotData, (state): CatCMUniqueTypes.VehicleDetails => ({
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
  }): CatCMUniqueTypes.VehicleDetails => ({
    ...state,
    motEvidence: evidence,
  })),
  on(vehicleDetailsActions.AlternativeMotEvidenceProvidedChanged, (
    state, { evidenceProvided },
  ): CatCMUniqueTypes.VehicleDetails => ({
    ...state,
    motEvidenceProvided: evidenceProvided,
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
