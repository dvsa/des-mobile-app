import {
  ErrorHandler, Inject, Injectable, Injector,
} from '@angular/core';
import * as Sentry from 'sentry-cordova';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { AppInfoProvider } from '@providers/app-info/app-info';
import { AuthenticationProvider } from '@providers/authentication/authentication';

@Injectable()
export class SentryIonicErrorHandler extends ErrorHandler {
  // Cyclic DI dependency error if injecting services via the constructor
  constructor(@Inject(Injector) private injector: Injector) {
    super();
  }

  async handleError(error) {
    super.handleError(error);

    try {
      const { role } = this.appConfigProvider.getAppConfig();
      const employeeID = this.authenticationProvider.getEmployeeId();
      const appVersion = await this.appInfoProvider.getVersionNumber();

      Sentry.withScope((scope) => {
        if (employeeID) scope.setTag('employee-id', employeeID);
        if (role) scope.setTag('role', role);
        if (appVersion) scope.setTag('app-version', appVersion);

        Sentry.captureException(error.originalError || error);
      });
    } catch (e) {
      console.error('SENTRY error handler', e);
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
}
