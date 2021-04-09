import { createAction } from '@ngrx/store';

export const OrditTrainedChanged = createAction(
  '[WRTC] [CatADIPart2] Ordit Trained changed',
  (orditTrainedCandidate: boolean) => ({ orditTrainedCandidate }),
);

export const TrainingRecordsChanged = createAction(
  '[WRTC] [CatADIPart2] Training Records changed',
  (trainingRecords: boolean) => ({ trainingRecords }),
);

export const TrainerRegistrationNumberChanged = createAction(
  '[WRTC] Trainer registration number changed',
  (trainerRegistrationNumber: number) => ({ trainerRegistrationNumber }),
);
