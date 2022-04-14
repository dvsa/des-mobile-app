import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Platform } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { map, timeout } from 'rxjs/operators';
import { isEmpty, merge } from 'lodash';
import { ValidatorResult, ValidationError } from 'jsonschema';
import { IsDebug } from '@ionic-native/is-debug/ngx';
import { EmmAppConfig } from '@ionic-native/emm-app-config/ngx';
import { Subscription } from 'rxjs';

import { environment } from '@environments/environment';
import { EnvironmentFile, TestersEnvironmentFile } from '@environments/models/environment.model';
import { StoreModel } from '@shared/models/store.model';
import { LogType } from '@shared/models/log.model';
import { SaveLog } from '@store/logs/logs.actions';
import { getAppConfigState } from '@store/app-config/app-config.reducer';
import { AppConfig } from './app-config.model';

import { SchemaValidatorProvider } from '../schema-validator/schema-validator';
import { LogHelper } from '../logs/logs-helper';
import { AuthenticationError } from '../authentication/authentication.constants';
import { AppConfigError } from './app-config.constants';
import { ConnectionStatus, NetworkStateProvider } from '../network-state/network-state';
import { AppInfoProvider } from '../app-info/app-info';
import { DataStoreProvider } from '../data-store/data-store';

/**
 *  How Loading Config Works
 *
 *  IOS Devices
 *
 *  If the device is IOS it will attempt to create an Environment file in from configuration provided from MDM
 *  using loadManagedConfig().
 *
 *  If this fails then it will use the Environment configuration
 *  provided by the environment file at ../../environment/environment which is required for the app to build
 *
 *  In the Login page for an IOS device the App Config initialiseAppConfig() is ran
 *  followed by loadRemoteConfig() which makes an api call to the configuration microservice
 *  and then calls mapRemoteConfig()
 *
 *  If loading the remote config fails we fall back to getCachedRemoteConfig() which should load
 *  the configuration from a previous run of the app from the on device database.
 *
 *  Non IOS Devices
 *
 *  Non ios devices will always use the environment file at ../../environment/environment
 *
 *  In the Login page for a non IOS device initialiseAppConfig() is run which also calls mapRemoteConfig() to
 *  load more config from the environment file.
 *
 *  As on non-IOS devices we can't authenticate with AWS so the environment file should always have the setting
 *  isRemote set to false
 */

@Injectable()
export class AppConfigProvider {

  isDebugMode = false;
  storeSubscription: Subscription;
  environmentFile: EnvironmentFile = environment as EnvironmentFile;
  private appConfig: AppConfig;

  constructor(
    private platform: Platform,
    private httpClient: HttpClient,
    private networkStateProvider: NetworkStateProvider,
    private schemaValidatorProvider: SchemaValidatorProvider,
    private appInfoProvider: AppInfoProvider,
    private dataStoreProvider: DataStoreProvider,
    private store$: Store<StoreModel>,
    private logHelper: LogHelper,
    private isDebug: IsDebug,
    private emmAppConfig: EmmAppConfig,
  ) {
    this.setStoreSubscription();
  }

  public initialiseAppConfig = async (): Promise<void> => {
    try {
      if (this.platform.is('cordova')) {
        await this.getDebugMode();
        this.loadManagedConfig();
      }

      this.mapInAppConfig(this.environmentFile);

      if (!this.environmentFile.isRemote) {
        this.mapRemoteConfig(this.environmentFile);
      }
      return await Promise.resolve();
    } catch (err) {
      this.logError('Initialise app config error', err);
      return Promise.reject(AppConfigError.MDM_ERROR);
    }
  };

  public setStoreSubscription(): void {
    this.storeSubscription = this.store$.select(getAppConfigState).pipe(
      map((appConfig: AppConfig) => this.appConfig = appConfig),
    ).subscribe();
  }

  public shutDownStoreSubscription(): void {
    if (this.storeSubscription) {
      this.storeSubscription.unsubscribe();
    }
  }

  public getAppConfig = (): AppConfig => {
    return this.appConfig;
  };

  public loadManagedConfig = (): void => {
    const newEnvFile = {
      production: false,
      configUrl: this.emmAppConfig.getValue('configUrl'),
      sentry: {
        dsn: this.emmAppConfig.getValue('sentryDsn'),
        environment: this.emmAppConfig.getValue('sentryEnv'),
      },
      daysToCacheJournalData: this.emmAppConfig.getValue('daysToCacheJournalData'),
      daysToCacheLogs: this.emmAppConfig.getValue('daysToCacheLogs'),
      isRemote: true,
      logsPostApiKey: this.emmAppConfig.getValue('logsPostApiKey'),
      logsApiUrl: this.emmAppConfig.getValue('logsApiUrl'),
      logsAutoSendInterval: this.emmAppConfig.getValue('logsAutoSendInterval'),
      authentication: {
        clientId: this.emmAppConfig.getValue('clientId'),
        context: this.emmAppConfig.getValue('authenticationContext'),
        employeeIdKey: this.emmAppConfig.getValue('employeeIdKey'),
        logoutUrl: this.emmAppConfig.getValue('logoutUrl'),
        redirectUrl: this.emmAppConfig.getValue('redirectUrl'),
        resourceUrl: this.emmAppConfig.getValue('resourceUrl'),
      },
    } as EnvironmentFile;

    // Check to see if we have any config
    if (!isEmpty((newEnvFile.configUrl))) {
      this.environmentFile = { ...newEnvFile };
      return;
    }

    if (!this.isDebugMode) {
      throw new Error(AppConfigError.MISSING_REMOTE_CONFIG_URL_ERROR);
    }
  };

