import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { SecureStorageObject } from '@ionic-native/secure-storage/ngx';
import { LogHelper } from '../logs/logs-helper';
import { LogType } from '../../shared/models/log.model';
import { StoreModel } from '../../shared/models/store.model';
import { SaveLog } from '../../../store/logs/logs.actions';

@Injectable()
export class DataStoreProvider {

  defaultStoreName = 'DES';

  secureContainer: SecureStorageObject = null;

  tempStorage: [];

  constructor(
    public platform: Platform,
    private logHelper: LogHelper,
    private store$: Store<StoreModel>,
  ) {
  }

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

  /**
   * sets the value for specified key
   * NOTE: secureContainer guard clause allows app to run in browser
   * @param key - identifier
   * @param value - value to pair with key
   * @returns Promise
   */
  setItem(key: string, value: any): Promise<string> {
    if (!this.secureContainer) {
      return Promise.resolve('');
    }
    return this.secureContainer.set(key, value).then((response: string) => {
      return response;
    }).catch((error) => {
      return error;
    });
  }

  /**
   * interrogate storage for specific key
   * @param key - identifier
   */
  getItem(key: string): Promise<string> {
    if (!this.secureContainer) {
      return Promise.resolve('');
    }
    return this.secureContainer.get(key).then((response: string) => {
      return response;
    });
  }

  /**
   * removes the item for a given key
   * NOTE: secureContainer guard clause allows app to run in browser
   * @param key - identifier to remove
   * @returns Promise
   */
  removeItem(key: string): Promise<string> {
    if (!this.secureContainer) {
      return Promise.resolve('');
    }
    return this.secureContainer.remove(key).catch((error) => {
      this.store$.dispatch(SaveLog({
        payload: this.logHelper.createLog(LogType.ERROR, `DataStoreProvider error removing ${key}`, error.message),
      }));
      return Promise.resolve('');
    });
  }
}
