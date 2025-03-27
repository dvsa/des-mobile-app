import { environment as devEnvironment } from '@environments/environment.dev';
import { TestersEnvironmentFile } from './models/environment.model';

export const environment: TestersEnvironmentFile = {
  ...devEnvironment,
  enableDevTools: false,
  isTest: true,
  sentry: {
    dsn: null,
    environment: null,
  },
};
