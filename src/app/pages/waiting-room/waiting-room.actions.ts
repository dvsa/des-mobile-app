import { createAction } from '@ngrx/store';

export const WaitingRoomViewDidEnter = createAction(
  '[WaitingRoomPage] Waiting Room Did Enter',
);

export const WaitingRoomValidationError = createAction(
  '[WaitingRoomPage] Waiting Room Validation Error',
  (errorMessage: string) => ({ errorMessage }),
);
