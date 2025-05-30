import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

import { SecureStorage, SecureStorageObject } from '@awesome-cordova-plugins/secure-storage/ngx';
import { Store } from '@ngrx/store';
import { Token } from '@providers/authentication/authentication';
import { serialiseLogMessage } from '@shared/helpers/serialise-log-message';
import { LogType } from '@shared/models/log.model';
import { StoreModel } from '@shared/models/store.model';
import { SaveLog } from '@store/logs/logs.actions';
import CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';
import { get } from 'lodash-es';
import { LogHelper } from '../logs/logs-helper';

export enum LocalStorageKey {
  COMPLETED_TESTS = 'COMPLETED_TESTS',
  CONFIG = 'CONFIG',
  JOURNAL = 'JOURNAL',
  LOGS = 'LOGS',
  STORAGE_MIGRATED = 'STORAGE_MIGRATED',
  TESTS = 'TESTS',
  EXAMINER_STATS_KEY = 'EXAMINER_STAT_PREFERENCES',
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
    private storage: Storage
  ) {}

  async initializeStore() {
    try {
      await this.storage.defineDriver(CordovaSQLiteDriver);
      this.storage = await this.storage.create();
      console.log('driver', this.storage.driver);

      await this.storage.get(LocalStorageKey.EXAMINER_STATS_KEY).then((value: string) => {
        if (value) {
          console.log('examiner pre parse', value);
        }
      });

      try {
        const oldData: JSON = await this.getOldData();
        if (oldData) {
          for (const key in oldData) {
            await this.storage.get(LocalStorageKey.EXAMINER_STATS_KEY).then((value) => {
              if (value && key) {
                console.log('old pull:', key, ' ', value);
              }
            });
            await this.storage.set(key, JSON.stringify(oldData[key]));
            await this.storage.get(LocalStorageKey.EXAMINER_STATS_KEY).then((value) => {
              if (value && key) {
                console.log('new pull:', key, ' ', value);
              }
            });
          }
          await this.storage.get(LocalStorageKey.EXAMINER_STATS_KEY).then((value) => {
            if (value && oldData) {
              console.log('new pref', value);
              console.log('migrated from old data:', oldData[LocalStorageKey.EXAMINER_STATS_KEY]);
            }
          });
        } else {
          console.log('No old data found to migrate.');
        }
      } catch (err) {
        console.error('didnt work', err);
      }

      // await this.clearIndexedDB();
    } catch (err) {
      this.reportLog('init', '', err);
      throw err;
    }
  }

  async getOldDataKey(key: string, objectStore: IDBObjectStore): Promise<JSON> {
    return new Promise((resolve, reject) => {
      const dataGet = objectStore.get(key);
      dataGet.onsuccess = (event) => {
        try {
          const value = get(event, 'target.result');
          resolve(JSON.parse(value));
        } catch (err) {
          reject(err);
        }
      };
      dataGet.onerror = (event) => {
        reject(get(event, 'target.error'));
      };
    });
  }

  async getOldData(): Promise<JSON> {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open('_ionicstorage');
      request.onsuccess = async (event) => {
        const result: IDBDatabase = get(event, 'target.result');
        if (result) {
          console.log('result', result);
          const list = Array.from(result.objectStoreNames);
          if (list.length > 0) {
            console.log('list', list);
            const idbTransaction = result.transaction(list, 'readonly');
            console.log('idbTransaction', idbTransaction);
            if (idbTransaction) {
              const request = idbTransaction.objectStore('_ionickv');
              console.log('request', request);
              const holdingJSON = {};
              for (const key of [LocalStorageKey.JOURNAL, LocalStorageKey.EXAMINER_STATS_KEY]) {
                holdingJSON[key] = await this.getOldDataKey(key, request);
              }
              console.log('holdingJSON', holdingJSON);
              resolve(holdingJSON as JSON);
            }
          } else {
            console.log('No object stores found in IndexedDB.');
            resolve(null);
          }
        }
      };
      request.onerror = (event) => {
        reject(get(event, 'target.error'));
      };
    });
  }

  async clearIndexedDB() {
    try {
      // Clear all IndexedDB databases
      (await window.indexedDB.databases()).forEach((db) => {
        window.indexedDB.deleteDatabase(db.name);
      });
    } catch (err) {
      this.reportLog('clearIndexedDB', '', err, LogType.ERROR);
      throw err;
    }
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

  async hasStorageBeenMigrated(): Promise<boolean> {
    try {
      const migrated = await this.storage.get(LocalStorageKey.STORAGE_MIGRATED);
      return migrated === 'true';
    } catch (err) {
      this.reportLog('hasStorageBeenMigrated', '', err, LogType.ERROR);
      return false;
    }
  }

  async migrateAllKeys(): Promise<void> {
    try {
      if (!this.secureContainer) {
        this.reportLog('migrateAllKeys', '', 'secureContainer not defined', LogType.ERROR);
        return;
      }

      this.reportLog('migrateAllKeys', '', 'Attempting to migrate keys', LogType.INFO);

      const keys: string[] = await this.secureContainer.keys();

      await Promise.all(keys.map((key) => this.migrateKey(key)));

      await this.storage.set(LocalStorageKey.STORAGE_MIGRATED, 'true');

      this.reportLog('migrateAllKeys', '', 'All keys migrated', LogType.DEBUG);
    } catch (err) {
      await this.storage.set(LocalStorageKey.STORAGE_MIGRATED, 'false');

      this.reportLog('migrateAllKeys', '', err, LogType.ERROR);
    }
  }

  async migrateKey(key: string): Promise<void> {
    try {
      // look to see if the key exists in keychain
      const keyChainItem = await this.secureContainer.get(key);

      // if found, then add that key/value to storage and remove from keychain
      if (keyChainItem) {
        await this.storage.set(key, keyChainItem);
        await this.secureContainer.remove(key);
      }
    } catch (err) {
      this.reportLog('migrateKey', key, err, LogType.ERROR);
    }
  }

  private reportLog = (action: string, key: string, error: Error | unknown, level: LogType = LogType.ERROR): void => {
    this.store$.dispatch(
      SaveLog({
        payload: this.logHelper.createLog(
          level,
          `DataStoreProvider ${level} ${action} ${key}`,
          serialiseLogMessage(error)
        ),
      })
    );
  };
}
