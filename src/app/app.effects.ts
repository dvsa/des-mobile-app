import { ExitSingleAppModeAnalyticsEffects } from '@components/common/test-flow-header/exit-sam.analytics.effects';
import { ExitSingleAppModeEffects } from '@components/common/test-flow-header/exit-sam.effects';
import { provideEffects } from '@ngrx/effects';
import { BackToOfficeAnalyticsEffects } from '@pages/back-to-office/back-to-office.analytics.effects';
import { BackToOfficeEffects } from '@pages/back-to-office/back-to-office.effects';
import { CandidateDetailsAnalyticsEffects } from '@pages/candidate-details/candidate-details.analytics.effects';
import { CandidateLicenceAnalyticsEffects } from '@pages/candidate-licence/candidate-licence.analytics.effects';
import { CandidateLicenceEffects } from '@pages/candidate-licence/candidate-licence.effects';
import { CommunicationAnalyticsEffects } from '@pages/communication/communication.analytics.effects';
import { CommunicationEffects } from '@pages/communication/communication.effects';
import { ConfirmTestDetailsAnalyticsEffects } from '@pages/confirm-test-details/confirm-test-details.analytics.effects';
import { DashboardAnalyticsEffects } from '@pages/dashboard/dashboard.analytics.effects';
import { DebriefAnalyticsEffects } from '@pages/debrief/debrief.analytics.effects';
import { DebriefEffects } from '@pages/debrief/debrief.effects';
import { DelegatedRekeySearchEffects } from '@pages/delegated-rekey-search/delegated-rekey-search.effects';
import { ExaminerRecordsAnalyticsEffects } from '@pages/examiner-records/examiner-records.analytics.effects';
import { ExaminerRecordsEffects } from '@pages/examiner-records/examiner-records.effects';
import { FakeJournalAnalyticsEffects } from '@pages/fake-journal/fake-journal.analytics.effects';
import { FakeJournalEffects } from '@pages/fake-journal/fake-journal.effects';
import { HealthDeclarationAnalyticsEffects } from '@pages/health-declaration/health-declaration.analytics.effects';
import { HealthDeclarationEffects } from '@pages/health-declaration/health-declaration.effects';
import { JournalAnalyticsEffects } from '@pages/journal/journal.analytics.effects';
import { LoginPageAnalyticsEffects } from '@pages/login/login-page.analytics.effects';
import { NonPassFinalisationAnalyticsEffects } from '@pages/non-pass-finalisation/non-pass-finalisation.analytics.effects';
import { OfficeAnalyticsEffects } from '@pages/office/office.analytics.effects';
import { OfficeEffects } from '@pages/office/office.effects';
import { PassCertificatesAnalyticsEffects } from '@pages/pass-certificates/pass-certificates.analytics.effects';
import { PassFinalisationAnalyticsEffects } from '@pages/pass-finalisation/pass-finalisation.analytics.effects';
import { PostDebriefHoldingAnalyticsEffects } from '@pages/post-debrief-holding/post-debrief-holding.analytics.effects';
import { RekeyReasonAnalyticsEffects } from '@pages/rekey-reason/rekey-reason.analytics.effects';
import { RekeyReasonEffects } from '@pages/rekey-reason/rekey-reason.effects';
import { RekeySearchAnalyticsEffects } from '@pages/rekey-search/rekey-search.analytics.effects';
import { RekeySearchEffects } from '@pages/rekey-search/rekey-search.effects';
import { RekeyUploadOutcomeAnalyticsEffects } from '@pages/rekey-upload-outcome/rekey-upload-outcome.analytics.effects';
import { TestCentreJournalAnalyticsEffects } from '@pages/test-centre-journal/test-centre-journal.analytics.effects';
import { TestReportDashboardAnalyticsEffects } from '@pages/test-report-dashboard/test-report-dashboard.analytics.effects';
import { ReverseDiagramModalAnalyticsEffects } from '@pages/test-report/components/reverse-diagram-modal/reverse-diagram-modal.analytics.effects';
import { TestReportAnalyticsEffects } from '@pages/test-report/test-report.analytics.effects';
import { TestReportEffects } from '@pages/test-report/test-report.effects';
import { TestResultsSearchAnalyticsEffects } from '@pages/test-results-search/test-results-search.analytics.effects';
import { UnuploadedTestsAnalyticsEffects } from '@pages/unuploaded-tests/unuploaded-tests.analytics.effects';
import { UnuploadedTestsEffects } from '@pages/unuploaded-tests/unuploaded-tests.effects';
import { LinkModalAnalyticsEffects } from '@pages/useful-links/components/link-modal/link-modal.analytics.effects';
import { UsefulLinksAnalyticsEffects } from '@pages/useful-links/useful-links.analytics.effects';
import { ViewTestResultAnalyticsEffects } from '@pages/view-test-result/view-test-result.analytics.effects';
import { VehicleChecksModalCatAMod2AnalyticsEffects } from '@pages/waiting-room-to-car/cat-a-mod2/components/vehicle-checks-modal/vehicle-checks-modal.cat-a-mod2.analytics.effects';
import { VehicleChecksModalAnalyticsEffects } from '@pages/waiting-room-to-car/cat-adi-part2/components/vehicle-checks-modal/vehicle-checks-modal.cat-adi-part2.analytics.effects';
import { VehicleChecksModalCatCAnalyticsEffects } from '@pages/waiting-room-to-car/cat-c/components/vehicle-checks-modal/vehicle-checks-modal.cat-c.analytics.effects';
import { VehicleChecksModalCatDAnalyticsEffects } from '@pages/waiting-room-to-car/cat-d/components/vehicle-checks-modal/vehicle-checks-modal.cat-d.analytics.effects';
import { VehicleChecksModalCatHomeTestAnalyticsEffects } from '@pages/waiting-room-to-car/cat-home-test/components/vehicle-checks-modal/vehicle-checks-modal.cat-home-test.analytics.effects';
import { WaitingRoomToCarAnalyticsEffects } from '@pages/waiting-room-to-car/waiting-room-to-car.analytics.effects';
import { WaitingRoomAnalyticsEffects } from '@pages/waiting-room/waiting-room.analytics.effects';
import { AuthenticationAnalyticsEffects } from '@providers/authentication/authentication.analytics.effects';
import { LogoutBasePageAnalyticsEffects } from '@shared/classes/logout-base-page/logout-base-page.analytics.effects';
import { AppConfigEffects } from '@store/app-config/app-config.effects';
import { AppInfoEffects } from '@store/app-info/app-info.effects';
import { SafetyRecallAnalyticsEffects } from '@store/general/safety-recall/safety-recall.analytics.effects';
import { JournalEffects } from '@store/journal/journal.effects';
import { JournalLogsEffects } from '@store/journal/journal.logs.effects';
import { LogsEffects } from '@store/logs/logs.effects';
import { ReferenceDataEffects } from '@store/reference-data/reference-data.effects';
import { TestCentreJournalEffects } from '@store/test-centre-journal/test-centre-journal.effects';
import { AccompanimentAnalyticsEffects } from '@store/tests/accompaniment/accompaniment.analytics.effects';
import { ExaminerBookedEffects } from '@store/tests/examiner-booked/examiner-booked.effects';
import { ExaminerConductedEffects } from '@store/tests/examiner-conducted/examiner-conducted.effects';
import { PreTestDeclarationsAnalyticsEffects } from '@store/tests/pre-test-declarations/pre-test-declarations.analytics.effects';
import { EyesightTestAnalyticsEffects } from '@store/tests/test-data/common/eyesight-test/eyesight-test.analytics.effects';
import { TestDataEffects } from '@store/tests/test-data/test-data.effects';
import { TestStatusAnalyticsEffects } from '@store/tests/test-status/test-status.analytics.effects';
import { TestsAnalyticsEffects } from '@store/tests/tests.analytics.effects';
import { TestsEffects } from '@store/tests/tests.effects';
import { UserExitedAppAnalyticsEffects } from '@store/tests/user-exited-app/user-exited-app.analytics.effects';
import { VehicleDetailsAnalyticsEffects } from '@store/tests/vehicle-details/vehicle-details.analytics.effects';