  public loadRemoteConfig = (): Promise<any> => this.getRemoteData()
    .then((data: any) => {

      const result: ValidatorResult = this.schemaValidatorProvider.validateRemoteConfig(data);
      if (result?.errors?.length > 0) {
        return Promise.reject(result.errors);
      }
      return data;
    })
    .then((data) => this.mapRemoteConfig(data))
    .catch((error: HttpErrorResponse | ValidationError[]) => {
      if (error instanceof HttpErrorResponse) {
        this.store$.dispatch(SaveLog({
          payload: this.logHelper.createLog(LogType.ERROR, 'Loading remote config', error.message),
        }));

        if (error && error.status === 403) {
          return Promise.reject(AuthenticationError.USER_NOT_AUTHORISED);
        }
        if (error && error.error === AppConfigError.INVALID_APP_VERSION) {
          return Promise.reject(AppConfigError.INVALID_APP_VERSION);
        }
        return Promise.reject(AppConfigError.UNKNOWN_ERROR);
      }

      const configError: string = (error || []).map((err: ValidationError) => err.message).join(', ');

      this.store$.dispatch(SaveLog({
        payload: this.logHelper.createLog(LogType.ERROR, 'Validating remote config', configError),
      }));
      return Promise.reject(AppConfigError.VALIDATION_ERROR);
    });

  private getRemoteData = () => new Promise((resolve, reject) => {
    if (this.networkStateProvider.getNetworkState() === ConnectionStatus.OFFLINE) {
      this.getCachedRemoteConfig()
        .then((data) => resolve(data))
        .catch((error) => reject(error));

      return;
    }

    this.appInfoProvider.getFullVersionNumber()
      .then((version: string) => {
        const url = `${this.environmentFile.configUrl}?app_version=${version}`;
        this.httpClient.get(url)
          .pipe(timeout(30000))
          .subscribe(
            (data) => {
              this.dataStoreProvider.setItem('CONFIG', JSON.stringify(data));
              resolve(data);
            },
            (error: HttpErrorResponse) => {
              if (this.shouldGetCachedConfig(error.error)) {
                this.logError('Getting remote config failed, using cached data', error.error);
                this.getCachedRemoteConfig()
                  .then((data) => resolve(data))
                  .catch((cacheError) => reject(cacheError));
              } else {
                this.logError('Getting remote config failed, not using cached data', error.error);
                reject(error);
              }
            },
          );
      });
  });

  private shouldGetCachedConfig = (errorMessage: string): boolean => {
    return errorMessage !== AuthenticationError.USER_NOT_AUTHORISED
      && errorMessage !== AppConfigError.INVALID_APP_VERSION;
  };

  private logError = (description: string, error: string): void => {
    this.store$.dispatch(SaveLog({
      payload: this.logHelper.createLog(LogType.ERROR, description, error),
    }));
  };

  private getCachedRemoteConfig = async (): Promise<any> => {
    try {
      const response = await this.dataStoreProvider.getItem('CONFIG');
      return JSON.parse(response);
    } catch (error) {
      return error;
    }
  };

  private mapInAppConfig = (data) => {
    this.appConfig = merge({}, this.appConfig, {
      configUrl: data.configUrl,
      logoutClearsTestPersistence: data.logoutClearsTestPersistence,
      logsPostApiKey: data.logsPostApiKey,
      logsApiUrl: data.logsApiUrl,
      logsAutoSendInterval: data.logsAutoSendInterval,
      authentication: {
        context: data.authentication.context,
        redirectUrl: data.authentication.redirectUrl,
        resourceUrl: data.authentication.resourceUrl,
        clientId: data.authentication.clientId,
        logoutUrl: data.authentication.logoutUrl,
        employeeIdKey: data.authentication.employeeIdKey,
      },
    } as AppConfig);
  };

  private mapRemoteConfig = (data: any) => {
    this.appConfig = merge({}, this.appConfig, {
      googleAnalyticsId: data.googleAnalyticsId,
      approvedDeviceIdentifiers: data.approvedDeviceIdentifiers,
      timeTravelDate: data.timeTravelDate,
      role: data.role,
      authentication: {
        employeeNameKey: data.employeeNameKey,
      },
      journal: {
        journalUrl: data.journal.journalUrl,
        searchBookingUrl: data.journal.searchBookingUrl,
        delegatedExaminerSearchBookingUrl: data.journal.delegatedExaminerSearchBookingUrl,
        teamJournalUrl: data.journal.teamJournalUrl,
        autoRefreshInterval: data.journal.autoRefreshInterval || 15000,
        numberOfDaysToView: data.journal.numberOfDaysToView,
        daysToCacheJournalData: data.journal.daysToCacheJournalData,
        allowTests: data.journal.allowTests,
        allowedTestCategories: data.journal.allowedTestCategories,
        enableTestReportPracticeMode: data.journal.enableTestReportPracticeMode,
        enableEndToEndPracticeMode: data.journal.enableEndToEndPracticeMode,
        enableLogoutButton: data.journal.enableLogoutButton,
        testPermissionPeriods: data.journal.testPermissionPeriods,
      },
      tests: {
        testSubmissionUrl: data.tests.testSubmissionUrl,
        autoSendInterval: data.tests.autoSendInterval,
      },
      user: {
        findUserUrl: data.user.findUserUrl,
      },
      requestTimeout: data.requestTimeout,
    } as AppConfig);
  };

  getDebugMode = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      this.isDebug.getIsDebug()
        .then((isDebug) => {
          this.isDebugMode = (environment as unknown as TestersEnvironmentFile)?.isTest ? true : isDebug;
          console.log('Detected that app is running in debug mode');
          resolve();
        })
        .catch((err) => reject(err));
    });
  };
}
