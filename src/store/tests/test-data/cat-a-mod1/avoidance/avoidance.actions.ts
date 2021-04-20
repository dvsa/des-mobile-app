import { createAction } from '@ngrx/store';

export const AddAvoidanceSeriousFault = createAction(
  '[SpeedCheck] [CatAMod1] Add Avoidance Speed Req Serious Fault',
);

export const RemoveAvoidanceSeriousFault = createAction(
  '[SpeedCheck] [CatAMod1] Remove Avoidance Speed Req Serious Fault',
);

export const RecordAvoidanceFirstAttempt = createAction(
  '[SpeedCheck] [CatAMod1] Record Avoidance First Attempt',
  (attemptedSpeed: string) => ({ attemptedSpeed: string })
);

export const RecordAvoidanceSecondAttempt = createAction(
  '[SpeedCheck] [CatAMod1] Record Avoidance Second Attempt',
  (attemptedSpeed: string) => ({ attemptedSpeed: string })
);

export const AddAvoidanceComment = createAction(
  '[SpeedCheck] [CatAMod1] Add Avoidance Comment',
  (comment: string) => ({ comment: string })
);
