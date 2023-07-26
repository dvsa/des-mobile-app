import { ExaminerRole, TestPermissionPeriod } from '@dvsa/mes-config-schema/remote-config';

export type AppConfig = {
  liveAppVersion: string;
  configUrl: string;
  sentry?: {
    dsn: string;
    environment: string;
  },
  googleAnalyticsId: string,
  daysToCacheLogs: number,
  logoutClearsTestPersistence?: boolean;
  logsPostApiKey: string;
  taxMotApiKey: string;
  logsApiUrl: string;
  logsAutoSendInterval: number;
  authentication: {
    context: string,
    resourceUrl: string,
    clientId: string,
    redirectUrl: string,
    logoutUrl: string,
    employeeIdKey: string,
    employeeNameKey: string,
  },
  approvedDeviceIdentifiers: string[],
  timeTravelDate?: string,
  role: ExaminerRole;
  journal: {
    journalUrl: string,
    searchBookingUrl: string,
    delegatedExaminerSearchBookingUrl: string,
    teamJournalUrl: string,
    autoRefreshInterval: number
    numberOfDaysToView: number,
    daysToCacheJournalData: number,
    allowTests: boolean,
    allowedTestCategories: string[],
    enableTestReportPracticeMode: boolean,
    enableEndToEndPracticeMode: boolean,
    enablePracticeModeAnalytics: boolean,
    enableLogoutButton: boolean,
    testPermissionPeriods: TestPermissionPeriod[],
  },
  tests: {
    testSubmissionUrl: string,
    autoSendInterval: number,
  },
  user: {
    findUserUrl: string,
  }
  driver: {
    photographUrl: string;
    signatureUrl: string;
    standardUrl: string;
  },
  vehicle: {
    taxMotUrl: string,
  },
  refData: {
    testCentreUrl: string,
  },
  requestTimeout: number
};
