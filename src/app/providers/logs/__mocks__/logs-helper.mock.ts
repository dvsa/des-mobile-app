import { LogType } from '@shared/models/log.model';
import { vi } from 'vitest';

export class LogHelperMock {
  createLog = vi.fn().mockReturnValue({
    message: 'error',
    type: LogType.ERROR,
    timestamp: 123,
    description: 'Description',
    appVersion: '1.1.0',
    iosVersion: '1.0.0',
    deviceId: 'fb455c20-c025-4d6b-bbf2-aab80af6efb8',
    drivingExaminerId: 'testData',
  });
}
