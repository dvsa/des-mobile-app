import { createAction } from '@ngrx/store';

export const SpeedRequirementNotMetModalOpened = createAction(
  '[End test] Speed Requirement not met modal opened',
);

export const EmergencyStopDangerousFaultModelOpened = createAction(
  '[End test] Emergency stop dangerous fault model opened',
);

export const EmergencyStopSeriousFaultModelOpened = createAction(
  '[End test] Emergency stop serious fault modal opened',
);
