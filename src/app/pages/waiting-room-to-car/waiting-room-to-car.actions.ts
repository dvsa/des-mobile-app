import { createAction } from '@ngrx/store';
import { ModalEvent } from '@pages/waiting-room-to-car/components/mot-components/mot-failed-modal/mot-failed-modal.component';
import { MOTAbortedMethod } from '@pages/waiting-room-to-car/components/vehicle-registration/vehicle-registration';
import { HttpStatusCodes } from '@shared/models/http-status-codes';

export const WaitingRoomToCarViewBikeCategoryModal = createAction(
  '[WaitingRoomToCarPage] Waiting Room To Car View Bike Category Modal'
);

export const WaitingRoomToCarViewDidEnter = createAction('[WaitingRoomToCarPage] Waiting Room To Car Did Enter');

export const WaitingRoomToCarError = createAction(
  '[WaitingRoomToCarPage] Waiting Room To Car Error',
  (errorMessage: string) => ({ errorMessage })
);

export const WaitingRoomToCarValidationError = createAction(
  '[WaitingRoomToCarPage] Waiting Room To Car Validation Error',
  (errorMessage: string) => ({ errorMessage })
);

export const WaitingRoomToCarBikeCategorySelected = createAction(
  '[WaitingRoomToCarPage] Waiting Room To Car Bike Category Selected',
  (bikeCategory: string) => ({ bikeCategory })
);

export const WaitingRoomToCarBikeCategoryChanged = createAction(
  '[WaitingRoomToCarPage] Waiting Room To Car Bike Category Changed',
  (initialBikeCategory: string, selectedBikeCategory: string) => ({ initialBikeCategory, selectedBikeCategory })
);

export const InvalidMotModalOutcome = createAction(
  '[Vehicle Details] Mot failed modal outcome',
  (modalEvent: ModalEvent) => ({
    modalEvent,
  })
);

export const MotSearchButtonPressed = createAction('[Vehicle Details] Mot search button pressed');

export const MotNoEvidenceBannerCancelled = createAction('[Vehicle Details] Mot no evidence banner cancelled');

export const InvalidMotTerminate = createAction('[Vehicle Details] Invalid mot terminate');

export const MotCallAborted = createAction('[Vehicle Details] Mot call aborted', (method: MOTAbortedMethod) => ({
  method,
}));

export const MotServiceUnavailable = createAction(
  '[Vehicle Details] Mot service unavailable',
  (statusCode: HttpStatusCodes) => ({
    statusCode,
  })
);

export const InvalidMotModalValidationError = createAction('[Vehicle Details] Invalid mot modal validation error');

export const MotFailedModalOpened = createAction('[Vehicle Details] Mot failed modal opened');
