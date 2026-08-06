import { environment as sitEnvironment } from '@environments/environment.sit';
import { QrEnvironmentFile } from './models/environment.model';

export const environment: QrEnvironmentFile = {
  ...sitEnvironment,
  allowQR: true,
};
