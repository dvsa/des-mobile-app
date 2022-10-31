import { createAction } from '@ngrx/store';

// Page actions
export const CandidateLicenceViewDidEnter = createAction(
  '[CandidateLicencePage] View did enter',
);

export const CandidateLicenceDataValidationError = createAction(
  '[CandidateLicencePage] Validation Error',
  (errorMessage: string) => ({ errorMessage }),
);

// Data actions
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
