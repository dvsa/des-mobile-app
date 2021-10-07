import { TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import * as Sentry from 'sentry-cordova/dist/js/sdk';

import { SentryProvider } from '@providers/sentry/sentry';
import { LogHelper } from '@providers/logs/logs-helper';
import { LogHelperMock } from '@providers/logs/__mocks__/logs-helper.mock';
import { AppConfig } from '@providers/app-config/app-config.model';

import { SaveLog } from '@store/logs/logs.actions';
import { Log } from '@shared/models/log.model';

describe('SentryProvider', () => {
  let sentryProvider: SentryProvider;
  let logHelper: LogHelper;
  let store$: MockStore;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        SentryProvider,
        provideMockStore({}),
        { provide: LogHelper, useClass: LogHelperMock },
      ],
    });
  });

  beforeEach(() => {
    sentryProvider = TestBed.inject(SentryProvider);
    logHelper = TestBed.inject(LogHelper);
    store$ = TestBed.inject(MockStore);

    spyOn(store$, 'dispatch');
    spyOn(logHelper, 'createLog').and.returnValue({} as Log);
    spyOn(Sentry, 'init');
  });

  describe('initialiseSentryErrorLogging', () => {
    it('should not init sentry or log when no dsn is set', () => {
      sentryProvider.initialiseSentryErrorLogging({ sentry: {} } as AppConfig);
      expect(store$.dispatch).not.toHaveBeenCalled();
    });
    it('should init sentry and dispatch log', () => {
      sentryProvider.initialiseSentryErrorLogging({ sentry: { dsn: 'dsn', environment: 'dev' } } as AppConfig);
      expect(store$.dispatch).toHaveBeenCalledWith(SaveLog({ payload: {} as Log }));
    });
  });
});
