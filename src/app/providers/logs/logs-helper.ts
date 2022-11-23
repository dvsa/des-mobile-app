import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { merge } from 'rxjs';
import { Device } from '@awesome-cordova-plugins/device/ngx';

import { LogType, Log } from '@shared/models/log.model';
import { StoreModel } from '@shared/models/store.model';
import { selectVersionNumber, selectEmployeeId } from '@store/app-info/app-info.selectors';

@Injectable()
export class LogHelper {

  private appVersion: string;
  private employeeId: string;

  constructor(
    private store$: Store<StoreModel>,
    private device: Device,
  ) {
    const versionNumber$ = this.store$.pipe(
      select(selectVersionNumber),
      map((appVersion) => { this.appVersion = appVersion; }),
    );
    const employeeId$ = this.store$.pipe(
      select(selectEmployeeId),
      map((employeeId) => { this.employeeId = employeeId; }),
    );
    merge(
      versionNumber$,
      employeeId$,
    ).subscribe();
  }

  createLog(logType: LogType, desc: string, error: string): Log {
    return {
      message: error,
      type: logType,
      timestamp: Date.now(),
      description: desc,
      appVersion: this.appVersion,
      iosVersion: this.device.version,
      deviceId: this.device.uuid,
      drivingExaminerId: this.employeeId,
    };
  }
}
