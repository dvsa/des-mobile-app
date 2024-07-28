import { EnvironmentFile } from '@environments/models/environment.model';
import { AppConfig } from '../app-config.model';
import { localEnvironmentMock } from './environment.mock';

export class AppConfigProviderMock {
	private appConfig = {
		liveAppVersion: localEnvironmentMock.liveAppVersion,
		configUrl: localEnvironmentMock.configUrl,
		googleAnalyticsId: localEnvironmentMock.googleAnalyticsId,
		googleAnalyticsKey: localEnvironmentMock.googleAnalyticsKey,
		daysToCacheLogs: localEnvironmentMock.daysToCacheLogs,
		logoutClearsTestPersistence: localEnvironmentMock.logoutClearsTestPersistence,
		logsPostApiKey: localEnvironmentMock.logsPostApiKey,
		taxMotApiKey: localEnvironmentMock.taxMotApiKey,
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
			enablePracticeModeAnalytics: localEnvironmentMock.journal.enablePracticeModeAnalytics,
			enableLogoutButton: localEnvironmentMock.journal.enableLogoutButton,
			testPermissionPeriods: localEnvironmentMock.journal.testPermissionPeriods,
		},
		tests: {
			testSubmissionUrl: localEnvironmentMock.tests.testSubmissionUrl,
			multipleTestResultsUrl: localEnvironmentMock.tests.multipleTestResultsUrl,
			autoSendInterval: localEnvironmentMock.tests.autoSendInterval,
		},
		user: {
			findUserUrl: localEnvironmentMock.user.findUserUrl,
		},
		driver: {
			standardUrl: localEnvironmentMock.driver.standardUrl,
			signatureUrl: localEnvironmentMock.driver.signatureUrl,
			photographUrl: localEnvironmentMock.driver.photographUrl,
		},
		vehicle: {
			taxMotUrl: localEnvironmentMock.vehicle.taxMotUrl,
		},
		refData: {
			testCentreUrl: localEnvironmentMock.refData.testCentreUrl,
		},
		requestTimeout: localEnvironmentMock.requestTimeout,
	};

	environmentFile: EnvironmentFile = localEnvironmentMock;

	public initialiseAppConfig = jasmine.createSpy('initialiseAppConfig');

	public loadRemoteConfig = jasmine.createSpy('loadRemoteConfig').and.returnValue(Promise.resolve());

	public shutDownStoreSubscription = jasmine.createSpy('shutDownStoreSubscription');

	public getDebugMode = jasmine.createSpy('getDebugMode').and.returnValue(Promise.resolve());

	public getAppConfigAsync(): Promise<AppConfig> {
		return Promise.resolve(this.appConfig);
	}

	public getAppConfig(): AppConfig {
		return this.appConfig;
	}
}
