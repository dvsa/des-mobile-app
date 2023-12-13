import { ErrorHandler, Inject, Injectable, Injector } from '@angular/core';
import * as Sentry from '@sentry/capacitor';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { AppInfoProvider } from '@providers/app-info/app-info';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { HttpErrorResponse } from '@angular/common/http';
import { StoreModel } from '@shared/models/store.model';
import { Store } from '@ngrx/store';
import { LogHelper } from '@providers/logs/logs-helper';
import { SaveLog } from '@store/logs/logs.actions';
import { LogType } from '@shared/models/log.model';
import { Device } from '@capacitor/device';

type SentryError = RegExp | string;

// Errors are being thrown via the live-server used to display state on simulator which are useless.
const SENTRY_ERRORS_LIVERELOAD: SentryError[] = [
  /^(SocketProtocolError|Socket closed without status code|Server ping timed out).*$/gi,
];

// Errors being thrown within packages are filtering into the Sentry reports, these are inflating the stats.
const SENTRY_ERRORS_NODE_MODULES: SentryError[] = [
  'this._data[this._data.length-1].push',
];

export const SENTRY_ERRORS: SentryError[] = [
  ...SENTRY_ERRORS_LIVERELOAD,
  ...SENTRY_ERRORS_NODE_MODULES,
];

@Injectable()
export class SentryIonicErrorHandler extends ErrorHandler {
  // Cyclic DI dependency error if injecting services via the constructor
  constructor(@Inject(Injector) private injector: Injector) {
    super();
  }

  async handleError(error: any) {
    try {
      // call through to ionic error handler which is default behaviour
      super.handleError(error);

      // don't report missing apiKey errors that can be seen via Logs service;
      if (
        error instanceof HttpErrorResponse
        && error?.status === 403
        && error?.url?.includes('logs')
      ) {
        return;
      }

      const appConfig = await this.appConfigProvider.getAppConfigAsync();
      const employeeID = await this.authenticationProvider.getEmployeeIdFromIDToken();
      const appVersion = await this.appInfoProvider.getFullVersionNumber();
      const device = await Device.getId();

      Sentry.withScope((scope) => {
        if (employeeID) scope.setUser({ id: employeeID });
        if (device?.identifier) scope.setTag('device-id', device.identifier);
        if (appConfig?.role) scope.setTag('role', appConfig.role);
        if (appVersion) scope.setTag('app-version', appVersion);

        Sentry.captureException(error.originalError || error);
      });
    } catch (err) {
      this.reportError(err);
    }
  }

  private reportError(error: unknown) {
    const details = (error instanceof Error)
      ? JSON.stringify(error, Object.getOwnPropertyNames(error))
      : JSON.stringify(error);

    this.store$.dispatch(SaveLog({
      payload: this.logHelper.createLog(
        LogType.ERROR,
        'Error handler',
        details,
      ),
    }));
  }

  get authenticationProvider(): AuthenticationProvider {
    return this.injector.get<AuthenticationProvider>(AuthenticationProvider);
  }

  get appConfigProvider(): AppConfigProvider {
    return this.injector.get<AppConfigProvider>(AppConfigProvider);
  }

  get appInfoProvider(): AppInfoProvider {
    return this.injector.get<AppInfoProvider>(AppInfoProvider);
  }

  get logHelper(): LogHelper {
    return this.injector.get<LogHelper>(LogHelper);
  }

  get store$(): Store<StoreModel> {
    return this.injector.get<Store<StoreModel>>(Store);
  }
}
