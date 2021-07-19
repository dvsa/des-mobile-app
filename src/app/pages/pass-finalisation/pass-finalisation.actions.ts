import { createAction } from '@ngrx/store';

export const PassFinalisationViewDidEnter = createAction(
  '[PassFinalisationPage] Pass Finalisation view did enter',
);

export const PassFinalisationValidationError = createAction(
  '[PassFinalisationPage] Validation error',
  (errorMessage: string) => ({ errorMessage }),
);
