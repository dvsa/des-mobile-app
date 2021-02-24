import { Injectable } from '@angular/core';
import { Device, DeviceInfo } from '@capacitor/core';
import { Store } from '@ngrx/store';
import { timeout, retry, map, tap } from 'rxjs/operators';
import { defer, from, Observable } from 'rxjs';
import { IDeviceProvider } from './device.model';
import { AppConfigProvider } from '../app-config/app-config';
import { SaveLog } from '../../../store/logs/logs.actions';
import { LogType } from '../../shared/models/log.model';
import { StoreModel } from '../../shared/models/store.model';
import { LogHelper } from '../logs/logs-helper';
import { ExaminerRole } from '../app-config/constants/examiner-role.constants';

declare let cordova: any;

@Injectable()
export class DeviceProvider implements IDeviceProvider {
  private supportedDevices: string[] = [];
  private enableASAMRetryLimit: number = 3;
  private enableASAMTimeout: number = 10000;
  private enableASAMRetryFailureMessage: string = 'All retries to enable ASAM failed';
  private deviceInfo: DeviceInfo;

  constructor(
    public appConfig: AppConfigProvider,
    private store$: Store<StoreModel>,
    private logHelper: LogHelper,
  ) {
    from(Device.getInfo()).pipe(
      map((deviceInfo: DeviceInfo) => { this.deviceInfo = deviceInfo; }),
    ).subscribe();
  }

  validDeviceType = (): boolean => {
    const model = this.getDeviceType();
    this.supportedDevices = this.appConfig.getAppConfig().approvedDeviceIdentifiers;
    if (this.supportedDevices.findIndex((device) => device === model) > -1) {
      return true;
    }
    return false;
  };

  getDeviceType = (): string => {
    return this.deviceInfo?.model;
  };

  getUniqueDeviceId = (): string => {
    return this.deviceInfo?.uuid;
  };

  /**
   * [enableSingleAppMode description]
   *
   * @returns Promise<any>
   *
   * Runs setSingleAppMode(true) and retries a number
   * of times, eventually timing out after a specified
   * duration.
   *
   * This method is designed to execute and complete
   * in the background without blocking the user.
   * If after retrying, ASAM still failed to enable,
   * a unique log is sent.
  */
  enableSingleAppMode = async (): Promise<any> => {
    if (this.appConfig.getAppConfig().role === ExaminerRole.DLG) {
      return Promise.resolve(false);
    }
    const enableAsamWithRetriesAndTimeout$: Observable<boolean> = defer(() => this.setSingleAppMode(true)).pipe(
      map((didSucceed: boolean): boolean => {
        if (!didSucceed) throw new Error('Call to enable ASAM failed');
        return didSucceed;
      }),
      retry(this.enableASAMRetryLimit),
      timeout(this.enableASAMTimeout),
    );

    const promisifiedEnableAsamWithRetriesAndTimeout = enableAsamWithRetriesAndTimeout$.toPromise()
      .catch(() => {
        this.store$.dispatch(SaveLog({
          payload: this.logHelper.createLog(
            LogType.ERROR,
            null,
            this.enableASAMRetryFailureMessage,
          ),
        }));
      });

    return promisifiedEnableAsamWithRetriesAndTimeout;
  };

  disableSingleAppMode = async (): Promise<boolean> => {
    return this.setSingleAppMode(false);
  };

  setSingleAppMode = (enabled: boolean): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      if (cordova && cordova.plugins && cordova.plugins.ASAM) {
        cordova.plugins.ASAM.toggle(enabled, (didSucceed: boolean) => {
          const logMessage = `Call to ${enabled ? 'enable' : 'disable'} ASAM ${didSucceed ? 'succeeded' : 'failed'}`;
          if (!didSucceed) {
            const logError = `${enabled ? 'Enabling' : 'Disabling'} ASAM`;
            this.store$.dispatch(SaveLog({
              payload: this.logHelper.createLog(LogType.ERROR, logError, logMessage),
            }));
          }
          return resolve(didSucceed);
        });
      } else {
        return reject(new Error('false'));
      }
    });
  };

}
