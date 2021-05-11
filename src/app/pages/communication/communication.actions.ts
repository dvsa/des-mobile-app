import { createAction } from '@ngrx/store';

export const CommunicationViewDidEnter = createAction(
  '[CommunicationPage] Communication page did enter',
);

export const CommunicationViewChoseEmailProvidedAtBooking = createAction(
  '[CommunicationPage] Communication page chose email provided at booking',
);

export const CommunicationViewChoseNewEmail = createAction(
  '[CommunicationPage] Communication page chose new email',
);

export const CommunicationViewInputNewEmail = createAction(
  '[CommunicationPage] Added new candidate email',
  (payload: string) => ({ payload }),
);

export const CommunicationSubmitInfo = createAction(
  '[CommunicationPage] Submit Waiting Room Info',
);

export const CommunicationSubmitInfoError = createAction(
  '[CommunicationPage] Submit Waiting Room Info Error',
  (errorMessage: string) => ({ errorMessage }),
);

export const CommunicationValidationError = createAction(
  '[CommunicationPage] Communication page validation error',
  (errorMessage: string) => ({ errorMessage }),
);
