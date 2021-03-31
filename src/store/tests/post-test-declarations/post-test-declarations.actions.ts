import { createAction, props } from '@ngrx/store';

export const ClearPostTestDeclarations = createAction(
  '[HealthDeclarations] Clear declarations',
);

export const ToggleHealthDeclaration = createAction(
  '[HealthDeclarations] Health declaration toggled',
);

export const HealthDeclarationAccepted = createAction(
  '[HealthDeclarations] Health declaration accepted',
  props<{ payload: boolean; }>(),
);

export const ToggleReceiptDeclaration = createAction(
  '[HealthDeclarations] Receipt declaration toggled',
);

export const PassCertificateNumberReceived = createAction(
  '[HealthDeclarations] Health declaration accepted',
  props<{ payload: boolean; }>(),
);

export const SignatureDataChanged = createAction(
  '[HealthDeclarations] Signature data changed',
  props<{ payload: string; }>(),
);

export const SignatureDataCleared = createAction(
  '[HealthDeclarations] Signature data cleared',
);
