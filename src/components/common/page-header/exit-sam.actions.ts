import { createAction } from '@ngrx/store';

export const ExitSamError = createAction(
  '[Escape Single App Mode] Escape Single App Mode Error',
  (errorMessage: string, errorData = null) => ({ errorMessage, errorData })
);
