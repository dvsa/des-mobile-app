import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { LogType } from '@shared/models/log.model';
import { StoreModel } from '@shared/models/store.model';
import { SaveLog } from '@store/logs/logs.actions';
import { LogHelper } from '@providers/logs/logs-helper';

@Injectable()
export class ReportLogsProvider {
  constructor(
    private store$: Store<StoreModel>,
    public logHelper: LogHelper,
  ) {
  }

  methodReportLog = (method: string, error: unknown, page: string) => {
    this.store$.dispatch(SaveLog({
      payload: this.logHelper.createLog(
        LogType.ERROR,
        `${page} ${method}`,
        JSON.stringify(error),
      ),
    }));
  };
}
