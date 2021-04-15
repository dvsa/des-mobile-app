import { createAction } from '@ngrx/store';

export const AssessmentReportChanged = createAction(
  '[Test Summary] [CatCPC] Assessment Report changed',
  (assessmentReport: string) => ({ assessmentReport }),
);
