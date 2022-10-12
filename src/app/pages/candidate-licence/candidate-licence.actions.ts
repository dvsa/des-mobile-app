import { createAction } from '@ngrx/store';

export const CandidateLicenceViewDidEnter = createAction(
  '[Candidate licence] View did enter',
);

export const GetCandidateLicenceData = createAction(
  '[Candidate licence] Get licence data',
);

export const GetCandidateLicenceDataSuccess = createAction(
  '[Candidate licence] Get licence data success',
);

export const GetCandidateLicenceDataError = createAction(
  '[Candidate licence] Get licence data error',
);

export const ClearCandidateLicenceData = createAction(
  '[Candidate licence] Clear licence data',
);
