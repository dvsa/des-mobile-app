import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

import { Store } from '@ngrx/store';
import { Token } from '@providers/authentication/authentication';
import { serialiseLogMessage } from '@shared/helpers/serialise-log-message';
import { LogType } from '@shared/models/log.model';
import { StoreModel } from '@shared/models/store.model';
import { SaveLog } from '@store/logs/logs.actions';
import CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';
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
  constructor(
    public platform: Platform,
    private logHelper: LogHelper,
    private store$: Store<StoreModel>,
    private storage: Storage
  ) {}

  async initialiseStorage(): Promise<void> {
    try {
      // Add the CordovaSQLiteDriver to the storage instance
      await this.storage.defineDriver(CordovaSQLiteDriver);
      await this.storage.create();
    } catch (err) {
      this.reportLog('initialiseStorage', '', err, LogType.ERROR);
      throw err;
    }
  }

  isIos = () => this.platform.is('cordova');

  /**
   * Get all stored keys
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
