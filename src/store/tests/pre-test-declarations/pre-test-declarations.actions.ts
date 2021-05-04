import { createAction } from '@ngrx/store';

export const SIGNATURE_DATA_CHANGED = '[PreTestDeclarations] Signature data changed';
export const SIGNATURE_DATA_CLEARED = '[PreTestDeclarations] Signature data cleared';

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
  SIGNATURE_DATA_CHANGED,
  (signature: string) => ({ signature }),
);

export const SignatureDataCleared = createAction(
  SIGNATURE_DATA_CLEARED,
);

export const CandidateDeclarationSigned = createAction(
  '[PreTestDeclarations] Candidate declaration signed',
);

export const SetDeclarationStatus = createAction(
  '[PreTestDeclarations] Setting the residency and insurance declaration',
  (declarationStatus: boolean) => ({ declarationStatus }),
);
