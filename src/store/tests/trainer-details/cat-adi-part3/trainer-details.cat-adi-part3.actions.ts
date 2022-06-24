import { createAction } from '@ngrx/store';

export const OrditTrainedChanged = createAction(
  '[WRTC] [CatADIPart3] Ordit Trained changed',
  (orditTrainedCandidate: boolean) => ({ orditTrainedCandidate }),
);

export const PDILogbook = createAction(
  '[WRTC] [CatADIPart3] PDI Logbook changed',
  (pdiLogbook: boolean) => ({ pdiLogbook }),
);

export const TraineeLicence = createAction(
  '[WRTC] [CatADIPart3] Trainee licence changed',
  (traineeLicence: boolean) => ({ traineeLicence }),
);

export const TrainerRegistrationNumberChanged = createAction(
  '[WRTC] Trainer registration number changed',
  (trainerRegistrationNumber: number) => ({ trainerRegistrationNumber }),
);
