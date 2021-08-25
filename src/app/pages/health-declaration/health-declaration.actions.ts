import { createAction } from '@ngrx/store';

export const HealthDeclarationViewDidEnter = createAction('[HealthDeclarationPage] Health declaration did enter');
export const ContinueFromDeclaration = createAction('[HealthDeclarationPage] Continue from declaration');

export const HealthDeclarationValidationError = createAction(
  '[HealthDeclarationPage] Validation Error',
  (errorMessage: string) => ({ errorMessage }),
);
