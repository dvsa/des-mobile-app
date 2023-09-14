import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { concatAll, map, tap, toArray } from 'rxjs/operators';
import { from, merge } from 'rxjs';
import { BatteryInfo, Device, DeviceId, DeviceInfo } from '@capacitor/device';

import { Log, LogType } from '@shared/models/log.model';
import { StoreModel } from '@shared/models/store.model';
import { selectEmployeeId, selectVersionNumber } from '@store/app-info/app-info.selectors';

@Injectable()
export class LogHelper {
  private appVersion: string;
  private employeeId: string;
  private deviceId: string;
  private iosVersion: string;
  private deviceInfo: DeviceInfo;
  private battery: number;

  constructor(private store$: Store<StoreModel>) {
    const versionNumber$ = this.store$.pipe(
      select(selectVersionNumber),
      map((appVersion) => {
        this.appVersion = appVersion;
      }),
    );

    const employeeId$ = this.store$.pipe(
      select(selectEmployeeId),
      map((employeeId) => {
        this.employeeId = employeeId;
      }),
    );

    const deviceInfo$ = from([
      Device.getId(),
      Device.getInfo(),
      Device.getBatteryInfo(),
    ])
      .pipe(
        concatAll(),
        toArray(),
        tap(([{ identifier }, deviceInfo, { batteryLevel }]: [DeviceId, DeviceInfo, BatteryInfo]) => {
          this.deviceId = identifier;
          this.iosVersion = deviceInfo.iOSVersion?.toString();
          this.battery = batteryLevel;
        }),
      );

    merge(versionNumber$, employeeId$, deviceInfo$)
      .subscribe();
  }

  createLog(logType: LogType, desc: string, error: string): Log {
    const log = {
      message: error,
      type: logType,
      timestamp: Date.now(),
      description: desc,
      appVersion: this.appVersion,
      iosVersion: this.iosVersion,
      deviceId: this.deviceId,
      drivingExaminerId: this.employeeId,
      metaData: {
        batteryLevel: this.battery,
        memUsed: this.deviceInfo?.memUsed,
        realDiskFree: this.deviceInfo?.realDiskFree,
        realDiskTotal: this.deviceInfo?.realDiskTotal,
      },
    };
    console.log('log', log);
    return log;
  }
}
