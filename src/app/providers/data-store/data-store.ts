import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { SecureStorage, SecureStorageObject } from '@awesome-cordova-plugins/secure-storage/ngx';
import { LogType } from '@shared/models/log.model';
import { StoreModel } from '@shared/models/store.model';
import { SaveLog } from '@store/logs/logs.actions';
import { LogHelper } from '../logs/logs-helper';

@Injectable()
export class DataStoreProvider {

  private static readonly defaultStoreName = 'DES';
  secureContainer: SecureStorageObject = null;

  constructor(
    public platform: Platform,
    private logHelper: LogHelper,
    private store$: Store<StoreModel>,
    private secureStorage: SecureStorage,
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
      if (!this.isIos()) return [''];

      // create container if context is lost
      if (!this.secureContainer) await this.createContainer();

      return await this.secureContainer.keys();
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
  async setItem(key: string, value: any): Promise<string> {
    try {
      if (!this.isIos()) return '';

      // create container if context is lost
      if (!this.secureContainer) await this.createContainer();

      return await this.secureContainer.set(key, value);
    } catch (err) {
      this.reportLog('setting', key, err);
      throw err;
    }
  }

  /**
   * interrogate storage for specific key
   * @param key - identifier
   */
  async getItem(key: string): Promise<string> {
    try {
      if (!this.isIos()) return '';

      // create container if context is lost
      if (!this.secureContainer) await this.createContainer();

      return await this.secureContainer.get(key);
    } catch (err) {
      this.reportLog('getting', key, err);
      throw err;
    }
  }

  /**
   * removes the item for a given key
   * NOTE: secureContainer guard clause allows app to run in browser
   * @param key - identifier to remove
   * @returns Promise
   */
  async removeItem(key: string): Promise<string> {
    try {
      if (!this.isIos()) return '';

      // create container if context is lost
      if (!this.secureContainer) await this.createContainer();

      return await this.secureContainer.remove(key);
    } catch (err) {
      this.reportLog('removing', key, err);
      return Promise.resolve('');
    }
  }

  private reportLog = (action: string, key: string, error: Error | unknown, level: LogType = LogType.ERROR): void => {
    this.store$.dispatch(SaveLog({
      payload: this.logHelper.createLog(
        level,
        `${DataStoreProvider.name} ${level} ${action} ${key}`,
        (error instanceof Error) ? error.message : JSON.stringify(error),
      ),
    }));
  };
}
