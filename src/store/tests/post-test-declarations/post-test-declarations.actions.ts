import { createAction } from '@ngrx/store';

export const ClearPostTestDeclarations = createAction(
  '[HealthDeclarations] Clear declarations',
);

export const ToggleHealthDeclaration = createAction(
  '[HealthDeclarations] Health declaration toggled',
);

export const HealthDeclarationAccepted = createAction(
  '[HealthDeclarations] Health declaration accepted',
  (payload: boolean) => ({ payload }),
);

export const ToggleReceiptDeclaration = createAction(
  '[HealthDeclarations] Receipt declaration toggled',
);

export const PassCertificateNumberReceived = createAction(
  '[HealthDeclarations] Health declaration accepted',
  (passCertNumberReceived: boolean) => ({ passCertNumberReceived }),
);

export const SignatureDataChanged = createAction(
  '[HealthDeclarations] Signature data changed',
  (signature: string) => ({ signature }),
);

export const SignatureDataCleared = createAction(
  '[HealthDeclarations] Signature data cleared',
);
