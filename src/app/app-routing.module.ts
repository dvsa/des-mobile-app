import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {
  DASHBOARD_PAGE, LOGIN_PAGE, JOURNAL_PAGE, TEST_CENTRE_JOURNAL_PAGE,
} from '@pages/page-names.constants';

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
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
