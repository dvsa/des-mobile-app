import { createAction, props } from '@ngrx/store';

export const ClearPreTestDeclarations = createAction(
  '[PreTestDeclarations] Clear declarations',
);

export const ToggleInsuranceDeclaration = createAction(
  '[PreTestDeclarations] Insurance declaration toggled',
);

export const ToggleResidencyDeclaration = createAction(
  '[PreTestDeclarations] Residency declaration toggled',
);

export const SignatureDataChanged = createAction(
  '[PreTestDeclarations] Signature data changed',
  props<{ payload: string; }>(),
);

export const SignatureDataCleared = createAction(
  '[PreTestDeclarations] Signature data cleared',
);

export const CandidateDeclarationSigned = createAction(
  '[PreTestDeclarations] Candidate declaration signed',
);

export const SetDeclarationStatus = createAction(
  '[PreTestDeclarations] Setting the residency and insurance declaration',
  props<{ payload: boolean; }>(),
);
