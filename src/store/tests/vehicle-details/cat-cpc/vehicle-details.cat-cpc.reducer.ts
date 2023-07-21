import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import { VehicleDetails } from '@dvsa/mes-test-schema/categories/CPC';
import { uniq } from 'lodash';
import * as vehicleDetailsActions from '../vehicle-details.actions';

const initialState: VehicleDetails = {
  registrationNumber: null,
  gearboxCategory: null,
  configuration: null,
  motStatus: null,
  motEvidence: null,
  motEvidenceProvided: null,
  make: null,
  model: null,
  testExpiryDate: null,
  previouslySearchedRegNumbers: [],
};

export const vehicleDetailsCatCPCReducer = createReducer(
  initialState,
  on(vehicleDetailsActions.VehicleRegistrationChanged, (state, { registrationNumber }): VehicleDetails => ({
    ...state,
    registrationNumber,
  })),
  on(vehicleDetailsActions.MotDataChanged, (state, {
    status,
    make,
    model,
    testExpiryDate,
  }): VehicleDetails => ({
    ...state,
    motStatus: status,
    make,
    model,
    testExpiryDate,
  })),
  on(vehicleDetailsActions.ClearMotData, (state): VehicleDetails => ({
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
  }): VehicleDetails => ({
    ...state,
    motEvidence: evidence,
  })),
  on(vehicleDetailsActions.AlternativeMotEvidenceProvidedChanged, (
    state, { evidenceProvided },
  ): VehicleDetails => ({
    ...state,
    motEvidenceProvided: evidenceProvided,
  })),
  on(vehicleDetailsActions.GearboxCategoryChanged, (state, { gearboxCategory }): VehicleDetails => ({
    ...state,
    gearboxCategory,
  })),
  on(vehicleDetailsActions.ClearGearboxCategory, (state): VehicleDetails => ({
    ...state,
    gearboxCategory: null,
  })),
  on(vehicleDetailsActions.PopulateVehicleConfiguration, (state, { configuration }): VehicleDetails => ({
    ...state,
    configuration,
  })),
);

export const getVehicleDetails = createFeatureSelector<VehicleDetails>('vehicleDetails');
