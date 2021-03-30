import { Action } from '@ngrx/store';

export const CLEAR_DECLARATIONS = '[PreTestDeclarations] Clear declarations';
export const TOGGLE_INSURANCE_DECLARATION = '[PreTestDeclarations] Insurance declaration toggled';
export const TOGGLE_RESIDENCY_DECLARATION = '[PreTestDeclarations] Residency declaration toggled';
export const SIGNATURE_DATA_CHANGED = '[PreTestDeclarations] Signature data changed';
export const SIGNATURE_DATA_CLEARED = '[PreTestDeclarations] Signature data cleared';
export const CANDIDATE_DECLARATION_SIGNED = '[PreTestDeclarations] Candidate declaration signed';
export const SET_DECLARATION_STATUS = '[PreTestDeclarations] Setting the residency and insurance declaration';

export class ClearPreTestDeclarations implements Action {
  readonly type = CLEAR_DECLARATIONS;
}

export class ToggleInsuranceDeclaration implements Action {
  readonly type = TOGGLE_INSURANCE_DECLARATION;
}

export class ToggleResidencyDeclaration implements Action {
  readonly type = TOGGLE_RESIDENCY_DECLARATION;
}

export class SignatureDataChanged implements Action {
  constructor(public payload: string) { }
  readonly type = SIGNATURE_DATA_CHANGED;
}
export class SignatureDataCleared implements Action {
  readonly type = SIGNATURE_DATA_CLEARED;
}

export class CandidateDeclarationSigned implements Action {
  readonly type = CANDIDATE_DECLARATION_SIGNED;
}

export class SetDeclarationStatus {
  constructor(public payload: boolean) { }
  readonly type = SET_DECLARATION_STATUS;
}

export type Types =
  | CandidateDeclarationSigned
  | SetDeclarationStatus
  | ClearPreTestDeclarations
  | ToggleInsuranceDeclaration
  | ToggleResidencyDeclaration
  | SignatureDataChanged
  | SignatureDataCleared;
