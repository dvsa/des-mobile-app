import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { timeout, map } from 'rxjs/operators';
import { defer, Observable } from 'rxjs';
import { Device } from '@ionic-native/device/ngx';
import { LogType } from '@shared/models/log.model';
import { StoreModel } from '@shared/models/store.model';
import { SaveLog } from '@store/logs/logs.actions';
import { retryWithDelay } from '@shared/helpers/retry-with-delay';
import { IDeviceProvider } from './device.model';
import { AppConfigProvider } from '../app-config/app-config';
import { LogHelper } from '../logs/logs-helper';
import { ExaminerRole } from '../app-config/constants/examiner-role.constants';

declare let cordova: any;

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

  getUniqueDeviceId = (): string => {
    return this.device.uuid;
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

  isStarted = () => {
    const guidedAccess = cordova.plugins.WPGuidedAccess;

    return new Promise((resolve, reject) => {
      guidedAccess.isStarted(
        (started) => resolve(started),
        (err) => reject(err),
      );
    });
  };

  setSingleAppMode = async (enable: boolean): Promise<boolean> => {
    const guidedAccess = cordova.plugins.WPGuidedAccess;
    if (!guidedAccess) return;

    const started = await this.isStarted();

    if ((typeof started === 'boolean' && started && enable) || (typeof started === 'boolean' && !started && !enable)) {
      return Promise.resolve(true);
    }

    const method = enable ? 'start' : 'end';

    return new Promise((resolve, reject) => {
      guidedAccess[method](
        (didSucceed) => {
          if (!didSucceed) {
            const logMessage = `Call to ${enable ? 'enable' : 'disable'} ASAM ${didSucceed ? 'succeeded' : 'failed'}`;
            const logError = `${enable ? 'Enabling' : 'Disabling'} ASAM`;
            this.logEvent(logError, logMessage);
          }
          return resolve(didSucceed);
        },
        (err) => reject(err),
      );
    });
  };

  checkSingleAppMode = async (): Promise<boolean> => {

    const started = await this.isStarted();

    if (typeof started === 'boolean' && started) {
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  };

  manuallyDisableSingleAppMode = async () => {
    try {
      const guidedAccess = cordova.plugins.WPGuidedAccess;
      if (!guidedAccess) return;

      const started = await this.isStarted();

      if (!started) {
        return;
      }

      return await new Promise((resolve, reject) => {
        guidedAccess.end(
          (didSucceed) => {
            if (!didSucceed) throw new Error('Call to end guided access failed');
            resolve(didSucceed);
          },
          (err) => {
            this.logEvent('Manual trigger - Guided access end', err);
            reject(err);
          },
        );
      });
    } catch (err) {
      this.logEvent('Attempting to manually disable SAM error', err);
    }
  };

  private logEvent = (desc: string, err: any) => {
    this.store$.dispatch(SaveLog({
      payload: this.logHelper.createLog(LogType.ERROR, desc, err),
    }));
  };

}
