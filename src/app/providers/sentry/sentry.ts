import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as Sentry from 'sentry-cordova';

import { AppConfig } from '@providers/app-config/app-config.model';
import { LogHelper } from '@providers/logs/logs-helper';
import { SaveLog } from '@store/logs/logs.actions';
import { StoreModel } from '@shared/models/store.model';
import { LogType } from '@shared/models/log.model';

@Injectable()
export class SentryProvider {

  constructor(
    private store$: Store<StoreModel>,
    private logHelper: LogHelper,
  ) { }

  public initialiseSentryErrorLogging = ({ sentry }: AppConfig): void => {
    if (sentry.dsn) {
      this.sentryInitialisedLog();

      Sentry.init({
        dsn: sentry.dsn,
        environment: sentry.environment,
      });
    }
  };

  private sentryInitialisedLog = (): void => {
    this.store$.dispatch(SaveLog({
      payload: this.logHelper.createLog(
        LogType.INFO,
        'Sentry DSN was provided so reporting should be active',
        'Sentry has been initialised',
      ),
    }));
  };
}
