import { TestBed } from '@angular/core/testing';
import { Device } from '@awesome-cordova-plugins/device/ngx';
import { Store, StoreModule } from '@ngrx/store';
import { DeviceMock } from '@mocks/ionic-mocks/device.mock';
import { LogType } from '@shared/models/log.model';
import { LogHelper } from '../logs-helper';

describe('LogHelper', () => {
  let logHelper: LogHelper;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          appInfo: () => ({
            versionNumber: '5',
          }),
        }),
      ],
      providers: [
        {
          provide: Device,
          useValue: DeviceMock,
        },
        LogHelper,
        Store,
      ],
    });

    logHelper = TestBed.inject(LogHelper);
  });

  describe('createLog', () => {
    it('creates log successfully', (done) => {
      const log = logHelper.createLog(LogType.ERROR, 'description', 'error');
      expect(log.message)
        .toBe('error');
      expect(log.type)
        .toBe(LogType.ERROR);
      expect(log.description)
        .toBe('description');
      expect(log.appVersion)
        .toBe('5');
      done();
    });
  });
});
