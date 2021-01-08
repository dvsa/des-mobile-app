import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { merge } from 'lodash';
import { environment } from '../../../environments/environment';
import { AppConfig } from './app-config.model';

@Injectable()
export class AppConfigProvider {

  isDebugMode = false;

  environmentFile = environment;

  private appConfig: AppConfig;

  constructor(
    public platform: Platform,
  ) {
  }

  public initialiseAppConfig = async (): Promise<void> => {
    try {
      this.mapInAppConfig(this.environmentFile);
      return Promise.resolve();
    } catch (err) {

      // TODO: Send error through the logging service

    }
  };

  public getAppConfig = (): AppConfig => {
    if (!this.appConfig) {
      this.initialiseAppConfig();
    }

    return this.appConfig;
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
}
