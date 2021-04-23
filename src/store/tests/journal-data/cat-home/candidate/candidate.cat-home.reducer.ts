import { CatFUniqueTypes } from '@dvsa/mes-test-schema/categories/F';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import * as candidateActions from './candidate.cat-home.actions';

export const initialState: CatFUniqueTypes.Candidate = {
  candidateId: null,
  candidateName: {},
  driverNumber: null,
  dateOfBirth: null,
  gender: null,
  candidateAddress: {},
  primaryTelephone: null,
  secondaryTelephone: null,
  mobileTelephone: null,
  emailAddress: null,
  prn: null,
  previousADITests: null,
  ethnicityCode: null,
  businessAddress: {},
  businessName: null,
  businessTelephone: null,
};

export const candidateCatHomeReducer = createReducer(
  initialState,
  on(candidateActions.PopulateCandidateDetailsCatHome, (_, { candidate }) => candidate),
);

export const getCandidate = createFeatureSelector<CatFUniqueTypes.Candidate>('candidate');
