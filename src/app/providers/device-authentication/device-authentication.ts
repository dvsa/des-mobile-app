import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { TestersEnvironmentFile } from '@environments/models/environment.model';
import { NativeBiometric } from 'capacitor-native-biometric';
import { Platform } from '@ionic/angular';
import { DeviceProvider } from '@providers/device/device';
import { LoadingProvider } from '@providers/loader/loader';
import { SaveLog } from '@store/logs/logs.actions';
import { LogType } from '@shared/models/log.model';
import { StoreModel } from '@shared/models/store.model';
import { LogHelper } from '@providers/logs/logs-helper';
import { Store } from '@ngrx/store';
import { ExaminerRole } from '../app-config/constants/examiner-role.constants';
import { AppConfigProvider } from '../app-config/app-config';

@Injectable()
export class DeviceAuthenticationProvider {

  constructor(
    private platform: Platform,
    public appConfig: AppConfigProvider,
    private deviceProvider: DeviceProvider,
    private loadingProvider: LoadingProvider,
    private store$: Store<StoreModel>,
    private logHelper: LogHelper,
  ) {
  }

  triggerLockScreen = async (isPracticeMode: boolean = false): Promise<void> => {
    try {
      await this.platform.ready();

      if (this.shouldBypassDeviceAuth()) {
        return;
      }

      return await this.performBiometricVerification(isPracticeMode);
    } catch (err) {
      this.logEvent(err);
      throw new Error(err);
    }
  };

  private shouldBypassDeviceAuth = (): boolean => {
    return (
      !this.platform.is('cordova')
      || this.appConfig.getAppConfig()?.role === ExaminerRole.DLG
      || (environment as unknown as TestersEnvironmentFile)?.isTest
    );
  };

  private performBiometricVerification = async (isPracticeMode: boolean = false): Promise<void> => {
    try {
      await this.deviceProvider.disableSingleAppMode();

      await NativeBiometric.verifyIdentity({
        reason: 'Please authenticate',
        useFallback: true, // fallback to passcode if biometric authentication unavailable
      });
    } finally {
      if (!isPracticeMode) {
        await this.loadingProvider.handleUILoading(true);
        await this.deviceProvider.enableSingleAppMode();
        await this.loadingProvider.handleUILoading(false);
      }
    }
  };

  public logEvent = (err: any) => {
    this.store$.dispatch(SaveLog({
      payload: this.logHelper.createLog(LogType.ERROR, 'Device auth', err),
    }));
  };
}
