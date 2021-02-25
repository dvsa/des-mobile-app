import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Platform } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { distinctUntilChanged, map, switchMap, take, timeout } from 'rxjs/operators';
import { isEmpty, merge } from 'lodash';
import { ValidationResult, ValidationError } from 'joi';

import { IsDebug } from '@ionic-native/is-debug/ngx';
import { EmmAppConfig } from '@ionic-native/emm-app-config/ngx';

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
import { getAppConfigState } from '../../../store/app-config/app-config.reducer';

/**
 *  How Loading Config Works
 *
 *  IOS Devices
 *
 *  If the device is IOS it will attempt to create a Environment file in from configuration provided from MDM
 *  using loadManagedConfig().
 *
 *  If this fails then it will use the Enviroment configuration
 *  provided by the enviroment file at ../../enviroment/enviroment which is required for the app to build
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
 *  Non ios devcies will always use the enviroment file at ../../enviroment/enviroment
 *
 *  In the Login page for a non IOS device initialiseAppConfig() is run which also calls mapRemoteConfig() to
 *  load more config from the enviroment file.
 *
 *  As on non-IOS devices we can't authenticate with AWS so the enviroment file should always have the setting
 *  isRemote set to false
 */

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
    private isDebug: IsDebug,
    private emmAppConfig: EmmAppConfig,
  ) {
  }

  public initialiseAppConfig = async (): Promise<void> => {
    try {
      if (this.platform.is('ios')) {
        await this.getDebugMode();
        this.loadManagedConfig();
      }

      this.mapInAppConfig(this.environmentFile);

      if (!this.environmentFile.isRemote) {
        this.mapRemoteConfig(this.environmentFile);
      }
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(AppConfigError.MDM_ERROR);
    }
  };

  public getAppConfig = (): AppConfig => {
    if (!this.appConfig) {
      this.store$.select(getAppConfigState).pipe(
        map((appConfig: AppConfig) => { this.appConfig = appConfig; }),
      ).subscribe();

      if (!this.appConfig) {
        this.initialiseAppConfig();
      }
    }
    return this.appConfig;
  };

  public loadManagedConfig = (): void => {
    const newEnvFile = {
      production: false,
      configUrl: this.emmAppConfig.getValue('configUrl'),
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
      this.isDebug.getIsDebug()
        .then((isDebug) => {
          this.isDebugMode = isDebug;
          resolve();
        })
        .catch((err) => reject(err));
    });
  };
}
