import { ErrorHandler, inject, Injectable } from '@angular/core';
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
  public authenticationProvider = inject(AuthenticationProvider);
  public appConfigProvider = inject(AppConfigProvider);
  public appInfoProvider = inject(AppInfoProvider);
  public logHelper = inject(LogHelper);
  public store$ = inject<Store<StoreModel>>(Store);

  constructor() {
    super();
  }

  // keep method name different to inside `ErrorHandler` which brings more clarity to unit tests
  async handleErr(error: any) {
    try {
      // call through to `ErrorHandler` without use of super!
      this.handleError(error);

      // don't report missing apiKey errors that can be seen via Logs service;
      if (
        error instanceof HttpErrorResponse
        && error?.status === 403
        && error?.url?.includes('logs')
      ) {
        return;
      }

      const role = this.appConfigProvider.getAppConfig()?.role;
      const employeeID = this.authenticationProvider.getEmployeeId();
      const appVersion = await this.appInfoProvider.getFullVersionNumber();

      Sentry.withScope((scope) => {
        if (employeeID) scope.setUser({ id: employeeID });
        if (role) scope.setTag('role', role);
        if (appVersion) scope.setTag('app-version', appVersion);

        Sentry.captureException(error.originalError || error);
      });
    } catch (err) {
      this.store$.dispatch(SaveLog({
        payload: this.logHelper.createLog(
          LogType.ERROR,
          'Error handler',
          err?.message ?? err,
        ),
      }));
    }
  }
}
