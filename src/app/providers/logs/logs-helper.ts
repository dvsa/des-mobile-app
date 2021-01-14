import { select, Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { merge } from 'rxjs';
// import { Device } from '@capacitor/core';
import { Injectable } from '@angular/core';

import { LogType, Log } from '../../shared/models/log.model';
import { selectVersionNumber, selectEmployeeId } from '../../../store/app-info/app-info.selectors';
import { StoreModel } from '../../shared/models/store.model';

@Injectable()
export class LogHelper {

  private appVersion: string;
  private employeeId: string;

  constructor(
    // private device: Device,
    private store$: Store<StoreModel>,
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
      iosVersion: '12.3', // this.device.version,
      deviceId: '12345456', // this.device.uuid,
      drivingExaminerId: this.employeeId,
    };
  }
}
