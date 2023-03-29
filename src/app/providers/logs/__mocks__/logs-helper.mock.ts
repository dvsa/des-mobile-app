import { LogType } from '@shared/models/log.model';

export class LogHelperMock {

  createLog = jasmine.createSpy('createLog').and.returnValue({
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
