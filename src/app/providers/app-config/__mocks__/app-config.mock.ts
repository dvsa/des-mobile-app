import { EnvironmentFile } from '@environments/models/environment.model';
import { localEnvironmentMock } from './environment.mock';
import { AppConfig } from '../app-config.model';

export class AppConfigProviderMock {

  environmentFile: EnvironmentFile = localEnvironmentMock;

  public initialiseAppConfig = jasmine.createSpy('initialiseAppConfig');

  public loadRemoteConfig = jasmine.createSpy('loadRemoteConfig').and.returnValue(Promise.resolve());

  public shutDownStoreSubscription = jasmine.createSpy('shutDownStoreSubscription');

  public getDebugMode = jasmine.createSpy('getDebugMode').and.returnValue(Promise.resolve());

  public getAppConfig(): AppConfig {
    return {
      configUrl: localEnvironmentMock.configUrl,
      googleAnalyticsId: localEnvironmentMock.googleAnalyticsId,
      daysToCacheLogs: localEnvironmentMock.daysToCacheLogs,
      logoutClearsTestPersistence: localEnvironmentMock.logoutClearsTestPersistence,
      logsPostApiKey: localEnvironmentMock.logsPostApiKey,
      logsApiUrl: localEnvironmentMock.logsApiUrl,
      logsAutoSendInterval: localEnvironmentMock.logsAutoSendInterval,
      authentication: {
        clientId: localEnvironmentMock.authentication.clientId,
        context: localEnvironmentMock.authentication.context,
        redirectUrl: localEnvironmentMock.authentication.redirectUrl,
        resourceUrl: localEnvironmentMock.authentication.resourceUrl,
        logoutUrl: localEnvironmentMock.authentication.logoutUrl,
        employeeIdKey: localEnvironmentMock.authentication.employeeIdKey,
        employeeNameKey: localEnvironmentMock.employeeNameKey,
      },
      approvedDeviceIdentifiers: localEnvironmentMock.approvedDeviceIdentifiers,
      timeTravelDate: localEnvironmentMock.timeTravelDate,
      role: localEnvironmentMock.role,
      journal: {
        journalUrl: localEnvironmentMock.journal.journalUrl,
        searchBookingUrl: localEnvironmentMock.journal.searchBookingUrl,
        delegatedExaminerSearchBookingUrl: localEnvironmentMock.journal.delegatedExaminerSearchBookingUrl,
        teamJournalUrl: localEnvironmentMock.journal.teamJournalUrl,
        autoRefreshInterval: localEnvironmentMock.journal.autoRefreshInterval,
        numberOfDaysToView: localEnvironmentMock.journal.numberOfDaysToView,
        daysToCacheJournalData: localEnvironmentMock.journal.daysToCacheJournalData,
        allowTests: localEnvironmentMock.journal.allowTests,
        allowedTestCategories: localEnvironmentMock.journal.allowedTestCategories,
        enableTestReportPracticeMode: localEnvironmentMock.journal.enableTestReportPracticeMode,
        enableEndToEndPracticeMode: localEnvironmentMock.journal.enableEndToEndPracticeMode,
        enableLogoutButton: localEnvironmentMock.journal.enableLogoutButton,
        testPermissionPeriods: localEnvironmentMock.journal.testPermissionPeriods,
      },
      tests: {
        testSubmissionUrl: localEnvironmentMock.tests.testSubmissionUrl,
        autoSendInterval: localEnvironmentMock.tests.autoSendInterval,
      },
      user: {
        findUserUrl: localEnvironmentMock.user.findUserUrl,
      },
      requestTimeout: localEnvironmentMock.requestTimeout,
    };
  }


}
