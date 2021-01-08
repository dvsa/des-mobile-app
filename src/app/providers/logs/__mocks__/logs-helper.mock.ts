import { LogType } from '../../../shared/models/log.model';

export class LogHelperMock {

  public logDate = new Date(2019, 11, 24);

  createLog = jasmine.createSpy('createLog').and.returnValue({
    message: 'error',
    type: LogType.ERROR,
    timestamp: this.logDate,
    description: 'Description',
    appVersion: '1.1.0',
    iosVersion: '1.0.0',
    deviceId: 'fb455c20-c025-4d6b-bbf2-aab80af6efb8',
  });

}
