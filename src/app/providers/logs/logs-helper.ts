import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Device } from '@capacitor/device';
import { BatteryInfo, DeviceId, DeviceInfo } from '@capacitor/device/dist/esm/definitions';
import { concatAll, map, tap, toArray } from 'rxjs/operators';
import { from, merge } from 'rxjs';

import { Log, LogType } from '@shared/models/log.model';
import { StoreModel } from '@shared/models/store.model';
import { selectEmployeeId, selectVersionNumber } from '@store/app-info/app-info.selectors';
import { ConnectionStatus, NetworkStateProvider } from '@providers/network-state/network-state';

@Injectable()
export class LogHelper {
  private appVersion: string;
  private employeeId: string;
  private deviceId: string;
  private iosVersion: string;
  private deviceInfo: DeviceInfo;
  private battery: number;

  constructor(
    private store$: Store<StoreModel>,
    private networkStateProvider: NetworkStateProvider,
  ) {

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
        tap(([id, deviceInfo, battery]) => {
          this.deviceId = (id as DeviceId).identifier;
          this.iosVersion = (deviceInfo as DeviceInfo).osVersion?.toString();
          this.deviceInfo = deviceInfo as DeviceInfo;
          this.battery = (battery as BatteryInfo).batteryLevel;
        }),
      );

    merge(versionNumber$, employeeId$, deviceInfo$)
      .subscribe();
  }

  createLog(logType: LogType, desc: string, error: string): Log {
    return {
      message: error,
      type: logType,
      timestamp: Date.now(),
      description: desc,
      appVersion: this.appVersion,
      iosVersion: this.iosVersion,
      deviceId: this.deviceId,
      drivingExaminerId: this.employeeId,
      metaData: {
        online: this.networkStateProvider.getNetworkState() === ConnectionStatus.ONLINE,
        batteryLevel: this.battery,
        memUsed: this.deviceInfo?.memUsed,
        realDiskFree: this.deviceInfo?.realDiskFree,
        realDiskTotal: this.deviceInfo?.realDiskTotal,
      },
    };
  }
}
