import { createAction } from '@ngrx/store';

export const AddEmergencyStopSeriousFault = createAction(
  '[SpeedCheck] [CatAMod1] Add Emergency Stop Speed Req Serious Fault',
);

export const RemoveEmergencyStopSeriousFault = createAction(
  '[SpeedCheck] [CatAMod1] Remove Emergency Stop Speed Req Serious Fault',
);

export const RecordEmergencyStopFirstAttempt = createAction(
  '[SpeedCheck] [CatAMod1] Record Emergency Stop First Attempt',
  (attemptedSpeed: string) => ({ attemptedSpeed }),
);

export const RecordEmergencyStopSecondAttempt = createAction(
  '[SpeedCheck] [CatAMod1] Record Emergency Stop Second Attempt',
  (attemptedSpeed: string) => ({ attemptedSpeed }),
);

export const AddAnEmergencyStopComment = createAction(
  '[SpeedCheck] [CatAMod1] Add Emergency Stop Comment',
  (comment: string) => ({ comment }),
);
