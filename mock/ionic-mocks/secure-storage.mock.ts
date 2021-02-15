import { SecureStorageObject } from '@ionic-native/secure-storage';

export class SecureStorageMock {

  create(store: string): Promise<SecureStorageObject> {
    return Promise.resolve({} as SecureStorageObject);
  };
}
