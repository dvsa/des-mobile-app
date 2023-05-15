import { createAction } from '@ngrx/store';

export const CommunicationViewDidEnter = createAction(
  '[CommunicationPage] Communication page did enter',
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

export const BookingEmailSelected = createAction(
  '[WaitingRoomToCarPage] Booking email selected',
);

export const NewEmailSelected = createAction(
  '[WaitingRoomToCarPage] New email selected',
);

export const PostalSelected = createAction(
  '[WaitingRoomToCarPage] Post selected',
);
