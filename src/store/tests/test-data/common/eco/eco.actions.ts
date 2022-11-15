import { createAction } from '@ngrx/store';

export const ToggleEco = createAction(
  '[Eco] Toggle Eco',
);

export const ToggleControlEco = createAction(
  '[Eco] Toggle Control Eco',
);

export const TogglePlanningEco = createAction(
  '[Eco] Toggle Planning Eco',
);

export const ToggleFuelEfficientDriving = createAction(
  '[Eco] Toggle Fuel Efficient Driving',
  (fuelEfficientDriving: boolean) => ({ fuelEfficientDriving }),
);

export const AddEcoRelatedFault = createAction(
  '[Eco] Add Eco Related Fault',
  (ecoRelatedFault: string) => ({ ecoRelatedFault }),
);

export const AddEcoCaptureReason = createAction(
  '[Eco] Add Eco Capture Reason',
  (ecoCaptureReason: string) => ({ ecoCaptureReason }),
);
