import { createAction } from '@ngrx/store';

export const TotalScoreChanged = createAction(
  '[TestReportDashboard] Total score changed',
  (score: number) => ({ score }),
);