// Register all application effects here, including page and modal effects.
export const appEffects = provideEffects(
  BackToOfficeAnalyticsEffects,
  BackToOfficeEffects,
  CandidateDetailsAnalyticsEffects,
  CandidateLicenceAnalyticsEffects,
  CandidateLicenceEffects,
  CommunicationEffects,
  ConfirmTestDetailsAnalyticsEffects,
  DashboardAnalyticsEffects,
  DebriefAnalyticsEffects,
  DebriefEffects,
  DelegatedRekeySearchEffects,
  ExaminerRecordsAnalyticsEffects,
  HealthDeclarationAnalyticsEffects,
  HealthDeclarationEffects,
  JournalAnalyticsEffects,
  NonPassFinalisationAnalyticsEffects,
  OfficeAnalyticsEffects,
  OfficeEffects,
  PassCertificatesAnalyticsEffects,
  PassFinalisationAnalyticsEffects,
  PostDebriefHoldingAnalyticsEffects,
  RekeyReasonAnalyticsEffects,
  RekeyReasonEffects,
  RekeySearchAnalyticsEffects,
  RekeySearchEffects,
  RekeyUploadOutcomeAnalyticsEffects,
  TestCentreJournalAnalyticsEffects,
  TestReportDashboardAnalyticsEffects,
  ReverseDiagramModalAnalyticsEffects,
  TestResultsSearchAnalyticsEffects,
  UnuploadedTestsAnalyticsEffects,
  UnuploadedTestsEffects,
  LinkModalAnalyticsEffects,
  UsefulLinksAnalyticsEffects,
  ViewTestResultAnalyticsEffects,
  VehicleChecksModalCatAMod2AnalyticsEffects,
  VehicleChecksModalAnalyticsEffects,
  VehicleChecksModalCatCAnalyticsEffects,
  VehicleChecksModalCatDAnalyticsEffects,
  VehicleChecksModalCatHomeTestAnalyticsEffects,
  WaitingRoomToCarAnalyticsEffects,
  WaitingRoomAnalyticsEffects,
  CommunicationAnalyticsEffects,
  ExitSingleAppModeEffects,
  ExitSingleAppModeAnalyticsEffects,
  LogoutBasePageAnalyticsEffects,
  LoginPageAnalyticsEffects,
  AuthenticationAnalyticsEffects,
  EyesightTestAnalyticsEffects,
  AccompanimentAnalyticsEffects,
  VehicleDetailsAnalyticsEffects,
  FakeJournalEffects,
  FakeJournalAnalyticsEffects,
  SafetyRecallAnalyticsEffects,
  AppConfigEffects,
  AppInfoEffects,
  ReferenceDataEffects,
  TestsEffects,
  TestsAnalyticsEffects,
  TestDataEffects,
  TestReportEffects,
  TestReportAnalyticsEffects,
  ExaminerBookedEffects,
  ExaminerConductedEffects,
  TestStatusAnalyticsEffects,
  PreTestDeclarationsAnalyticsEffects,
  UserExitedAppAnalyticsEffects,
  ExaminerRecordsEffects,
  JournalEffects,
  JournalLogsEffects,
  TestCentreJournalEffects,
  LogsEffects
);
