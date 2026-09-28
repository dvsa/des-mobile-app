import { createAction } from '@ngrx/store';
import type { ExitSAMMethodUsed } from '@providers/exitSAM/exitSAM';

export enum ExitSAMErrorMessages {
  DISABLE_SAM = 'Could not disable single app mode',
  TEAMS_NOT_FOUND = 'Could not find teams',
  COULD_NOT_EXIT_TO_TEAMS = 'Could not exit to teams',
}

export const ExitSamError = createAction(
  '[Escape Single App Mode] Escape Single App Mode Error',
  (errorMessage: string, errorData = null) => ({ errorMessage, errorData })
);

export const ExitSamSelected = createAction('[Escape Single App Mode] Escape Single App Mode Selected');

export const ExitSAMConfirmButtonClicked = createAction(
  '[Escape Single App Mode] Confirm Button Clicked',
  (method: ExitSAMMethodUsed) => ({ method })
);

export const ExitSAMCancelButtonClicked = createAction('[Escape Single App Mode] Cancel Button Clicked');

export const ExitSAMUserReturned = createAction('[Escape Single App Mode] User Returned to App');
