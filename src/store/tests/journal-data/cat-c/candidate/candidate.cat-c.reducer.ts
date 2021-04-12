import { CatCUniqueTypes } from '@dvsa/mes-test-schema/categories/C';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import * as candidateActions from './candidate.cat-c.actions';

export const initialState: CatCUniqueTypes.Candidate = {
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

export const candidateCatCReducer = createReducer(
  initialState,
  on(candidateActions.PopulateCandidateDetailsCatC, (_, {
    candidate,
  }): CatCUniqueTypes.Candidate => candidate),
);

export const getCandidate = createFeatureSelector<CatCUniqueTypes.Candidate>('candidate');
