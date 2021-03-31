import { createAction, props } from '@ngrx/store';

export const PassCertificateNumberChanged = createAction(
  '[Pass Completion] Pass certificate number changed',
  props<{payload: string;}>(),
);

export const ProvisionalLicenseReceived = createAction(
  '[Pass Completion] Provisional license received',
);

export const ProvisionalLicenseNotReceived = createAction(
  '[Pass Completion] Provisional license not received',
);

export const Code78Present = createAction(
  '[Pass Completion] Code 78 present',
);

export const Code78NotPresent = createAction(
  '[Pass Completion] Code 78 not present',
);
