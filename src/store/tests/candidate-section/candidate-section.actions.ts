import { createAction } from '@ngrx/store';

export const VRNModalOpened = createAction(
  '[Candidate Section]: VRN Modal Opened',
);

export const VRNModalCancelled = createAction(
  '[Candidate Section]: VRN Modal Canceled',
);

export const VRNModalSaved = createAction(
  '[Candidate Section]: VRN Modal Saved',
);
