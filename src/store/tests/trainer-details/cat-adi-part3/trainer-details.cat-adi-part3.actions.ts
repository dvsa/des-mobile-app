import { createAction } from '@ngrx/store';

export const OrditTrainedChanged = createAction(
  '[Trainer details] [CatADIPart3] Ordit Trained changed',
  (orditTrainedCandidate: boolean) => ({ orditTrainedCandidate }),
);

export const PDILogbook = createAction(
  '[Trainer details] [CatADIPart3] PDI Logbook changed',
  (pdiLogbook: boolean) => ({ pdiLogbook }),
);

export const TraineeLicence = createAction(
  '[Trainer details] [CatADIPart3] Trainee licence changed',
  (traineeLicence: boolean) => ({ traineeLicence }),
);
