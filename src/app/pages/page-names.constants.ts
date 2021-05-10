import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';

export const CANDIDATE_DETAILS_PAGE = 'CandidateDetailsPage';
export const FAKE_CANDIDATE_DETAILS_PAGE = 'FakeCandidateDetailsPage';
export const FAKE_JOURNAL_PAGE = 'FakeJournalPage';
export const JOURNAL_PAGE = 'JournalPage';
export const TEST_CENTRE_JOURNAL_PAGE = 'TestCentreJournalPage';
export const LOGIN_PAGE = 'LoginPage';
export const JOURNAL_FORCE_CHECK_MODAL = 'JournalForceCheckModal';
export const JOURNAL_EARLY_START_MODAL = 'JournalEarlyStartModal';
export const ERROR_PAGE = 'ErrorPage';
export const DASHBOARD_PAGE = 'DashboardPage';
export const REKEY_SEARCH_PAGE = 'RekeySearchPage';
export const TEST_RESULTS_SEARCH_PAGE = 'TestResultsSearchPage';
export const LEGAL_REQUIREMENTS_MODAL = 'LegalRequirementsModal';
export const SPECIAL_REQUIREMENT_MODAL = 'SpecialLegalRequirementModal';
export const REVERSE_DIAGRAM_PAGE = 'ReverseDiagramPage';
export const DELEGATED_REKEY_SEARCH_PAGE = 'DelegatedRekeySearchPage';
export const DELEGATED_REKEY_UPLOAD_OUTCOME_PAGE = 'DelegatedRekeyUploadOutcomePage';

export const CAT_B: BasePageNames = {
  DEBRIEF_PAGE: 'DebriefCatBPage',
  OFFICE_PAGE: 'OfficeCatBPage',
  PASS_FINALISATION_PAGE: 'PassFinalisationCatBPage',
  TEST_REPORT_PAGE: 'TestReportCatBPage',
  WAITING_ROOM_TO_CAR_PAGE: 'WaitingRoomToCarCatBPage',
  VIEW_TEST_RESULT_PAGE: 'ViewTestResultCatBPage',
};

export const CAT_BE: BasePageNames = {
  DEBRIEF_PAGE: 'DebriefCatBEPage',
  OFFICE_PAGE: 'OfficeCatBEPage',
  PASS_FINALISATION_PAGE: 'PassFinalisationCatBEPage',
  TEST_REPORT_PAGE: 'TestReportCatBEPage',
  WAITING_ROOM_TO_CAR_PAGE: 'WaitingRoomToCarCatBEPage',
  VEHICLE_CHECKS_MODAL: 'VehicleChecksCatBEModal',
  VIEW_TEST_RESULT_PAGE: 'ViewTestResultCatBEPage',
};

export const CAT_C: BasePageNames = {
  DEBRIEF_PAGE: 'DebriefCatCPage',
  OFFICE_PAGE: 'OfficeCatCPage',
  PASS_FINALISATION_PAGE: 'PassFinalisationCatCPage',
  TEST_REPORT_PAGE: 'TestReportCatCPage',
  WAITING_ROOM_TO_CAR_PAGE: 'WaitingRoomToCarCatCPage',
  VEHICLE_CHECKS_MODAL: 'VehicleChecksCatCModal',
  VIEW_TEST_RESULT_PAGE: 'ViewTestResultCatCPage',
};

export const CAT_A_MOD1: BasePageNames = {
  DEBRIEF_PAGE: 'DebriefCatAMod1Page',
  OFFICE_PAGE: 'OfficeCatAMod1Page',
  PASS_FINALISATION_PAGE: 'PassFinalisationCatAMod1Page',
  REVERSE_DIAGRAM_PAGE: 'ReverseDiagramCatAMod1Page',
  TEST_REPORT_PAGE: 'TestReportCatAMod1Page',
  WAITING_ROOM_TO_CAR_PAGE: 'WaitingRoomToCarCatAMod1Page',
  VEHICLE_CHECKS_MODAL: 'VehicleChecksCatAMod1Modal',
  VIEW_TEST_RESULT_PAGE: 'ViewTestResultCatAMod1Page',
};

export const CAT_A_MOD2: BasePageNames = {
  DEBRIEF_PAGE: 'DebriefCatAMod2Page',
  OFFICE_PAGE: 'OfficeCatAMod2Page',
  PASS_FINALISATION_PAGE: 'PassFinalisationCatAMod2Page',
  TEST_REPORT_PAGE: 'TestReportCatAMod2Page',
  WAITING_ROOM_TO_CAR_PAGE: 'WaitingRoomToCarCatAMod2Page',
  VEHICLE_CHECKS_MODAL: 'VehicleChecksCatAMod2Modal',
  VIEW_TEST_RESULT_PAGE: 'ViewTestResultCatAMod2Page',
};

export const CAT_D: BasePageNames = {
  DEBRIEF_PAGE: 'DebriefCatDPage',
  OFFICE_PAGE: 'OfficeCatDPage',
  PASS_FINALISATION_PAGE: 'PassFinalisationCatDPage',
  TEST_REPORT_PAGE: 'TestReportCatDPage',
  WAITING_ROOM_TO_CAR_PAGE: 'WaitingRoomToCarCatDPage',
  VEHICLE_CHECKS_MODAL: 'VehicleChecksCatDModal',
  VIEW_TEST_RESULT_PAGE: 'ViewTestResultCatDPage',
};

