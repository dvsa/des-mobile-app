import { environment as devEnvironment } from '@environments/environment.dev';
import { EnvironmentFile } from './models/environment.model';

const minute = 1000 * 60;

export const environment: EnvironmentFile = {
  ...devEnvironment,
  enableDevTools: true,
  logsAutoSendInterval: minute * 3,
};
