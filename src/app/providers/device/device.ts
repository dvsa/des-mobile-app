import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, timeout } from 'rxjs/operators';
import { defer, Observable } from 'rxjs';
import { Device } from '@awesome-cordova-plugins/device/ngx';
import { LogType } from '@shared/models/log.model';
import { StoreModel } from '@shared/models/store.model';
import { SaveLog } from '@store/logs/logs.actions';
import { retryWithDelay } from '@shared/helpers/retry-with-delay';
import { isAnyOf } from '@shared/helpers/simplifiers';
import { Asam } from '@dvsa/capacitor-plugin-asam';
import { IDeviceProvider } from './device.model';
import { AppConfigProvider } from '../app-config/app-config';
import { LogHelper } from '../logs/logs-helper';
import { ExaminerRole } from '../app-config/constants/examiner-role.constants';

// Descriptive / Friendly mappings found here - https://www.theiphonewiki.com/wiki/Models
enum FriendlyDeviceModel {
  iPAD_AIR_3RD_GEN = 'iPad Air (3rd generation)',
  iPAD_8TH_GEN = 'iPad (8th generation)',
  iPAD_9TH_GEN = 'iPad (9th generation)',
  iPAD_PRO_10_5_INCH = 'iPad Pro (10.5-inch)',
}

@Injectable()
export class DeviceProvider implements IDeviceProvider {
  private supportedDevices: string[] = [];
  private enableASAMRetryLimit: number = 4;
  private enableASAMRetryInternal: number = 750;
  private enableASAMTimeout: number = 10000;
  private enableASAMRetryFailureMessage: string = 'All retries to enable ASAM failed';

  constructor(
    public appConfig: AppConfigProvider,
    private store$: Store<StoreModel>,
    private logHelper: LogHelper,
    private device: Device,
  ) {
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
    return this.device.model;
  };

  getDescriptiveDeviceName = (): string => {
    const deviceModel = this.getDeviceType();

    switch (deviceModel) {
      case 'iPad7,3':
      case 'iPad7,4':
        return FriendlyDeviceModel.iPAD_PRO_10_5_INCH;
      case 'iPad11,4':
        return FriendlyDeviceModel.iPAD_AIR_3RD_GEN;
      case 'iPad11,6':
      case 'iPad11,7':
        return FriendlyDeviceModel.iPAD_8TH_GEN;
      case 'iPad12,2':
        return FriendlyDeviceModel.iPAD_9TH_GEN;
      default:
        return deviceModel;
    }
  };

  getUniqueDeviceId = (): string => {
    return this.device.uuid;
  };

  is8thGenDevice = (deviceType: string): boolean => isAnyOf(deviceType, ['iPad11,6', 'iPad11,7']);

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

    const enableAsamWithRetriesAndTimeout$: Observable<boolean> = defer(() => this.setSingleAppMode(true))
      .pipe(
        map((didSucceed: boolean): boolean => {
          if (!didSucceed) throw new Error('Call to enable ASAM failed');
          return didSucceed;
        }),
        retryWithDelay(this.enableASAMRetryInternal, this.enableASAMRetryLimit),
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
    return (await Asam.isSingleAppModeEnabled()).isEnabled;
  };

  manuallyDisableSingleAppMode = async () => {
    const disable = await Asam.setSingleAppMode({ shouldEnable: false });
    if (!disable.didSucceed) {
      this.logEvent('Failed to manually disable ASAM', 'no error details');
    } else {
      this.logEvent('Success with manually disabling ASAM', '');
    }
  };

  private logEvent = (desc: string, err: any) => {
    this.store$.dispatch(SaveLog({
      payload: this.logHelper.createLog(LogType.ERROR, desc, err),
    }));
  };

}
