import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Platform } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { timeout } from 'rxjs/operators';
import { get, merge } from 'lodash';
import { ValidationResult, ValidationError } from 'joi';

import { environment } from '../../../environments/environment';
import { StoreModel } from '../../shared/models/store.model';
import { AppConfig } from './app-config.model';

import { SchemaValidatorProvider } from '../schema-validator/schema-validator';
import { SaveLog } from '../../../store/logs/logs.actions';
import { LogHelper } from '../logs/logs-helper';
import { LogType } from '../../shared/models/log.model';
import { AuthenticationError } from '../authentication/authentication.constants';
import { AppConfigError } from './app-config.constants';
import { ConnectionStatus, NetworkStateProvider } from '../network-state/network-state';
import { AppInfoProvider } from '../app-info/app-info';
import { DataStoreProvider } from '../data-store/data-store';
import { EnvironmentFile } from '../../../environments/models/environment.model';

declare let cordova: any;

@Injectable()
export class AppConfigProvider {

  isDebugMode = false;

  environmentFile: EnvironmentFile = environment;

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
  ) {
  }

  public initialiseAppConfig = async (): Promise<void> => {
    try {
      if (this.platform.is('ios')) {
        console.log('We are on an ios platform');
      }

      this.mapInAppConfig(this.environmentFile);

      if (!this.environmentFile.isRemote) {
        this.mapRemoteConfig(this.environmentFile);
      }

      return Promise.resolve();
    } catch (err) {
      this.store$.dispatch(SaveLog({
        payload: this.logHelper.createLog(LogType.ERROR, 'Initializing App Config', err),
      }));
    }
  };

  public getAppConfig = (): AppConfig => {
    if (!this.appConfig) {
      this.initialiseAppConfig();
    }

    return this.appConfig;
  };

  public loadManagedConfig = (): void => {

    if (get(cordova, 'plugins.AppConfig', false)) {
      const appConfigPlugin = cordova.plugins.AppConfig;

      const newEnvFile = {
        production: false,
        configUrl: appConfigPlugin.getValue('configUrl'),
        daysToCacheJournalData: appConfigPlugin.getValue('daysToCacheJournalData'),
        daysToCacheLogs: appConfigPlugin.getValue('daysToCacheLogs'),
        isRemote: true,
        logsPostApiKey: appConfigPlugin.getValue('logsPostApiKey'),
        logsApiUrl: appConfigPlugin.getValue('logsApiUrl'),
        logsAutoSendInterval: appConfigPlugin.getValue('logsAutoSendInterval'),
        authentication: {
          clientId: appConfigPlugin.getValue('clientId'),
          context: appConfigPlugin.getValue('authenticationContext'),
          employeeIdKey: appConfigPlugin.getValue('employeeIdKey'),
          logoutUrl: appConfigPlugin.getValue('logoutUrl'),
          redirectUrl: appConfigPlugin.getValue('redirectUrl'),
          resourceUrl: appConfigPlugin.getValue('resourceUrl'),
        },
      } as EnvironmentFile;

      // Check to see if we have any config
      if (newEnvFile.configUrl) {
        this.environmentFile = { ...newEnvFile };
        return;
      }

      if (!this.isDebugMode) {
        throw new Error(AppConfigError.MISSING_REMOTE_CONFIG_URL_ERROR);
      }
    }
  };

  public loadRemoteConfig = (): Promise<any> => this.getRemoteData()
    .then((data: any) => {
      const result: ValidationResult = this.schemaValidatorProvider.validateRemoteConfig(data);

      if (result.error !== null) {
        return Promise.reject(result.error);
      }

      return data;
    })
    .then((data) => this.mapRemoteConfig(data))
    .catch((error: HttpErrorResponse | ValidationError) => {
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

      this.store$.dispatch(SaveLog({
        payload: this.logHelper.createLog(LogType.ERROR, 'Validating remote config', error.details[0].message),
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

    this.appInfoProvider.getMajorAndMinorVersionNumber()
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
      if (get(cordova, 'plugins.IsDebug', false)) {
        cordova.plugins.IsDebug.getIsDebug((isDebug: boolean) => {
          this.isDebugMode = isDebug;
          console.log('Detected that app is running in debug mode');
          resolve();
        }, (err: any) => {
          reject(err);
        });
      } else {
        resolve();
      }
    });
  };
}
