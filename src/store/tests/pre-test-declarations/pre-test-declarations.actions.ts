import { createAction } from '@ngrx/store';

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
  (signature: string) => ({ signature }),
);

export const SignatureDataCleared = createAction(
  '[PreTestDeclarations] Signature data cleared',
);

export const CandidateDeclarationSigned = createAction(
  '[PreTestDeclarations] Candidate declaration signed',
);

export const SetDeclarationStatus = createAction(
  '[PreTestDeclarations] Setting the residency and insurance declaration',
  (declarationStatus: boolean) => ({ declarationStatus }),
);

export const ManoeuvresPassCertNumberChanged = createAction(
  '[PreTestDeclarations] Manoeuvres pass certificate number changed',
  (manoeuvrePassCertificateNumber: string) => ({ manoeuvrePassCertificateNumber }),
);
