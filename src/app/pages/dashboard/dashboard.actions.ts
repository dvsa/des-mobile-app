import { createAction } from '@ngrx/store';

export const DashboardViewDidEnter = createAction(
  '[DashboardPage] Dashboard did enter',
);

export const PracticeTestReportCard = createAction(
  '[DashboardPage] Practice test report clicked',
);
