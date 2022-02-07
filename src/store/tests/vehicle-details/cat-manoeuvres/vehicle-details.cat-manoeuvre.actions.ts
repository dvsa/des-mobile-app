import { createAction } from '@ngrx/store';

export const PopulateManoeuvreVehicleDimensions = createAction(
  '[Vehicle Details] Populate Vehicle Dimensions',
  (
    vehicleWidth: number,
    vehicleLength: number,
    vehicleHeight: number,
    numberOfSeats: number,
  ) => ({
    vehicleWidth,
    vehicleLength,
    vehicleHeight,
    numberOfSeats,
  }),
);
