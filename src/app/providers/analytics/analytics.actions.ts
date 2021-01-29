import { createAction } from '@ngrx/store';

export const AnalyticRecorded = createAction(
  '[Analytics] Analytic Recorded',
);

export const AnalyticNotRecorded = createAction(
  '[Analytics] Analytic Not Recorded',
);
