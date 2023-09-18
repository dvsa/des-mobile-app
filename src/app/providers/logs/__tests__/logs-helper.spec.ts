import { TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
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
