import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { TestersEnvironmentFile } from '@environments/models/environment.model';
import { NativeBiometric } from 'capacitor-native-biometric';
import { Platform } from '@ionic/angular';
import { AppConfigProvider } from '../app-config/app-config';
import { ExaminerRole } from '../app-config/constants/examiner-role.constants';

@Injectable()
export class DeviceAuthenticationProvider {

  constructor(
    private platform: Platform,
    public appConfig: AppConfigProvider,
  ) { }

  triggerLockScreen = async (): Promise<boolean> => {
    try {
      await this.platform.ready();

      if (this.shouldBypassDeviceAuth()) {
        return false;
      }

      return await this.performBiometricVerification();
    } catch (err) {
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

  private performBiometricVerification = async (): Promise<boolean> => {
    // fallback to passcode if biometric authentication unavailable
    const result = await NativeBiometric.isAvailable({ useFallback: true });
    if (!result.isAvailable) throw new Error('Biometrics not available');

    return NativeBiometric.verifyIdentity({
      reason: 'Please authenticate',
      useFallback: true,
    });
  };
}
