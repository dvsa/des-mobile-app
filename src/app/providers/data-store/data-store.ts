import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

import { Store } from '@ngrx/store';
import { SecureStorage, SecureStorageObject } from '@awesome-cordova-plugins/secure-storage/ngx';
import { LogType } from '@shared/models/log.model';
import { StoreModel } from '@shared/models/store.model';
import { SaveLog } from '@store/logs/logs.actions';
import { LogHelper } from '../logs/logs-helper';
import { Token } from '@providers/authentication/authentication';

export enum LocalStorageKey {
  COMPLETED_TESTS = 'COMPLETED_TESTS',
  CONFIG = 'CONFIG',
  JOURNAL = 'JOURNAL',
  LOGS = 'LOGS',
  TESTS = 'TESTS',
}

export type StorageKey = LocalStorageKey | Token;

@Injectable()
export class DataStoreProvider {

  private static readonly defaultStoreName = 'DES';
  secureContainer: SecureStorageObject = null;

  constructor(
    public platform: Platform,
    private logHelper: LogHelper,
    private store$: Store<StoreModel>,
    private secureStorage: SecureStorage,
    private storage: Storage,
  ) {
  }

  isIos = () => this.platform.is('cordova');

  /**
   * set storage container
   * @param container - container to set
   */
  setSecureContainer(container: SecureStorageObject): void {
    this.secureContainer = container;
  }

  /**
   * get storage container
   */
  getSecureContainer(): SecureStorageObject {
    return this.secureContainer;
  }

  async createContainer(): Promise<void> {
    try {
      const container: SecureStorageObject = await this.secureStorage.create(DataStoreProvider.defaultStoreName);
      this.setSecureContainer(container);
    } catch (err) {
      this.reportLog('createContainer', '', err, LogType.ERROR);
      throw err;
    }
  }

  /**
   * Get all stored keys
   * NOTE: secureContainer guard clause allows app to run in browser
   * @returns Promise
   */
  async getKeys(): Promise<string[]> {
    try {
      if (!this.isIos()) {
        return [''];
      }
      return await this.storage.keys();
    } catch (err) {
      this.reportLog('getting keys', '', err);
      throw err;
    }
  }

  /**
   * sets the value for specified key
   * NOTE: secureContainer guard clause allows app to run in browser
   * @param key - identifier
   * @param value - value to pair with key
   * @returns Promise
   */
  async setItem(key: StorageKey, value: unknown): Promise<string> {
    try {
      if (!this.isIos()) {
        return '';
      }
      return await this.storage.set(key, value);
    } catch (err) {
      this.reportLog('setting storage', key, err);
      throw err;
    }
  }

  /**
   * interrogate storage for specific key
   * @param key - identifier
   */
  async getItem(key: StorageKey): Promise<string> {
    try {
      if (!this.isIos()) {
        return '';
      }
      return await this.storage.get(key);
    } catch (err) {
      this.reportLog('getting storage', key, err);
      throw err;
    }
  }

  /**
   * removes the item for a given key
   * NOTE: secureContainer guard clause allows app to run in browser
   * @param key - identifier to remove
   * @returns Promise
   */
  async removeItem(key: StorageKey): Promise<string> {
    try {
      if (!this.isIos()) return '';

      return await this.storage.remove(key);
    } catch (err) {
      this.reportLog('removing', key, err);
      return Promise.resolve('');
    }
  }

  async migrateAllKeys(): Promise<void> {
    try {
      if (!this.secureContainer) {
        this.reportLog('migrateAllKeys', '', 'secureContainer not defined', LogType.ERROR);
        return;
      }

      const keys: string[] = await this.secureContainer.keys();

      await Promise.all(
        keys.map((key) => this.migrateKey(key)),
      );
    } catch {
      // don't return error as if not found, this is fine it might mean it's already been migrated
    }
  }

  async migrateKey(key: string): Promise<void> {
    try {
      // look to see if the key exists in keychain
      const keyChainItem = await this.secureContainer.get(key);

      // if found, then add that key/value to ionic storage and remove from keychain
      if (!!keyChainItem) {
        await this.storage.set(key, keyChainItem);
        await this.secureContainer.remove(key);
      }
    } catch {
      // don't return error if not found, this will be the case once the migration occurs
    }
  }

  private reportLog = (action: string, key: string, error: Error | unknown, level: LogType = LogType.ERROR): void => {
    this.store$.dispatch(SaveLog({
      payload: this.logHelper.createLog(
        level,
        `DataStoreProvider ${level} ${action} ${key}`,
        (error instanceof Error) ? error.message : JSON.stringify(error),
      ),
    }));
  };
}
