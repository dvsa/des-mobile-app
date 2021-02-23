import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { from, merge } from 'rxjs';
import { Device, DeviceInfo } from '@capacitor/core';

import { selectVersionNumber, selectEmployeeId } from '../../../store/app-info/app-info.selectors';
import { LogType, Log } from '../../shared/models/log.model';
import { StoreModel } from '../../shared/models/store.model';

@Injectable()
export class LogHelper {

  private appVersion: string;
  private employeeId: string;
  private deviceInfo: DeviceInfo;

  constructor(
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
    const device$ = from(Device.getInfo()).pipe(
      map((deviceInfo: DeviceInfo) => { this.deviceInfo = deviceInfo; }),
    );
    merge(
      versionNumber$,
      employeeId$,
      device$,
    ).subscribe();
  }

  createLog(logType: LogType, desc: string, error: string): Log {
    return {
      message: error,
      type: logType,
      timestamp: Date.now(),
      description: desc,
      appVersion: this.appVersion,
      iosVersion: this.deviceInfo?.osVersion,
      deviceId: this.deviceInfo?.uuid,
      drivingExaminerId: this.employeeId,
    };
  }
}
