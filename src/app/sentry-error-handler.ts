import {
  ErrorHandler, Inject, Injectable, Injector,
} from '@angular/core';
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

@Injectable()
export class SentryIonicErrorHandler extends ErrorHandler {
  // Cyclic DI dependency error if injecting services via the constructor
  constructor(@Inject(Injector) private injector: Injector) {
    super();
  }

  async handleError(error) {
    super.handleError(error);

    try {
      // don't report missing apiKey errors that can be seen via Logs service;
      if (
        error instanceof HttpErrorResponse
          && error?.status === 403
          && error?.url?.includes('logs')
      ) return;

      const { role } = this.appConfigProvider.getAppConfig();
      const employeeID = this.authenticationProvider.getEmployeeId();
      const appVersion = await this.appInfoProvider.getVersionNumber().toPromise();

      Sentry.withScope((scope) => {
        if (employeeID) scope.setTag('employee-id', employeeID);
        if (role) scope.setTag('role', role);
        if (appVersion) scope.setTag('app-version', appVersion);

        Sentry.captureException(error.originalError || error);
      });
    } catch (err) {
      this.store$.dispatch(SaveLog({
        payload: this.logHelper.createLog(
          LogType.ERROR,
          'Sentry Error handler',
          err?.message ?? err,
        ),
      }));
    }
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
