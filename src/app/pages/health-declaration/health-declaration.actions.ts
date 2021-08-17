import { Action } from '@ngrx/store';

export const HEALTH_DECLARATION_VIEW_DID_ENTER = '[HealthDeclarationPage] Health declaration did enter';
export const CONTINUE_FROM_DECLARATION = '[HealthDeclarationPage] Continue from declaration';

export const HEALTH_DECLARATION_VALIDATION_ERROR = '[HealthDeclarationPage] Validation Error';

export class HealthDeclarationViewDidEnter implements Action {
  readonly type = HEALTH_DECLARATION_VIEW_DID_ENTER;
}

export class ContinueFromDeclaration implements Action {
  readonly type = CONTINUE_FROM_DECLARATION;
}

export class HealthDeclarationValidationError implements Action {
  readonly type = HEALTH_DECLARATION_VALIDATION_ERROR;
  constructor(public errorMessage: string) {}
}

export type Types =
  | HealthDeclarationViewDidEnter
  | ContinueFromDeclaration
  | HealthDeclarationValidationError;
