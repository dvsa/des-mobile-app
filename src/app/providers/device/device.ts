import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { timeout, retry, map } from 'rxjs/operators';
import { defer, Observable } from 'rxjs';
import { Device } from '@ionic-native/device/ngx';
import { LogType } from '@shared/models/log.model';
import { StoreModel } from '@shared/models/store.model';
import { SaveLog } from '@store/logs/logs.actions';
import { IDeviceProvider } from './device.model';
import { AppConfigProvider } from '../app-config/app-config';
import { LogHelper } from '../logs/logs-helper';
import { ExaminerRole } from '../app-config/constants/examiner-role.constants';

declare let cordova: any;

@Injectable()
export class DeviceProvider implements IDeviceProvider {
  private supportedDevices: string[] = [];
  private enableASAMRetryLimit: number = 3;
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
    // if (this.appConfig.getAppConfig().role === ExaminerRole.DLG) {
    //   return Promise.resolve(false);
    // }
    // const enableAsamWithRetriesAndTimeout$: Observable<boolean> = defer(() => this.setSingleAppMode(true)).pipe(
    //   map((didSucceed: boolean): boolean => {
    //     if (!didSucceed) throw new Error('Call to enable ASAM failed');
    //     return didSucceed;
    //   }),
    //   retry(this.enableASAMRetryLimit),
    //   timeout(this.enableASAMTimeout),
    // );
    //
    // const promisifiedEnableAsamWithRetriesAndTimeout = enableAsamWithRetriesAndTimeout$.toPromise()
    //   .catch(() => {
    //     this.store$.dispatch(SaveLog({
    //       payload: this.logHelper.createLog(
    //         LogType.ERROR,
    //         null,
    //         this.enableASAMRetryFailureMessage,
    //       ),
    //     }));
    //   });
    //
    // return promisifiedEnableAsamWithRetriesAndTimeout;
    return this.setSingleAppMode(true);
  };

  disableSingleAppMode = async (): Promise<boolean> => {
    return this.setSingleAppMode(false);
  };

  // setSingleAppMode = (enabled: boolean): Promise<boolean> => {
  //   return new Promise((resolve, reject) => {
  //     if (cordova && cordova.plugins && cordova.plugins.ASAM) {
  //       cordova.plugins.ASAM.toggle(enabled, (didSucceed: boolean) => {
  //         const logMessage = `Call to ${enabled ? 'enable' : 'disable'} ASAM ${didSucceed ? 'succeeded' : 'failed'}`;
  //         if (!didSucceed) {
  //           const logError = `${enabled ? 'Enabling' : 'Disabling'} ASAM`;
  //           this.store$.dispatch(SaveLog({
  //             payload: this.logHelper.createLog(LogType.ERROR, logError, logMessage),
  //           }));
  //         }
  //         return resolve(didSucceed);
  //       });
  //     } else {
  //       return reject(new Error('false'));
  //     }
  //   });
  // };

  isStarted = () => {
    const guidedAccess = cordova.plugins.WPGuidedAccess;
    return guidedAccess.isStarted(
      (success) => {
        console.log('isStarted success', success);
      },
      (err) => {
        console.error('isStarted error', err);
      },
    );
  };

  setSingleAppMode = (enabled: boolean): Promise<boolean> => {
    // return new Promise((resolve, reject) => {
    //   if (cordova && cordova.plugins && cordova.plugins.ASAM) {
    //     cordova.plugins.ASAM.toggle(enabled, (didSucceed: boolean) => {
    //       const logMessage = `Call to ${enabled ? 'enable' : 'disable'} ASAM ${didSucceed ? 'succeeded' : 'failed'}`;
    //       if (!didSucceed) {
    //         const logError = `${enabled ? 'Enabling' : 'Disabling'} ASAM`;
    //         this.store$.dispatch(SaveLog({
    //           payload: this.logHelper.createLog(LogType.ERROR, logError, logMessage),
    //         }));
    //       }
    //       return resolve(didSucceed);
    //     });
    //   } else {
    //     return reject(new Error('false'));
    //   }
    // });

    const guidedAccess = cordova.plugins.WPGuidedAccess;
    console.log('guidedAccess', guidedAccess);

    if (!guidedAccess) {
      console.log('Guided access is not defined');
      return;
    }

    if (guidedAccess.isStarted() && enabled) {
      console.log('Guided access has already been started, but has been called to enable.');
      return;
    }

    // if (!guidedAccess.isStarted() && !enabled) {
    //   console.log('Guided access has already stopped and was calling with disable');
    //   return;
    // }

    console.log(`Calling guided access with ${enabled}`);

    try {
      if (enabled) {
        guidedAccess.start((res) => { console.log(res); }, (err) => { console.error(err); });
      } else {
        guidedAccess.end();
      }
    } catch (err) {
      console.error('ERR', err);
    }
    return Promise.resolve(true);
  };

}
