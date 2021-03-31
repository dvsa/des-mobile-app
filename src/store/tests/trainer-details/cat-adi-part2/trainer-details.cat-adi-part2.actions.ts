import { createAction, props } from '@ngrx/store';

export const OrditTrainedChanged = createAction(
  '[WRTC] [CatADIPart2] Ordit Trained changed',
  props<{ payload: boolean }>(),
);

export const TrainingRecordsChanged = createAction(
  '[WRTC] [CatADIPart2] Training Records changed',
  props<{ payload: boolean }>(),
);

export const TrainerRegistrationNumberChanged = createAction(
  '[WRTC] Trainer registration number changed',
  props<{ payload: number }>(),
);
