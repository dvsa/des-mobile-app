import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {
  DASHBOARD_PAGE,
  LOGIN_PAGE,
  JOURNAL_PAGE,
  TEST_CENTRE_JOURNAL_PAGE,
  TestFlowPageNames,
} from '@pages/page-names.constants';
import { Waiting_Room_Route } from './routing/waiting-room-route';
import { Waiting_Room_To_Car_Route } from './routing/waiting-room-to-car-route';
import { Test_Report_Route } from './routing/test-report-route';
import { Debrief_Route } from './routing/debrief-route';
import { Pass_Finalisation_Route } from './routing/pass-finalisation-route';

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
    path: TestFlowPageNames.COMMUNICATION_PAGE,
    loadChildren: () => import('./pages/communication/communication.module')
      .then((m) => m.CommunicationPageModule),
  },
  {
    path: TestFlowPageNames.HEALTH_DECLARATION_PAGE,
    loadChildren: () => import('./pages/health-declaration/health-declaration.module')
      .then((m) => m.HealthDeclarationPageModule),
  },
  {
    path: TestFlowPageNames.CONFIRM_TEST_DETAILS_PAGE,
    loadChildren: () => import('./pages/confirm-test-details/confirm-test-details.module')
      .then((m) => m.ConfirmTestDetailsPageModule),
  },
  {
    path: TestFlowPageNames.POST_DEBRIEF_HOLDING_PAGE,
    loadChildren: () => import('./pages/post-debrief-holding/post-debrief-holding.module')
      .then((m) => m.PostDebriefHoldingPageModule),
  },
  {
    path: TestFlowPageNames.NON_PASS_FINALISATION_PAGE,
    loadChildren: () => import('./pages/non-pass-finalisation/non-pass-finalisation.module')
      .then((m) => m.NonPassFinalisationPageModule),
  },
  ...Waiting_Room_Route,
  ...Waiting_Room_To_Car_Route,
  ...Test_Report_Route,
  ...Debrief_Route,
  ...Pass_Finalisation_Route,
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
