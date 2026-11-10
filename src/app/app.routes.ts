import { Routes } from '@angular/router';
import type { CommunicationPage } from '@pages/communication/communication.page';
import type { HealthDeclarationPage } from '@pages/health-declaration/health-declaration.page';
import { NonPassFinalisationResolver } from '@pages/non-pass-finalisation/non-pass-finalisation.resolver';
import {
  DASHBOARD_PAGE,
  DELEGATED_REKEY_SEARCH_PAGE,
  DELEGATED_REKEY_UPLOAD_OUTCOME_PAGE,
  EXAMINER_RECORDS,
  FAKE_JOURNAL_PAGE,
  JOURNAL_PAGE,
  LOGIN_PAGE,
  PASS_CERTIFICATES,
  REKEY_SEARCH_PAGE,
  TEST_CENTRE_JOURNAL_PAGE,
  TEST_RESULTS_SEARCH_PAGE,
  TestFlowPageNames,
  UNUPLOADED_TESTS_PAGE,
  USEFUL_LINKS_PAGE,
} from '@pages/page-names.constants';
import type { WaitingRoomPage } from '@pages/waiting-room/waiting-room.page';
import { Office_Route } from './routing/office-route';
import { Pass_Finalisation_Route } from './routing/pass-finalisation-route';
import { Test_Report_Route } from './routing/test-report-route';
import { Waiting_Room_To_Car_Route } from './routing/waiting-room-to-car-route';

export const routes: Routes = [
  {
    path: '',
    redirectTo: LOGIN_PAGE,
    pathMatch: 'full',
  },
  {
    path: DASHBOARD_PAGE,
    loadComponent: () => import('./pages/dashboard/dashboard.page').then((m) => m.DashboardPage),
  },
  {
    path: UNUPLOADED_TESTS_PAGE,
    loadComponent: () => import('./pages/unuploaded-tests/unuploaded-tests.page').then((m) => m.UnuploadedTestsPage),
  },
  {
    path: USEFUL_LINKS_PAGE,
    loadComponent: () => import('./pages/useful-links/useful-links.page').then((m) => m.UsefulLinksPage),
  },
  {
    path: PASS_CERTIFICATES,
    loadComponent: () => import('@pages/pass-certificates/pass-certificates.page').then((m) => m.PassCertificatesPage),
  },
  {
    path: EXAMINER_RECORDS,
    loadComponent: () => import('@pages/examiner-records/examiner-records.page').then((m) => m.ExaminerRecordsPage),
  },
  {
    path: LOGIN_PAGE,
    loadComponent: () => import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: JOURNAL_PAGE,
    loadComponent: () => import('./pages/journal/journal.page').then((m) => m.JournalPage),
  },
  {
    path: FAKE_JOURNAL_PAGE,
    loadComponent: () => import('./pages/fake-journal/fake-journal.page').then((m) => m.FakeJournalPage),
  },
  {
    path: TEST_CENTRE_JOURNAL_PAGE,
    loadComponent: () =>
      import('./pages/test-centre-journal/test-centre-journal.page').then((m) => m.TestCentreJournalPage),
  },
  {
    path: TEST_RESULTS_SEARCH_PAGE,
    loadComponent: () => import('./pages/test-results-search/test-results-search').then((m) => m.TestResultsSearchPage),
  },
  {
    path: REKEY_SEARCH_PAGE,
    loadComponent: () => import('./pages/rekey-search/rekey-search').then((m) => m.RekeySearchPage),
  },
  {
    path: DELEGATED_REKEY_SEARCH_PAGE,
    loadComponent: () =>
      import('./pages/delegated-rekey-search/delegated-rekey-search').then((m) => m.DelegatedRekeySearchPage),
  },
  {
    path: DELEGATED_REKEY_UPLOAD_OUTCOME_PAGE,
    loadComponent: () =>
      import('./pages/delegated-rekey-upload-outcome/delegated-rekey-upload-outcome').then(
        (m) => m.DelegatedRekeyUploadOutcomePage
      ),
  },
  {
    path: TestFlowPageNames.DEBRIEF_PAGE,
    loadComponent: () => import('./pages/debrief/debrief.page').then((m) => m.DebriefPage),
  },
  {
    path: TestFlowPageNames.COMMUNICATION_PAGE,
    canDeactivate: [
      (component: CommunicationPage, _currentRoute, _currentState, nextState) =>
        nextState.url.includes(TestFlowPageNames.CANDIDATE_LICENCE_PAGE) ? component.canDeActivate() : true,
    ],
    loadComponent: () => import('./pages/communication/communication.page').then((m) => m.CommunicationPage),
  },
  {
    path: TestFlowPageNames.HEALTH_DECLARATION_PAGE,
    canDeactivate: [(component: HealthDeclarationPage) => component.canDeActivate()],
    loadComponent: () =>
      import('./pages/health-declaration/health-declaration.page').then((m) => m.HealthDeclarationPage),
  },
  {
    path: TestFlowPageNames.CONFIRM_TEST_DETAILS_PAGE,
    loadComponent: () =>
      import('./pages/confirm-test-details/confirm-test-details.page').then((m) => m.ConfirmTestDetailsPage),
  },
  {
    path: TestFlowPageNames.POST_DEBRIEF_HOLDING_PAGE,
    loadComponent: () =>
      import('./pages/post-debrief-holding/post-debrief-holding.page').then((m) => m.PostDebriefHoldingPage),
  },
  {
    path: TestFlowPageNames.NON_PASS_FINALISATION_PAGE,
    resolve: { nonPassData: NonPassFinalisationResolver },
    loadComponent: () =>
      import('./pages/non-pass-finalisation/non-pass-finalisation.page').then((m) => m.NonPassFinalisationPage),
  },
  {
    path: TestFlowPageNames.BACK_TO_OFFICE_PAGE,
    loadComponent: () => import('./pages/back-to-office/back-to-office.page').then((m) => m.BackToOfficePage),
  },
  {
    path: TestFlowPageNames.REKEY_REASON_PAGE,
    loadComponent: () => import('./pages/rekey-reason/rekey-reason.page').then((m) => m.RekeyReasonPage),
  },
  {
    path: TestFlowPageNames.REKEY_UPLOAD_OUTCOME_PAGE,
    loadComponent: () =>
      import('./pages/rekey-upload-outcome/rekey-upload-outcome.page').then((m) => m.RekeyUploadOutcomePage),
  },
  {
    path: TestFlowPageNames.WAITING_ROOM_PAGE,
    canDeactivate: [
      (component: WaitingRoomPage, _currentRoute, _currentState, nextState) =>
        nextState.url.includes(JOURNAL_PAGE) ? component.canDeActivate() : true,
    ],
    loadComponent: () => import('./pages/waiting-room/waiting-room.page').then((m) => m.WaitingRoomPage),
  },
  {
    path: TestFlowPageNames.TEST_REPORT_DASHBOARD_PAGE,
    loadComponent: () =>
      import('@pages/test-report-dashboard/test-report-dashboard.page').then((m) => m.TestReportDashboardPage),
  },
  {
    path: TestFlowPageNames.CANDIDATE_LICENCE_PAGE,
    loadComponent: () => import('@pages/candidate-licence/candidate-licence.page').then((m) => m.CandidateLicencePage),
  },
  ...Waiting_Room_To_Car_Route,
  ...Test_Report_Route,
  ...Pass_Finalisation_Route,
  ...Office_Route,
];
