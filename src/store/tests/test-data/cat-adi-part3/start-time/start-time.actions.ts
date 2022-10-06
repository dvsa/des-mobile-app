import { createAction } from '@ngrx/store';

export const StartTimeChanged = createAction(
  '[TestReportDashboard] Start time changed',
  (time: string) => ({ time }),
);
