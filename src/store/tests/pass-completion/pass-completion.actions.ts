import { Action } from '@ngrx/store';

export const PASS_CERTIFICATE_NUMBER_CHANGED = '[Pass Completion] Pass certificate number changed';
export const PROVISIONAL_LICENSE_RECEIVED = '[Pass Completion] Provisional license received';
export const PROVISIONAL_LICENSE_NOT_RECEIVED = '[Pass Completion] Provisional license not received';
export const CODE_78_PRESENT = '[Pass Completion] Code 78 present';
export const CODE_78_NOT_PRESENT = '[Pass Completion] Code 78 not present';

export class PassCertificateNumberChanged implements Action {
  readonly type = PASS_CERTIFICATE_NUMBER_CHANGED;
  constructor(public passCertificateNumber: string) { }
}

export class ProvisionalLicenseReceived implements Action {
  readonly type = PROVISIONAL_LICENSE_RECEIVED;
}

export class ProvisionalLicenseNotReceived implements Action {
  readonly type = PROVISIONAL_LICENSE_NOT_RECEIVED;
}

export class Code78Present implements Action {
  readonly type = CODE_78_PRESENT;
}

export class Code78NotPresent implements Action {
  readonly type = CODE_78_NOT_PRESENT;
}

export type Types =
  | PassCertificateNumberChanged
  | ProvisionalLicenseReceived
  | ProvisionalLicenseNotReceived
  | Code78Present
  | Code78NotPresent;
