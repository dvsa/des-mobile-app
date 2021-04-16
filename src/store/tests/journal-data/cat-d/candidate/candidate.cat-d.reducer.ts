import { CatDUniqueTypes } from '@dvsa/mes-test-schema/categories/D';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import * as candidateActions from './candidate.cat-d.actions';

export const initialState: CatDUniqueTypes.Candidate = {
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

export const candidateCatDReducer = createReducer(
  initialState,
  on(candidateActions.PopulateCandidateDetailsCatD, (state, { candidate }) => candidate),
);

export const getCandidate = createFeatureSelector<CatDUniqueTypes.Candidate>('candidate');
