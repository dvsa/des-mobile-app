import { createAction } from '@ngrx/store';

export const EndTimeChanged = createAction(
  '[TestReportDashboard] End time changed',
  (time: string) => ({ time }),
);
