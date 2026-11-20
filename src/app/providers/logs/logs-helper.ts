import { Injectable, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Device } from '@capacitor/device';
import { Store } from '@ngrx/store';
import { from } from 'rxjs';

import { NetworkConnectionStatus, NetworkStateProvider } from '@providers/network-state/network-state';
import { serialiseLogMessage } from '@shared/helpers/serialise-log-message';
import { Log, LogType } from '@shared/models/log.model';
import { StoreModel } from '@shared/models/store.model';
import { selectEmployeeId, selectVersionNumber } from '@store/app-info/app-info.selectors';

@Injectable({
  providedIn: 'root',
})
export class LogHelper {
  private readonly appVersion = this.store$.selectSignal(selectVersionNumber);
  private readonly employeeId = this.store$.selectSignal(selectEmployeeId);
  private readonly deviceDetails = toSignal(
    from(Promise.all([Device.getId(), Device.getInfo(), Device.getBatteryInfo()]))
  );
  private readonly deviceInfo = computed(() => this.deviceDetails()?.[1]);

  constructor(
    private store$: Store<StoreModel>,
    private networkStateProvider: NetworkStateProvider
  ) {}

  createLog(logType: LogType, desc: string, msg: unknown): Log {
    return {
      message: serialiseLogMessage(msg),
      type: logType,
      timestamp: Date.now(),
      description: desc,
      appVersion: this.appVersion(),
      iosVersion: this.deviceInfo()?.osVersion?.toString(),
      deviceId: this.deviceDetails()?.[0].identifier,
      drivingExaminerId: this.employeeId(),
      metaData: {
        online: this.networkStateProvider.getNetworkState() === NetworkConnectionStatus.ONLINE,
        batteryLevel: this.deviceDetails()?.[2].batteryLevel,
        memUsed: this.deviceInfo()?.memUsed,
      },
    };
  }
}
