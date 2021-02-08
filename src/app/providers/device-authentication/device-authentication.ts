import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AppConfigProvider } from '../app-config/app-config';
import { ExaminerRole } from '../app-config/constants/examiner-role.constants';

declare let cordova: any;

@Injectable()
export class DeviceAuthenticationProvider {

  constructor(
    private platform: Platform,
    public appConfig: AppConfigProvider,
  ) { }

  triggerLockScreen = async (): Promise<boolean> => {
    if (this.appConfig.getAppConfig().role === ExaminerRole.DLG) {
      return Promise.resolve(false);
    }

    return new Promise<boolean>((resolve, reject) => {

      this.platform.ready().then(() => {

        if (!this.platform.is('ios')) {
          return (resolve(true));
        }
        if (cordova && cordova.plugins && cordova.plugins.DeviceAuthentication) {

          cordova.plugins.DeviceAuthentication.runAuthentication(
            'Please enter your passcode',
            (successful: boolean) => {
              return successful ? resolve(true) : reject(new Error('device authentication failed'));
            },
            (error) => {
              return reject(new Error(error));
            },
          );

        } else {
          return reject(new Error('no device authentication plugin found'));
        }
      });
    });
  };
}
