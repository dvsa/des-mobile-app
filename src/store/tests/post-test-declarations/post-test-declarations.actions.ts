import { Action } from '@ngrx/store';

export const CLEAR_DECLARATIONS = '[HealthDeclarations] Clear declarations';
export const TOGGLE_HEALTH_DECLARATION = '[HealthDeclarations] Health declaration toggled';
export const HEALTH_DECLARATION_ACCEPTED = '[HealthDeclarations] Health declaration accepted';
export const PASS_CERTIFICATE_RECIEVED = '[HealthDeclarations] Pass certificate recieved';
export const TOGGLE_RECEIPT_DECLARATION = '[HealthDeclarations] Receipt declaration toggled';
export const SIGNATURE_DATA_CHANGED = '[HealthDeclarations] Signature data changed';
export const SIGNATURE_DATA_CLEARED = '[HealthDeclarations] Signature data cleared';

export class ClearPostTestDeclarations implements Action {
  readonly type = CLEAR_DECLARATIONS;
}

export class ToggleHealthDeclaration implements Action {
  readonly type = TOGGLE_HEALTH_DECLARATION;
}

export class HealthDeclarationAccepted implements Action {
  readonly type = HEALTH_DECLARATION_ACCEPTED;
  constructor(public payload: boolean) {}
}

export class ToggleReceiptDeclaration implements Action {
  readonly type = TOGGLE_RECEIPT_DECLARATION;
}

export class PassCertificateNumberRecieved implements Action {
  readonly type = PASS_CERTIFICATE_RECIEVED;
  constructor(public payload: boolean) {}
}

export class SignatureDataChanged implements Action {
  constructor(public payload: string) { }
  readonly type = SIGNATURE_DATA_CHANGED;
}

export class SignatureDataCleared implements Action {
  readonly type = SIGNATURE_DATA_CLEARED;
}

export type Types =
  | ClearPostTestDeclarations
  | ToggleHealthDeclaration
  | HealthDeclarationAccepted
  | PassCertificateNumberRecieved
  | ToggleReceiptDeclaration
  | SignatureDataChanged
  | SignatureDataCleared;
