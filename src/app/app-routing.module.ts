import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {
  DASHBOARD_PAGE, LOGIN_PAGE, JOURNAL_PAGE, TEST_CENTRE_JOURNAL_PAGE,
} from '@pages/page-names.constants';
import { Waiting_Room_Route } from './routing/waiting_room-route';

const routes: Routes = [
  {
    path: '',
    redirectTo: LOGIN_PAGE,
    pathMatch: 'full',
  },
  {
    path: DASHBOARD_PAGE,
    loadChildren: () => import('./pages/dashboard/dashboard.module').then((m) => m.DashboardPageModule),
  },
  {
    path: LOGIN_PAGE,
    loadChildren: () => import('./pages/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: JOURNAL_PAGE,
    loadChildren: () => import('./pages/journal/journal.module').then((m) => m.JournalPageModule),
  },
  {
    path: TEST_CENTRE_JOURNAL_PAGE,
    loadChildren: () => import('./pages/test-centre-journal/test-centre-journal.module')
      .then((m) => m.TestCentreJournalModule),
  },
  ...Waiting_Room_Route,
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
