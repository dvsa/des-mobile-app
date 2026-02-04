import { createAction } from '@ngrx/store';
import { AppConfigError } from '@providers/app-config/app-config.constants';
import { AuthenticationError } from '@providers/authentication/authentication.constants';

export const ReportError = createAction(
  '[Login] Login Error Reported',
  (reportedError: AuthenticationError | AppConfigError | unknown) => ({
    reportedError,
  })
);
