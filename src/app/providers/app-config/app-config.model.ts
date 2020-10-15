// import { ExaminerRole, TestPermissionPeriod } from '@dvsa/mes-config-schema/remote-config';

// TODO Strip down

export type AppConfig = {
  configUrl: string
  googleAnalyticsId: string,
  daysToCacheLogs: number,
  logoutClearsTestPersistence?: boolean;
  logsPostApiKey: string;
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
  role: any;
  journal: {
    journalUrl: string,
    searchBookingUrl: string,
    delegatedExaminerSearchBookingUrl: string,
    autoRefreshInterval: number
    numberOfDaysToView: number,
    daysToCacheJournalData: number,
    allowTests: boolean,
    allowedTestCategories: string[],
    enableTestReportPracticeMode: boolean,
    enableEndToEndPracticeMode: boolean,
    enableLogoutButton: boolean,
    testPermissionPeriods: any[],
  },
  tests: {
    testSubmissionUrl: string,
    autoSendInterval: number,
  },
  user: {
    findUserUrl: string,
  }
  requestTimeout: number
};