export const CAT_HOME_TEST: BasePageNames = {
  DEBRIEF_PAGE: 'DebriefCatHomeTestPage',
  OFFICE_PAGE: 'OfficeCatHomeTestPage',
  PASS_FINALISATION_PAGE: 'PassFinalisationCatHomeTestPage',
  TEST_REPORT_PAGE: 'TestReportCatHomeTestPage',
  WAITING_ROOM_TO_CAR_PAGE: 'WaitingRoomToCarCatHomeTestPage',
  VEHICLE_CHECKS_MODAL: 'VehicleChecksCatHomeTestModal',
  VIEW_TEST_RESULT_PAGE: 'ViewTestResultCatHomeTestPage',
};

export const CAT_ADI_PART2: BasePageNames = {
  DEBRIEF_PAGE: 'DebriefCatADIPart2Page',
  OFFICE_PAGE: 'OfficeCatADIPart2Page',
  PASS_FINALISATION_PAGE: 'PassFinalisationCatADIPart2Page',
  TEST_REPORT_PAGE: 'TestReportCatADIPart2Page',
  WAITING_ROOM_TO_CAR_PAGE: 'WaitingRoomToCarCatADIPart2Page',
  VEHICLE_CHECKS_MODAL: 'VehicleChecksCatADIPart2Modal',
  VIEW_TEST_RESULT_PAGE: 'ViewTestResultCatADIPart2Page',
};

export const CAT_CPC: BasePageNames = {
  DEBRIEF_PAGE: 'DebriefCatCPCPage',
  OFFICE_PAGE: 'OfficeCatCPCPage',
  TEST_REPORT_PAGE: 'TestReportCatCPCPage',
  WAITING_ROOM_TO_CAR_PAGE: 'WaitingRoomToCarCatCPCPage',
  PASS_FINALISATION_PAGE: 'PassFinalisationCatCPCPage',
  VIEW_TEST_RESULT_PAGE: 'ViewTestResultCatCPCPage',
};

type BasePageNames = {
  [key in PageNameKeys]?: string;
};

export type PageNameKeys =
  'BackToOfficePage' |
  'CommunicationPage' |
  'DEBRIEF_PAGE' |
  'HealthDeclarationPage' |
  'OFFICE_PAGE' |
  'TEST_REPORT_PAGE' |
  'WAITING_ROOM_PAGE' |
  'WAITING_ROOM_TO_CAR_PAGE' |
  'RekeyReasonPage' |
  'PASS_FINALISATION_PAGE' |
  'NonPassFinalisationPage' |
  'VIEW_TEST_RESULT_PAGE' |
  'PostDebriefHoldingPage' |
  'VEHICLE_CHECKS_MODAL' |
  'REVERSE_DIAGRAM_PAGE' |
  'ConfirmTestDetailsPage' |
  'RekeyUploadOutcomePage';

export enum TestFlowPageNames {
  BACK_TO_OFFICE_PAGE = 'BackToOfficePage',
  COMMUNICATION_PAGE = 'CommunicationPage',
  DEBRIEF_PAGE = 'DEBRIEF_PAGE',
  HEALTH_DECLARATION_PAGE = 'HealthDeclarationPage',
  NON_PASS_FINALISATION_PAGE = 'NonPassFinalisationPage',
  OFFICE_PAGE = 'OFFICE_PAGE',
  PASS_FINALISATION_PAGE = 'PASS_FINALISATION_PAGE',
  POST_DEBRIEF_HOLDING_PAGE = 'PostDebriefHoldingPage',
  REKEY_REASON_PAGE = 'RekeyReasonPage',
  TEST_REPORT_PAGE = 'TEST_REPORT_PAGE',
  WAITING_ROOM_PAGE = 'WAITING_ROOM_PAGE',
  WAITING_ROOM_TO_CAR_PAGE = 'WAITING_ROOM_TO_CAR_PAGE',
  CONFIRM_TEST_DETAILS_PAGE = 'ConfirmTestDetailsPage',
  REKEY_UPLOAD_OUTCOME_PAGE = 'RekeyUploadOutcomePage',
}

/**
 * Return correct page constant based upon category
 * @param category
 * @param pageNameKey
 */
export function getPageNameByCategoryAndKey(category: TestCategory, pageNameKey: PageNameKeys): string {
  switch (category) {
    case TestCategory.ADI2:
      return CAT_ADI_PART2[pageNameKey];
    case TestCategory.B:
      return CAT_B[pageNameKey];
    case TestCategory.BE:
      return CAT_BE[pageNameKey];
    case TestCategory.C:
    case TestCategory.C1:
    case TestCategory.CE:
    case TestCategory.C1E:
      return CAT_C[pageNameKey];
    case TestCategory.CCPC:
    case TestCategory.DCPC:
      return CAT_CPC[pageNameKey];
    case TestCategory.D:
    case TestCategory.D1:
    case TestCategory.DE:
    case TestCategory.D1E:
      return CAT_D[pageNameKey];
    case TestCategory.F:
    case TestCategory.G:
    case TestCategory.H:
    case TestCategory.K:
      return CAT_HOME_TEST[pageNameKey];
    case TestCategory.EUA1M1:
    case TestCategory.EUA2M1:
    case TestCategory.EUAM1:
    case TestCategory.EUAMM1:
      return CAT_A_MOD1[pageNameKey];
    case TestCategory.EUA1M2:
    case TestCategory.EUA2M2:
    case TestCategory.EUAM2:
    case TestCategory.EUAMM2:
      return CAT_A_MOD2[pageNameKey];
    default:
  }
}
