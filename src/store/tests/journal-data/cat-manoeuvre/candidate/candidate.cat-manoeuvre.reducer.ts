import { CatCMUniqueTypes } from '@dvsa/mes-test-schema/categories/CM';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import * as candidateActions from './candidate.cat-manoeuvre.actions';

export const initialState: CatCMUniqueTypes.Candidate = {
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

export const candidateCatManoeuvreReducer = createReducer(
  initialState,
  on(candidateActions.PopulateCandidateDetailsCatManoeuvre, (_, { candidate }) => candidate),
);

export const getCandidate = createFeatureSelector<CatCMUniqueTypes.Candidate>('candidate');
