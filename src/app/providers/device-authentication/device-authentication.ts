import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { DeviceProvider } from '@providers/device/device';
import { LoadingProvider } from '@providers/loader/loader';
import { LogHelper } from '@providers/logs/logs-helper';
import { LogType } from '@shared/models/log.model';
import { StoreModel } from '@shared/models/store.model';
import { SaveLog } from '@store/logs/logs.actions';
import { NativeBiometric } from 'capacitor-native-biometric';
import { AppConfigProvider } from '../app-config/app-config';
import { ExaminerRole } from '../app-config/constants/examiner-role.constants';

@Injectable()
export class DeviceAuthenticationProvider {
  constructor(
    private platform: Platform,
    public appConfig: AppConfigProvider,
    private deviceProvider: DeviceProvider,
    private loadingProvider: LoadingProvider,
    private store$: Store<StoreModel>,
    private logHelper: LogHelper
  ) {}

  triggerLockScreen = async (isPracticeMode = false): Promise<boolean> => {
    try {
      await this.platform.ready();

      if (this.shouldBypassDeviceAuth()) return true;

      return await this.performBiometricVerification(isPracticeMode);
    } catch (err) {
      this.logEvent(err);
      throw new Error(err);
    }
  };

  private shouldBypassDeviceAuth = (): boolean => {
    return !this.platform.is('cordova') || this.appConfig.getAppConfig()?.role === ExaminerRole.DLG;
  };

  performBiometricVerification = async (isPracticeMode = false): Promise<boolean> => {
    let successfullyAuthenticated = true;
    try {
      await this.loadingProvider.handleUILoading(true);
      await this.deviceProvider.disableSingleAppMode();
      // Wait for a short duration to ensure that single app mode is disabled fully (THIS CODE WILL NOT WORK CONSISTENTLY ON IPADOS 26 IF THIS LINE IS NOT PRESENT)
      await new Promise((resolve) => setTimeout(resolve, 75));
      await NativeBiometric.verifyIdentity({
        reason: 'Please authenticate',
        useFallback: true, // fallback to passcode if biometric authentication unavailable
      });
    } catch (err) {
      successfullyAuthenticated = false;
      this.logEvent(err);
    } finally {
      if (!isPracticeMode) {
        await this.deviceProvider.enableSingleAppMode();
      }
      await this.loadingProvider.handleUILoading(false);
    }
    return successfullyAuthenticated;
  };

  public logEvent = (err: Error) => {
    this.store$.dispatch(
      SaveLog({
        payload: this.logHelper.createLog(LogType.ERROR, 'Device auth', err),
      })
    );
  };
}
