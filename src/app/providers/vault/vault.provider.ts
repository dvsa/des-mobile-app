import { Injectable } from '@angular/core';
import {
  BrowserVault,
  DeviceSecurityType,
  IdentityVaultConfig,
  Vault,
  VaultType,
} from '@ionic-enterprise/identity-vault';
import { Platform } from '@ionic/angular';
import { AuthResult } from '@ionic-enterprise/auth';

@Injectable({
  providedIn: 'root',
})
export class VaultProvider {
  private vault: Vault | BrowserVault;
  private static AUTH_RESULT_KEY = 'auth-result';
  private static IV_CONFIG: IdentityVaultConfig = {
    key: 'des-vault',
    type: VaultType.SecureStorage,
    deviceSecurityType: DeviceSecurityType.None,
    lockAfterBackgrounded: null,
    unlockVaultOnLoad: false,
  };

  constructor(private platform: Platform) {
  }

  public async init(): Promise<void> {
    this.vault = this.platform.is('capacitor')
      ? new Vault(VaultProvider.IV_CONFIG)
      : new BrowserVault(VaultProvider.IV_CONFIG);
  }

  public async clear(): Promise<void> {
    return this.vault.clear();
  }

  public async getValue(key: string): Promise<string> {
    return this.vault.getValue(key);
  }

  public async setValue<T>(key: string, value: T): Promise<void> {
    return this.vault.setValue(key, JSON.stringify(value));
  }

  public async getAuthResult(): Promise<AuthResult | null> {
    return this.vault.getValue<AuthResult>(VaultProvider.AUTH_RESULT_KEY);
  }

  public async setAuthResult(value: AuthResult): Promise<void> {
    return this.vault.setValue(VaultProvider.AUTH_RESULT_KEY, value);
  }
}
