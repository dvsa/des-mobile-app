import { createAction } from '@ngrx/store';

export const TestReportDashboardViewDidEnter = createAction(
  '[TestReportDashboardPage] Test report dashboard did enter',
);

export const TestReportDashboardNavigateToPage = createAction(
  '[TestReportDashboardPage] Navigate to page',
  (page: string) => ({ page }),
);

export const TestReportDashboardModalOpened = createAction(
  '[TestReportDashboardPage] Modal opened',
);
