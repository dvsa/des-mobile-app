import { Candidate } from '@dvsa/mes-test-schema/categories/common';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import * as candidateActions from './candidate.actions';

export const initialState: Candidate = {
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
};

export const candidateReducer = createReducer(
  initialState,
  on(candidateActions.PopulateCandidateDetails, (_, { payload }) => payload),
);

export const getCandidate = createFeatureSelector<Candidate>('candidate');
