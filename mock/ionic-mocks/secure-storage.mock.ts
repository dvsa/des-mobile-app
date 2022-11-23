import { SecureStorageObject } from '@awesome-cordova-plugins/secure-storage/ngx';

export class SecureStorageMock {

  create(store: string): Promise<SecureStorageObject> {
    return Promise.resolve({} as SecureStorageObject);
  };
}
