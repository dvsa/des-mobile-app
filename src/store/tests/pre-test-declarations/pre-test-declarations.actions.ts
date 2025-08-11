import { createAction } from '@ngrx/store';

export const ClearPreTestDeclarations = createAction('[PreTestDeclarations] Clear declarations');

export const ToggleInsuranceDeclaration = createAction(
  '[PreTestDeclarations] Insurance declaration toggled',
  (selected: boolean) => ({ selected })
);

export const ToggleResidencyDeclaration = createAction(
  '[PreTestDeclarations] Residency declaration toggled',
  (selected: boolean) => ({ selected })
);

export const SignatureDataChanged = createAction(
  '[PreTestDeclarations] Signature data changed',
  (signature: string) => ({ signature })
);

export const SignatureDataCleared = createAction('[PreTestDeclarations] Signature data cleared');

export const SignatureConfirmed = createAction('[PreTestDeclarations] Signature data confirmed');

export const CandidateDeclarationSigned = createAction('[PreTestDeclarations] Candidate declaration signed');

export const SetDeclarationStatus = createAction(
  '[PreTestDeclarations] Setting the residency and insurance declaration',
  (declarationStatus: boolean) => ({ declarationStatus })
);

export const ManoeuvresPassCertNumberChanged = createAction(
  '[PreTestDeclarations] Manoeuvres pass certificate number changed',
  (manoeuvrePassCertificateNumber: string) => ({ manoeuvrePassCertificateNumber })
);

export const ValidPassCertChanged = createAction(
  '[PreTestDeclarations] Valid certificate cert changed',
  (validCertificate: boolean) => ({ validCertificate })
);
