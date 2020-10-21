import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SecureStorageObject } from '@ionic-native/secure-storage/ngx';

@Injectable()
export class DataStoreProvider {

  defaultStoreName = 'DVSAApp';
  secureContainer: SecureStorageObject = null;
  tempStorage: [];

  constructor(
    public platform: Platform,
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
      console.error(`error removing ${key}. Error is: ${error.message}`);
      return Promise.resolve('');
    });
  }
}
