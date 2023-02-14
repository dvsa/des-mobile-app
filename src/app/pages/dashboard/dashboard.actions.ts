import { createAction } from '@ngrx/store';

export const DashboardViewDidEnter = createAction(
  '[DashboardPage] Dashboard did enter',
);

export const PracticeTestReportCard = createAction(
  '[DashboardPage] Practice test report clicked',
);

export const SideMenuOpened = createAction(
  '[DashboardPage] Side menu opened',
);

export const SideMenuClosed = createAction(
  '[DashboardPage] Side menu closed',
);

export const SideMenuItemSelected = createAction(
  '[DashboardPage] Side menu item selected',
  (item: string) => ({ item }),
);
