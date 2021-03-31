import { createAction, props } from '@ngrx/store';

export const ToggleControlledStop = createAction(
  '[ControlledStop] Toggle Controlled Stop',
);

export const ControlledStopAddDrivingFault = createAction(
  '[ControlledStop] Add Driving Fault',
);

export const ControlledStopAddSeriousFault = createAction(
  '[ControlledStop] Add Serious Fault',
);

export const ControlledStopAddDangerousFault = createAction(
  '[ControlledStop] Add Dangerous Fault',
);

export const ControlledStopRemoveFault = createAction(
  '[ControlledStop] Remove Fault',
);

export const AddControlledStopComment = createAction(
  '[ControlledStop] Add Comment',
  props<{ payload: string }>()
);
