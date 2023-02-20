import { createAction } from '@ngrx/store';

export const WaitingRoomToCarViewBikeCategoryModal = createAction(
  '[WaitingRoomToCarPage] Waiting Room To Car View Bike Category Modal',
);

export const WaitingRoomToCarViewDidEnter = createAction(
  '[WaitingRoomToCarPage] Waiting Room To Car Did Enter',
);

export const WaitingRoomToCarError = createAction(
  '[WaitingRoomToCarPage] Waiting Room To Car Error',
  (errorMessage: string) => ({ errorMessage }),
);

export const WaitingRoomToCarValidationError = createAction(
  '[WaitingRoomToCarPage] Waiting Room To Car Validation Error',
  (errorMessage: string) => ({ errorMessage }),
);

export const WaitingRoomToCarBikeCategorySelected = createAction(
  '[WaitingRoomToCarPage] Waiting Room To Car Bike Category Selected',
  (bikeCategory: string) => ({ bikeCategory }),
);

export const WaitingRoomToCarBikeCategoryChanged = createAction(
  '[WaitingRoomToCarPage] Waiting Room To Car Bike Category Changed',
  (initialBikeCategory: string, selectedBikeCategory: string) => ({ initialBikeCategory, selectedBikeCategory }),
);

export const GetMotStatus = createAction(
  '[WaitingRoomToCarPage] Get MOT status',
  (identifier: string) => ({ identifier }),
);

export const GetMotStatusFailure = createAction(
  '[WaitingRoomToCarPage] Get MOT status failure',
);
