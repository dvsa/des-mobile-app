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
  {
    path: 'back-to-office.cat-be',
    loadChildren: () => import('@pages/back-to-office/cat-be/back-to-office.cat-be.module').then((m) => m.BackToOffice.CatBePageModule),
  },
  {
    path: 'communication.cat-be',
    loadChildren: () => import('@pages/communication/cat-be/communication.cat-be.module').then((m) => m.Communication.CatBePageModule),
  },
  {
    path: 'debrief.cat-be',
    loadChildren: () => import('./pages/debrief/cat-be/debrief.cat-be/debrief.cat-be.module').then((m) => m.Debrief.CatBePageModule),
  },
  {
    path: 'health-declaration.cat-be',
    loadChildren: () => import('./pages/health-declaration/cat-be/health-declaration.cat-be/health-declaration.cat-be.module').then((m) => m.HealthDeclaration.CatBePageModule),
  },
  {
    path: 'non-pass-finalisation.cat-be',
    loadChildren: () => import('./pages/non-pass-finalisation/cat-be/non-pass-finalisation.cat-be/non-pass-finalisation.cat-be.module').then((m) => m.NonPassFinalisation.CatBePageModule),
  },
  {
    path: 'office.cat-be',
    loadChildren: () => import('./pages/office/cat-be/office.cat-be/office.cat-be.module').then((m) => m.Office.CatBePageModule),
  },
  {
    path: 'pass-finalisation.cat-be',
    loadChildren: () => import('./pages/pass-finalisation/cat-be/pass-finalisation.cat-be/pass-finalisation.cat-be.module').then((m) => m.PassFinalisation.CatBePageModule),
  },
  {
    path: 'post-debrief-holding.cat-be',
    loadChildren: () => import('./pages/post-debrief-holding/cat-be/post-debrief-holding.cat-be/post-debrief-holding.cat-be.module').then((m) => m.PostDebriefHolding.CatBePageModule),
  },
  {
    path: 'rekey-reason.cat-be',
    loadChildren: () => import('./pages/rekey-reason/cat-be/rekey-reason.cat-be/rekey-reason.cat-be.module').then((m) => m.RekeyReason.CatBePageModule),
  },
  {
    path: 'test-report.cat-be',
    loadChildren: () => import('./pages/test-report/cat-be/test-report.cat-be/test-report.cat-be.module').then((m) => m.TestReport.CatBePageModule),
  },
  {
    path: 'waiting-room.cat-be',
    loadChildren: () => import('./pages/waiting-room/cat-be/waiting-room.cat-be/waiting-room.cat-be.module').then((m) => m.WaitingRoom.CatBePageModule),
  },
  {
    path: 'waiting-room-to-car.cat-be',
    loadChildren: () => import('./pages/waiting-room-to-car/cat-be/waiting-room-to-car.cat-be/waiting-room-to-car.cat-be.module').then((m) => m.WaitingRoomToCar.CatBePageModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
