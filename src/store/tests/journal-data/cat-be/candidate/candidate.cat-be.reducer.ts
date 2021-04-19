import { CatBEUniqueTypes } from '@dvsa/mes-test-schema/categories/BE';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import * as candidateActions from './candidate.cat-be.actions';

export const initialState: CatBEUniqueTypes.Candidate = {
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

export const candidateCatBEReducer = createReducer(
  initialState,
  on(candidateActions.PopulateCandidateDetailsCatBE, (_, {
    candidate,
  }): CatBEUniqueTypes.Candidate => candidate),
);

export const getCandidate = createFeatureSelector<CatBEUniqueTypes.Candidate>('candidate');
