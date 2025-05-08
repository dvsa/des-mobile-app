import { environment as devEnvironment } from '@environments/environment.dev';
import { QrEnvironmentFile } from './models/environment.model';

export const environment: QrEnvironmentFile = {
  ...devEnvironment,
  allowQR: true,
};
