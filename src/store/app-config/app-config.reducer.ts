import { createReducer, createFeatureSelector, on } from '@ngrx/store';

import { AppConfig } from '@providers/app-config/app-config.model';
import { LoadAppConfig } from './app-config.actions';

export const appConfigFeatureKey = 'appConfig';

export const initialState: AppConfig = {
  configUrl: null,
  googleAnalyticsId: null,
  daysToCacheLogs: null,
  logoutClearsTestPersistence: null,
  logsPostApiKey: null,
  logsApiUrl: null,
  logsAutoSendInterval: null,
  authentication: {
    context: null,
    resourceUrl: null,
    clientId: null,
    redirectUrl: null,
    logoutUrl: null,
    employeeIdKey: null,
    employeeNameKey: null,
  },
  sentry: {
    dsn: null,
    environment: null,
  },
  approvedDeviceIdentifiers: [],
  timeTravelDate: null,
  role: null,
  journal: {
    journalUrl: null,
    searchBookingUrl: null,
    delegatedExaminerSearchBookingUrl: null,
    teamJournalUrl: null,
    autoRefreshInterval: null,
    numberOfDaysToView: null,
    daysToCacheJournalData: null,
    allowTests: null,
    allowedTestCategories: [],
    enableTestReportPracticeMode: null,
    enableEndToEndPracticeMode: null,
    enableLogoutButton: null,
    testPermissionPeriods: [],
  },
  tests: {
    testSubmissionUrl: null,
    autoSendInterval: null,
  },
  user: {
    findUserUrl: null,
  },
  requestTimeout: null,
};

export const appConfigReducer = createReducer(
  initialState,
  on(LoadAppConfig, (state: AppConfig, { appConfig }) => {
    if (appConfig) {
      return {
        ...state,
        ...appConfig,
      };
    }
    return state;
  }),
);

export const getAppConfigState = createFeatureSelector<AppConfig>('appConfig');
