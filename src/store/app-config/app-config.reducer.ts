import { createFeatureSelector, createReducer, on } from '@ngrx/store';

import { RemoteConfig } from '@dvsa/mes-config-schema/remote-config';
import { AppConfig } from '@providers/app-config/app-config.model';
import { LoadAppConfig, LoadRemoteConfig, UnloadConfig } from './app-config.actions';

export type AppConfigStateModel = {
  appConfiguration: AppConfig;
  remoteConfiguration: RemoteConfig;
};

export const appConfigFeatureKey = 'appConfig';

export const initialState: AppConfigStateModel = {
  appConfiguration: {
    liveAppVersion: null,
    configUrl: null,
    googleAnalyticsId: null,
    googleAnalyticsKey: null,
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
      enablePracticeModeAnalytics: null,
      testPermissionPeriods: [],
    },
    tests: {
      testSubmissionUrl: null,
      multipleTestResultsUrl: null,
      autoSendInterval: null,
      examinerRecordsUrl: null,
    },
    user: {
      findUserUrl: null,
    },
    driver: {
      photographUrl: null,
      signatureUrl: null,
      standardUrl: null,
    },
    mot: {
      motHistoryUrl: null,
    },
    refData: {
      testCentreUrl: null,
    },
    usefulLinks: null,
    requestTimeout: null,
  },
  remoteConfiguration: {
    approvedDeviceIdentifiers: [],
    employeeNameKey: null,
    role: null,
    journal: null,
    tests: null,
    user: null,
    requestTimeout: null,
  },
};

export const appConfigReducer = createReducer(
  initialState,
  on(LoadAppConfig, (state: AppConfigStateModel, { appConfig }) => {
    if (appConfig) {
      return {
        ...state,
        appConfiguration: appConfig,
      };
    }
    return state;
  }),
  on(LoadRemoteConfig, (state: AppConfigStateModel, { remoteConfig }) => {
    if (remoteConfig) {
      return {
        ...state,
        remoteConfiguration: remoteConfig,
      };
    }
    return state;
  }),
  on(UnloadConfig, () => initialState)
);

export const getAppConfigState = createFeatureSelector<AppConfig>('appConfig');
