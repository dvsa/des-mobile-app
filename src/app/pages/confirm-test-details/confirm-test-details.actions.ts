import { createAction } from '@ngrx/store';

export const ConfirmTestDetailsViewDidEnter = createAction(
  '[ConfirmTestDetailsPage] Confirm Test Details did enter',
);

export const BackToDebrief = createAction(
  '[ConfirmTestDetailsPage] Back to debrief clicked',
);

export const BackButtonClick = createAction(
  '[ConfirmTestDetailsPage] Back button clicked',
);
