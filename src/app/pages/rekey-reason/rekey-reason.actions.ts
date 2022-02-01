import { createAction } from '@ngrx/store';

export const RekeyReasonViewDidEnter = createAction(
  '[RekeyReasonPage] Rekey Reason view did enter',
);

export const ValidateTransferRekey = createAction(
  '[RekeyReasonPage] Validate transfer rekey',
);

export const ValidateTransferRekeyFailed = createAction(
  '[RekeyReasonPage] Validate transfer rekey failed',
  (staffNumberNotFound: boolean) => ({ staffNumberNotFound }),
);

export const ResetStaffNumberValidationError = createAction(
  '[RekeyReasonPage] Reset staff number validation error',
);

export const RekeyUploadTest = createAction(
  '[RekeyReasonPage] Upload rekey test',
);
