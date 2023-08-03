import { Candidate } from '@dvsa/mes-test-schema/categories/common';
import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import * as candidateActions from './candidate.actions';
import { selectJournalData } from '@store/tests/tests.selector';

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
  on(candidateActions.PopulateCandidateDetails, (_, { candidate }) => candidate),
);

export const getCandidate = createFeatureSelector<Candidate>('candidate');

export const selectCandidate = createSelector(
  selectJournalData,
  (journal) => journal.candidate,
);
