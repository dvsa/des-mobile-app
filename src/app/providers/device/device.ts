import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, timeout } from 'rxjs/operators';
import { defer, lastValueFrom, retry } from 'rxjs';
import { Asam } from '@dvsa/capacitor-plugin-asam';
import { Device } from '@capacitor/device';

import { LogType } from '@shared/models/log.model';
import { StoreModel } from '@shared/models/store.model';
import { SaveLog } from '@store/logs/logs.actions';
import { AppConfigProvider } from '../app-config/app-config';
import { LogHelper } from '../logs/logs-helper';
import { ExaminerRole } from '../app-config/constants/examiner-role.constants';

@Injectable()
export class DeviceProvider {
  private enableASAMRetryLimit: number = 4;
  private enableASAMRetryInternal: number = 750;
  private enableASAMTimeout: number = 10000;
  private asamRetryFailureMessage = (action: 'enable' | 'disable') => `All retries to ${action} ASAM failed`;

  constructor(
    public appConfig: AppConfigProvider,
    private store$: Store<StoreModel>,
    private logHelper: LogHelper,
  ) {
  }

  validDeviceType = async (): Promise<boolean> => {
    const appConf = this.appConfig.getAppConfig();

    if (!appConf || !appConf?.approvedDeviceIdentifiers) return false;

    const model = await this.getDeviceType();

    return appConf.approvedDeviceIdentifiers.some((device) => device === model);
  };

  getDeviceType = async (): Promise<string> => {
    const { model } = await Device.getInfo();
    return model;
  };

  getDeviceName = async (): Promise<string> => {
    const { name } = await Device.getInfo();
    return name;
  };

  getDeviceInfo = () => Device.getInfo();

  getBatteryInfo = () => Device.getBatteryInfo();

  getUniqueDeviceId = async (): Promise<string> => {
    const { identifier } = await Device.getId();
    return identifier;
  };

  enableSingleAppMode = async (): Promise<boolean> => {
    if (this.appConfig.getAppConfig()?.role === ExaminerRole.DLG) {
      return Promise.resolve(false);
    }
    return this.setSingleAppModeWithRetry(true);
  };

  disableSingleAppMode = async (): Promise<boolean> => this.setSingleAppModeWithRetry(false);

  setSingleAppMode = async (enable: boolean): Promise<boolean> => {
    const asamResult = await Asam.setSingleAppMode({ shouldEnable: enable });
    if (!asamResult.didSucceed) {
      const logMessage = `Call to ${enable ? 'enable' : 'disable'} ASAM failed`;
      const logError = `${enable ? 'Enabling' : 'Disabling'} ASAM`;
      this.logEvent(logError, logMessage);
    }
    return asamResult.didSucceed;
  };

  isSAMEnabled = async (): Promise<boolean> => {
    const status = await Asam.isSingleAppModeEnabled();
    return status.isEnabled;
  };

  manuallyDisableSingleAppMode = async () => {
    const disable = await Asam.setSingleAppMode({ shouldEnable: false });
    if (!disable.didSucceed) {
      this.logEvent('Failed to manually disable ASAM', 'no error details');
    }
  };

  private setSingleAppModeWithRetry = async (enable: boolean): Promise<boolean> => {
    const action = enable ? 'enable' : 'disable';

    return lastValueFrom(
      // call `setSingleAppMode`
      defer(() => this.setSingleAppMode(enable))
        .pipe(
          map((didSucceed: boolean): boolean => {
            // each failure will produce a single log
            if (!didSucceed) {
              throw new Error(`Call to ${action} ASAM failed`);
            }
            return didSucceed;
          }),
          // if the call fails, then retry this.enableASAMRetryLimit times.
          // there will be an interval of this.enableASAMTimeout between each retry
          retry({
            count: this.enableASAMRetryLimit,
            delay: this.enableASAMRetryInternal,
          }),
          // the call will bail out if no response within this.enableASAMTimeout
          timeout(this.enableASAMTimeout),
        ),
    )
      // if the retry threshold is hit, then dispatch log
      .catch(() => {
        this.store$.dispatch(SaveLog({
          payload: this.logHelper.createLog(LogType.ERROR, null, this.asamRetryFailureMessage(action)),
        }));
        return false;
      });
  };

  private logEvent = (desc: string, err: any) => {
    this.store$.dispatch(SaveLog({
      payload: this.logHelper.createLog(LogType.ERROR, desc, err),
    }));
  };

}
