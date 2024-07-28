import { environment as devEnvironment } from '@environments/environment.dev';
import { EnvironmentFile } from './models/environment.model';

const minute = 1000 * 60;

export const environment: EnvironmentFile = {
  ...devEnvironment,
  sentry: { ...devEnvironment.sentry, dsn: null }, // Comment this line out to report errors to Sentry in dev-tools mode
  enableDevTools: true,
  enableRehydrationPlugin: true,
  logsAutoSendInterval: minute * 3,
};
