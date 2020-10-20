import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SecureStorage, SecureStorageObject } from '@ionic-native/secure-storage/ngx';

@Injectable()
export class DataStoreProvider {

  defaultStoreName = 'DES';
  secureContainer: SecureStorageObject = null;
  tempStorage: [];

  constructor(
    public platform: Platform,
    private secureStorage: SecureStorage,
  ) {
  }

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

  getItem(key: string): Promise<string> {
    if (!this.secureContainer) {
      return Promise.resolve('');
    }
    return this.secureContainer.get(key).then((response: string) => {
      return response;
    });
  }
}
