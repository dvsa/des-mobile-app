import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {
  DASHBOARD_PAGE,
  DELEGATED_REKEY_SEARCH_PAGE,
  DELEGATED_REKEY_UPLOAD_OUTCOME_PAGE,
  FAKE_JOURNAL_PAGE,
  JOURNAL_PAGE,
  LOGIN_PAGE,
  REKEY_SEARCH_PAGE,
  TEST_CENTRE_JOURNAL_PAGE,
  TEST_RESULTS_SEARCH_PAGE,
  TestFlowPageNames,
  UNUPLOADED_TESTS_PAGE,
} from '@pages/page-names.constants';
import { Waiting_Room_To_Car_Route } from './routing/waiting-room-to-car-route';
import { Test_Report_Route } from './routing/test-report-route';
import { Pass_Finalisation_Route } from './routing/pass-finalisation-route';
import { Office_Route } from './routing/office-route';

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
    path: UNUPLOADED_TESTS_PAGE,
    loadChildren: () => import('./pages/unuploaded-tests/unuploaded-tests.module').then((m) => m.UnuploadedTestsModule),
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
    path: FAKE_JOURNAL_PAGE,
    loadChildren: () => import('./pages/fake-journal/fake-journal.module').then((m) => m.FakeJournalPageModule),
  },
  {
    path: TEST_CENTRE_JOURNAL_PAGE,
    loadChildren: () => import('./pages/test-centre-journal/test-centre-journal.module')
      .then((m) => m.TestCentreJournalModule),
  },
  {
    path: TEST_RESULTS_SEARCH_PAGE,
    loadChildren: () => import('./pages/test-results-search/test-results-search.module')
      .then((m) => m.TestResultsSearchPageModule),
  },
  {
    path: REKEY_SEARCH_PAGE,
    loadChildren: () => import('./pages/rekey-search/rekey-search.module').then((m) => m.RekeySearchPageModule),
  },
  {
    path: DELEGATED_REKEY_SEARCH_PAGE,
    loadChildren: () => import('./pages/delegated-rekey-search/delegated-rekey-search.module')
      .then((m) => m.DelegatedRekeySearchPageModule),
  },
  {
    path: DELEGATED_REKEY_UPLOAD_OUTCOME_PAGE,
    loadChildren: () => import('./pages/delegated-rekey-upload-outcome/delegated-rekey-upload-outcome.module')
      .then((m) => m.DelegatedRekeyUploadOutcomePageModule),
  },
  {
    path: TestFlowPageNames.DEBRIEF_PAGE,
    loadChildren: () => import('./pages/debrief/debrief.module').then((m) => m.DebriefPageModule),
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
  {
    path: TestFlowPageNames.BACK_TO_OFFICE_PAGE,
    loadChildren: () => import('./pages/back-to-office/back-to-office.module')
      .then((m) => m.BackToOfficePageModule),
  },
  {
    path: TestFlowPageNames.REKEY_REASON_PAGE,
    loadChildren: () => import('./pages/rekey-reason/rekey-reason.module')
      .then((m) => m.RekeyReasonPageModule),
  },
  {
    path: TestFlowPageNames.REKEY_UPLOAD_OUTCOME_PAGE,
    loadChildren: () => import('./pages/rekey-upload-outcome/rekey-upload-outcome.module')
      .then((m) => m.RekeyUploadOutcomePageModule),
  },
  {
    path: TestFlowPageNames.WAITING_ROOM_PAGE,
    loadChildren: () => import('./pages/waiting-room/waiting-room.module')
      .then((m) => m.WaitingRoomPageModule),
  },
  {
    path: TestFlowPageNames.TEST_REPORT_DASHBOARD_PAGE,
    loadChildren: () => import('@pages/test-report-dashboard/test-report-dashboard.module')
      .then((m) => m.TestReportDashboardPageModule),
  },
  {
    path: TestFlowPageNames.CANDIDATE_LICENCE_PAGE,
    loadChildren: () => import('@pages/candidate-licence/candidate-licence.module')
      .then((m) => m.CandidateLicencePageModule),
  },
  ...Waiting_Room_To_Car_Route,
  ...Test_Report_Route,
  ...Pass_Finalisation_Route,
  ...Office_Route,
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
