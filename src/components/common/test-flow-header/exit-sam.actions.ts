import { ExitSAMMethodUsed } from '@components/common/test-flow-header/test-flow-header.component';
import { createAction } from '@ngrx/store';

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

export const ExitSamActivated = createAction(
  '[Escape Single App Mode] Escape Single App Mode Activated',
  (method: ExitSAMMethodUsed) => ({ method })
);

export const ExitSAMConfirmButtonClicked = createAction('[Escape Single App Mode] Confirm Button Clicked');

export const ExitSAMCancelButtonClicked = createAction('[Escape Single App Mode] Cancel Button Clicked');

export const ExitSAMUserReturned = createAction('[Escape Single App Mode] User Returned to App');
