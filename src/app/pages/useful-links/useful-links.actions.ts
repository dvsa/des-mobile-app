import { createAction } from '@ngrx/store';

export const UsefulLinkSelected = createAction('[UsefulLinksPage] Useful Link Selected', (usefulLinkName) => ({
  usefulLinkName,
}));

export const UsefulLinksReturnToDashboardPressed = createAction('[UsefulLinksPage] Return to Dashboard button pressed');
