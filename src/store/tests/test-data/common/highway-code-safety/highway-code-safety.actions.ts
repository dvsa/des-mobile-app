import { createAction, props } from '@ngrx/store';

export const ToggleHighwayCodeSafety = createAction(
  '[HighwayCodeSafety] Toggle Highway code Safety',
);

export const HighwayCodeSafetyAddDrivingFault = createAction(
  '[HighwayCodeSafety] Add Driving Fault',
);

export const HighwayCodeSafetyAddSeriousFault = createAction(
  '[HighwayCodeSafety] Add Serious Fault',
);

export const HighwayCodeSafetyRemoveFault = createAction(
  '[HighwayCodeSafety] Remove Fault',
);

export const HighwayCodeSafetyAddComment = createAction(
  '[HighwayCodeSafety] Add Comment',
  props<{ payload: string }>(),
);
