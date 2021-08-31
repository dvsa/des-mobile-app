import { createAction } from '@ngrx/store';

export const NonPassFinalisationViewDidEnter = createAction(
  '[NonPassFinalisationPage] NonPassFinalisation view did enter',
);

export const NonPassFinalisationValidationError = createAction(
  '[NonPassFinalisationPage] Validation Error',
  (errorMessage: string) => ({ errorMessage }),
);
