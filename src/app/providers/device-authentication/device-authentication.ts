import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { TestersEnvironmentFile } from '@environments/models/environment.model';
import { AppConfigProvider } from '../app-config/app-config';
import { ExaminerRole } from '../app-config/constants/examiner-role.constants';
import { NativeBiometric } from "capacitor-native-biometric";

@Injectable()
export class DeviceAuthenticationProvider {

  constructor(
    public appConfig: AppConfigProvider,
  ) { }

  async performBiometricVerification(): Promise<boolean> {
    // fallback to passcode if biometric authentication unavailable
    const result = await NativeBiometric.isAvailable({useFallback: true});
    if(!result.isAvailable) throw new Error('biometrics not available');
    return await NativeBiometric.verifyIdentity({
      reason: "Please authenticate",
      useFallback: true,
    })
  }

  triggerLockScreen = async (): Promise<boolean> => {
    if (this.appConfig.getAppConfig().role === ExaminerRole.DLG
        || (environment as unknown as TestersEnvironmentFile)?.isTest) {
      return Promise.resolve(false);
    }
    return this.performBiometricVerification();
  };
}
