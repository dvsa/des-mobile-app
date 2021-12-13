/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Store } from '@ngrx/store';
import {
  Vault, VaultType, DeviceSecurityType, BrowserVault, IdentityVaultConfig,
} from '@ionic-enterprise/identity-vault';

import { LogType } from '@shared/models/log.model';
import { StoreModel } from '@shared/models/store.model';
import { SaveLog } from '@store/logs/logs.actions';
import { Token } from '@providers/authentication/authentication';
import { LogHelper } from '../logs/logs-helper';

@Injectable()
export class DataStoreProvider {
  private static vaultName: string = 'DES';
  private _vault: Vault | BrowserVault;

  constructor(
    private platform: Platform,
    private logHelper: LogHelper,
    private store$: Store<StoreModel>,
  ) {
  }

  initialiseVault = (): void => {
    this._vault = this.platform.is('cordova')
      ? new Vault(DataStoreProvider.vaultConfig)
      : new BrowserVault(DataStoreProvider.vaultConfig);
  };

  clearVault = async (): Promise<void> => {
    try {
      await this._vault.clear();
      this._vault = null;
    } catch (err) {
      this.logError('clearVault', '', err.message);
      return err;
    }
  };

  getKeys = async (): Promise<string[]> => {
    try {
      if (await this._vault.isEmpty()) {
        return [];
      }
      return await this._vault.getKeys();
    } catch (err) {
      this.logError('getKeys', '', err.message);
      return [];
    }
  };

  setItem = async (key: string, value: string): Promise<void> => {
    try {
      await this._vault.setValue(key, value);
    } catch (err) {
      this.logError('setItem', key, err.message);
      return err;
    }
  };

  getItem = async (key: string): Promise<string | null> => {
    try {
      if (await this._vault.isEmpty()) {
        return null;
      }
      return await this._vault.getValue(key);
    } catch (err) {
      this.logError('getItem', key, err.message);
      return err;
    }
  };

  removeItem = async (key: string): Promise<void> => {
    try {
      if (await this._vault.isEmpty()) {
        return;
      }
      await this._vault.removeValue(key);
    } catch (err) {
      this.logError('removeItem', key, err.message);
      return err;
    }
  };

  getToken = async (token: Token, clientID: string): Promise<string> => this.getItem(`_ionicAuth.${token}.${clientID}`);

  get vault(): Vault | BrowserVault {
    return this._vault;
  }

  private logError = (method: string, key: string, errMsg: string): void => {
    this.store$.dispatch(SaveLog({
      payload: this.logHelper.createLog(LogType.ERROR, `DataStoreProvider error ${method} ${key}`, errMsg),
    }));
  };

  private static get vaultConfig(): IdentityVaultConfig {
    return {
      key: DataStoreProvider.vaultName,
      type: VaultType.SecureStorage,
      deviceSecurityType: DeviceSecurityType.Both,
      shouldClearVaultAfterTooManyFailedAttempts: false,
    };
  }
}
