import { TestBed } from '@angular/core/testing';
import { SecureStorageObject } from '@awesome-cordova-plugins/secure-storage';
import { SecureStorage } from '@awesome-cordova-plugins/secure-storage/ngx';
import { Capacitor } from '@capacitor/core';
import { Platform } from '@ionic/angular';
import { Drivers } from '@ionic/storage';
import { Storage } from '@ionic/storage-angular';
import { PlatformMock } from '@mocks/ionic-mocks/platform-mock';
import { StorageMock } from '@mocks/ionic-mocks/storage.mock';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { DataStoreProvider, LocalStorageKey } from '@providers/data-store/data-store';
import { LogHelperMock } from '@providers/logs/__mocks__/logs-helper.mock';
import { LogHelper } from '@providers/logs/logs-helper';
import { Log, LogType } from '@shared/models/log.model';
import { StoreModel } from '@shared/models/store.model';
import { SaveLog } from '@store/logs/logs.actions';
import CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';

describe('DataStoreProvider', () => {
  let provider: DataStoreProvider;
  let store$: Store<StoreModel>;
  let platform: Platform;
  let secureStorage: SecureStorage;
  let storage: Storage;
  const secureStorageMock: jasmine.SpyObj<SecureStorage> = jasmine.createSpyObj('SecureStorage', {
    create: Promise.resolve({} as SecureStorageObject),
  });
  const mockStorage = {
    [LocalStorageKey.CONFIG]: 'this is the data we want',
    otherKey: 'this is other random data',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DataStoreProvider,
        {
          provide: LogHelper,
          useClass: LogHelperMock,
        },
        {
          provide: Platform,
          useClass: PlatformMock,
        },
        {
          provide: SecureStorage,
          useValue: secureStorageMock,
        },
        {
          provide: Storage,
          useClass: StorageMock,
        },
        provideMockStore(),
      ],
    });

    provider = TestBed.inject(DataStoreProvider);
    store$ = TestBed.inject(Store);
    platform = TestBed.inject(Platform);
    secureStorage = TestBed.inject(SecureStorage);
    storage = TestBed.inject(Storage);
    spyOn(store$, 'dispatch');
    spyOn(platform, 'is').and.returnValue(true);
    secureStorage.create = jasmine.createSpy().and.returnValue(Promise.resolve({} as SecureStorageObject));
  });

  describe('attemptDataStoreMigration', () => {
    it('should migrate IndexedDB data and clear IndexedDB when conditions are met', async () => {
      Object.defineProperty(storage, 'driver', { get: () => 'not indexeddb' });
      spyOn(window.indexedDB, 'databases').and.returnValue(Promise.resolve([{}]));
      spyOn(Capacitor, 'getPlatform').and.returnValue('ios');
      spyOn(provider, 'migrateIndexedDBData').and.returnValue(Promise.resolve());
      spyOn(provider, 'getIndexDBData').and.returnValue(Promise.resolve({}));
      spyOn(provider, 'clearIndexedDB').and.returnValue(Promise.resolve());

      await provider.attemptDataStoreMigration();

      expect(provider.migrateIndexedDBData).toHaveBeenCalled();
      expect(provider.getIndexDBData).toHaveBeenCalled();
      expect(provider.clearIndexedDB).toHaveBeenCalled();
    });

    it('should not migrate if storage driver is IndexedDB', async () => {
      Object.defineProperty(storage, 'driver', { get: () => Drivers.IndexedDB });
      spyOn(window.indexedDB, 'databases').and.returnValue(Promise.resolve([{}]));
      spyOn(Capacitor, 'getPlatform').and.returnValue('ios');
      spyOn(provider, 'migrateIndexedDBData');
      spyOn(provider, 'clearIndexedDB');

      await provider.attemptDataStoreMigration();

      expect(provider.migrateIndexedDBData).not.toHaveBeenCalled();
      expect(provider.clearIndexedDB).not.toHaveBeenCalled();
    });

    it('should not migrate if there are no IndexedDB databases', async () => {
      Object.defineProperty(storage, 'driver', { get: () => 'not indexeddb' });
      spyOn(window.indexedDB, 'databases').and.returnValue(Promise.resolve([]));
      spyOn(Capacitor, 'getPlatform').and.returnValue('ios');
      spyOn(provider, 'migrateIndexedDBData');
      spyOn(provider, 'clearIndexedDB');

      await provider.attemptDataStoreMigration();

      expect(provider.migrateIndexedDBData).not.toHaveBeenCalled();
      expect(provider.clearIndexedDB).not.toHaveBeenCalled();
    });

    it('should not migrate if platform is web', async () => {
      Object.defineProperty(storage, 'driver', { get: () => 'not indexeddb' });
      spyOn(window.indexedDB, 'databases').and.returnValue(Promise.resolve([{}]));
      spyOn(Capacitor, 'getPlatform').and.returnValue('web');
      spyOn(provider, 'migrateIndexedDBData');
      spyOn(provider, 'clearIndexedDB');

      await provider.attemptDataStoreMigration();

      expect(provider.migrateIndexedDBData).not.toHaveBeenCalled();
      expect(provider.clearIndexedDB).not.toHaveBeenCalled();
    });

    it('should call reportLog if an error is thrown during migration', async () => {
      Object.defineProperty(storage, 'driver', { get: () => 'not indexeddb' });
      spyOn(window.indexedDB, 'databases').and.returnValue(Promise.reject('error'));
      const reportLogSpy = spyOn<any>(provider, 'reportLog');

      await provider.attemptDataStoreMigration();

      expect(reportLogSpy).toHaveBeenCalledWith('attemptDataStoreMigration', '', 'error');
    });
  });

  describe('initDataStore', () => {
    it('should define the CordovaSQLiteDriver and create storage successfully', async () => {
      console.log(storage.defineDriver);
      spyOn(storage, 'defineDriver').and.returnValue(Promise.resolve());
      const createSpy = spyOn(storage, 'create').and.returnValue(Promise.resolve({} as Storage));
      await provider.initDataStore();
      expect(storage.defineDriver).toHaveBeenCalledWith(CordovaSQLiteDriver);
      expect(createSpy).toHaveBeenCalled();
    });

    it('should call attemptDataStoreMigration after storage is created', async () => {
      spyOn(storage, 'defineDriver').and.returnValue(Promise.resolve());
      spyOn(storage, 'create').and.returnValue(Promise.resolve({} as Storage));
      spyOn(provider, 'attemptDataStoreMigration');
      await provider.initDataStore();
      expect(storage.create).toHaveBeenCalled();
      expect(provider.attemptDataStoreMigration).toHaveBeenCalled();
    });

    it('should call reportLog and throw if defineDriver throws an error', async () => {
      const error = new Error('defineDriver failed');
      spyOn(storage, 'defineDriver').and.returnValue(Promise.reject(error));
      const reportLogSpy = spyOn<any>(provider, 'reportLog');
      await expectAsync(provider.initDataStore()).toBeRejectedWith(error);
      expect(reportLogSpy).toHaveBeenCalledWith('initDataStore', '', error);
    });

    it('should call reportLog and throw if storage.create throws an error', async () => {
      spyOn(storage, 'defineDriver').and.returnValue(Promise.resolve());
      const error = new Error('create failed');
      spyOn(storage, 'create').and.returnValue(Promise.reject(error));
      const reportLogSpy = spyOn<any>(provider, 'reportLog');
      await expectAsync(provider.initDataStore()).toBeRejectedWith(error);
      expect(reportLogSpy).toHaveBeenCalledWith('initDataStore', '', error);
    });
  });

  describe('clearIndexedDB', () => {
    it('should delete all IndexedDB databases when clearIndexedDB is called', async () => {
      const mockDatabases = [{ name: 'db1' }, { name: 'db2' }];
      spyOn(window.indexedDB, 'databases').and.returnValue(Promise.resolve(mockDatabases));
      spyOn(window.indexedDB, 'deleteDatabase');

      await provider.clearIndexedDB();

      expect(window.indexedDB.databases).toHaveBeenCalled();
      expect(window.indexedDB.deleteDatabase).toHaveBeenCalledWith('db1');
      expect(window.indexedDB.deleteDatabase).toHaveBeenCalledWith('db2');
      expect(window.indexedDB.deleteDatabase).toHaveBeenCalledTimes(2);
    });

    it('should call reportLog and throw if an error occurs during clearIndexedDB', async () => {
      const error = new Error('databases failed');
      spyOn(window.indexedDB, 'databases').and.returnValue(Promise.reject(error));
      const reportLogSpy = spyOn<any>(provider, 'reportLog');

      await expectAsync(provider.clearIndexedDB()).toBeRejectedWith(error);
      expect(reportLogSpy).toHaveBeenCalledWith('clearIndexedDB', '', error, LogType.ERROR);
    });
  });

  describe('migrateIndexedDBData', () => {
    it('should set each key in indexdbData to storage as a stringified value', async () => {
      const indexdbData = { key1: { a: 1 }, key2: [1, 2, 3] };

      spyOn(storage, 'set').and.callThrough();

      await provider.migrateIndexedDBData(indexdbData);

      expect(storage.set).toHaveBeenCalledWith('key1', JSON.stringify({ a: 1 }));
      expect(storage.set).toHaveBeenCalledWith('key2', JSON.stringify([1, 2, 3]));
      expect((storage.set as jasmine.Spy).calls.count()).toBe(2);
    });

    it('should not call storage.set if indexdbData is null', async () => {
      spyOn(storage, 'set').and.callThrough();

      await provider.migrateIndexedDBData(null);

      expect(storage.set).not.toHaveBeenCalled();
    });

    it('should not call storage.set if indexdbData is undefined', async () => {
      spyOn(storage, 'set').and.callThrough();

      await provider.migrateIndexedDBData(undefined);

      expect(storage.set).not.toHaveBeenCalled();
    });

    it('should handle empty object without calling storage.set', async () => {
      spyOn(storage, 'set').and.callThrough();

      await provider.migrateIndexedDBData({});

      expect(storage.set).not.toHaveBeenCalled();
    });
  });

  describe('getIndexDBDataByKey', () => {
    it('resolves with parsed JSON when value exists in object store', async () => {
      const mockValue = '{"property":"value"}';
      const mockEvent = { target: { result: mockValue } };
      const objectStore = {
        get: jasmine.createSpy().and.callFake(() => {
          return {
            set onsuccess(fn) {
              setTimeout(() => fn(mockEvent));
            },
            set onerror(_) {},
          };
        }),
      } as unknown as IDBObjectStore;

      const result = await provider.getIndexDBDataByKey('key', objectStore);

      expect(result).toEqual(JSON.parse(mockValue));
    });

    it('resolves with null when value is null or undefined in object store', async () => {
      const mockEvent = { target: { result: null } };
      const objectStore = {
        get: jasmine.createSpy().and.callFake(() => {
          return {
            set onsuccess(fn) {
              setTimeout(() => fn(mockEvent));
            },
            set onerror(_) {},
          };
        }),
      } as unknown as IDBObjectStore;

      const result = await provider.getIndexDBDataByKey('key', objectStore);

      expect(result).toBeNull();
    });

    it('rejects and logs when JSON.parse throws', async () => {
      const invalidJSON = '{property:value}';
      const mockEvent = { target: { result: invalidJSON } };
      const objectStore = {
        get: jasmine.createSpy().and.callFake(() => {
          return {
            set onsuccess(fn) {
              setTimeout(() => fn(mockEvent));
            },
            set onerror(_) {},
          };
        }),
      } as unknown as IDBObjectStore;
      const reportLogSpy = spyOn<any>(provider, 'reportLog');

      await expectAsync(provider.getIndexDBDataByKey('key', objectStore)).toBeRejected();
      expect(reportLogSpy).toHaveBeenCalledWith('getIndexDBDataByKey', '', jasmine.any(SyntaxError));
    });

    it('rejects and logs when request.onerror is triggered', async () => {
      const mockError = new Error('IndexedDB error');
      const mockEvent = { target: { error: mockError } };
      const objectStore = {
        get: jasmine.createSpy().and.callFake(() => {
          return {
            set onsuccess(_) {},
            set onerror(fn) {
              setTimeout(() => fn(mockEvent));
            },
          };
        }),
      } as unknown as IDBObjectStore;
      const reportLogSpy = spyOn<any>(provider, 'reportLog');

      await expectAsync(provider.getIndexDBDataByKey('key', objectStore)).toBeRejectedWith(mockError);
      expect(reportLogSpy).toHaveBeenCalledWith('getIndexDBDataByKey', '', mockError);
    });
  });

  describe('getIndexDBData', () => {
    it('returns null if database is not found', async () => {
      spyOn(window.indexedDB, 'open').and.callFake(() => {
        return {
          set onsuccess(fn) {
            setTimeout(() => fn({ target: { result: null } }));
          },
          set onerror(_) {},
        } as any;
      });

      const result = await provider.getIndexDBData();
      expect(result).toBeNull();
    });

    it('returns null if there are no object stores', async () => {
      spyOn(window.indexedDB, 'open').and.callFake(() => {
        return {
          set onsuccess(fn) {
            setTimeout(() => fn({ target: { result: { objectStoreNames: [] } } }));
          },
          set onerror(_) {},
        } as any;
      });

      const result = await provider.getIndexDBData();
      expect(result).toBeNull();
    });

    it('returns null if object store is not found', async () => {
      spyOn(window.indexedDB, 'open').and.callFake(() => {
        return {
          set onsuccess(fn) {
            setTimeout(() =>
              fn({
                target: {
                  result: {
                    objectStoreNames: ['_ionickv'],
                    transaction: () => ({
                      objectStore: () => null,
                      oncomplete: null,
                    }),
                  },
                },
              })
            );
          },
          set onerror(_) {},
        } as any;
      });

      const result = await provider.getIndexDBData();
      expect(result).toBeNull();
    });

    it('returns holdingJSON with migrated keys when data exists', async () => {
      const mockData = {
        JOURNAL: { test: 'value' },
        EXAMINER_STAT_PREFERENCES: { stat: 1 },
      };
      spyOn(window.indexedDB, 'open').and.callFake(() => {
        return {
          set onsuccess(fn) {
            setTimeout(() =>
              fn({
                target: {
                  result: {
                    objectStoreNames: ['_ionickv'],
                    transaction: () => ({
                      objectStore: () => ({
                        get: (key: string) => ({
                          set onsuccess(cb) {
                            setTimeout(() => cb({ target: { result: JSON.stringify(mockData[key] || null) } }));
                          },
                          set onerror(_) {},
                        }),
                      }),
                      oncomplete: null,
                    }),
                  },
                },
              })
            );
          },
          set onerror(_) {},
        } as any;
      });

      const result = await provider.getIndexDBData();
      expect(result).toEqual({
        JOURNAL: mockData.JOURNAL,
        EXAMINER_STAT_PREFERENCES: mockData.EXAMINER_STAT_PREFERENCES,
      });
    });

    it('resolves with empty object if no keys are found in object store', async () => {
      spyOn(window.indexedDB, 'open').and.callFake(() => {
        return {
          set onsuccess(fn) {
            setTimeout(() =>
              fn({
                target: {
                  result: {
                    objectStoreNames: ['_ionickv'],
                    transaction: () => ({
                      objectStore: () => ({
                        get: () => ({
                          set onsuccess(cb) {
                            setTimeout(() => cb({ target: { result: null } }));
                          },
                          set onerror(_) {},
                        }),
                      }),
                      oncomplete: null,
                    }),
                  },
                },
              })
            );
          },
          set onerror(_) {},
        } as any;
      });

      const result = await provider.getIndexDBData();
      expect(result).toEqual({});
    });

    it('rejects if opening IndexedDB fails', async () => {
      spyOn(window.indexedDB, 'open').and.callFake(() => {
        return {
          set onsuccess(_) {},
          set onerror(fn) {
            setTimeout(() => fn({ target: { error: 'open error' } }));
          },
        } as any;
      });

      await expectAsync(provider.getIndexDBData()).toBeRejectedWith('open error');
    });
  });

  describe('createContainer', () => {
    it('should create container named DES', async () => {
      spyOn(provider, 'setSecureContainer');
      await provider.createContainer();
      expect(provider.setSecureContainer).toHaveBeenCalledWith({} as SecureStorageObject);
      expect(secureStorage.create).toHaveBeenCalledWith('DES');
    });
    it('should not call set container on thrown error', async () => {
      secureStorage.create = jasmine.createSpy().and.returnValue(Promise.reject('Failed to create container'));
      spyOn(provider, 'setSecureContainer');

      try {
        await provider.createContainer();
      } catch (err) {
        expect(provider.setSecureContainer).not.toHaveBeenCalled();
      }
    });
  });

  describe('setSecureContainer', () => {
    it('should set secureContainer', () => {
      provider.secureContainer = {} as SecureStorageObject;
      provider.setSecureContainer(null);
      expect(provider.secureContainer).toEqual(null);
    });
  });

  describe('getSecureContainer', () => {
    it('should return secureContainer', () => {
      provider.secureContainer = {} as SecureStorageObject;
      expect(provider.getSecureContainer()).toEqual({} as SecureStorageObject);
    });
  });

  describe('getKeys', () => {
    it('should return default when not iOS', async () => {
      spyOn(provider, 'isIos').and.returnValue(false);

      expect(await provider.getKeys()).toEqual(['']);
    });
    it('should get `keys` from storage', async () => {
      spyOn(provider, 'isIos').and.returnValue(true);
      storage.keys = jasmine.createSpy().and.returnValue(['testData']);
      expect(await provider.getKeys()).toEqual(['testData']);
    });
  });

  describe('getItem', () => {
    it('should return default when not iOS', async () => {
      spyOn(provider, 'isIos').and.returnValue(false);

      expect(await provider.getItem(null)).toEqual('');
    });
    it('should `get` data from storage', async () => {
      spyOn(provider, 'isIos').and.returnValue(true);
      storage.get = jasmine.createSpy().and.returnValue('testData');

      await provider.getItem(LocalStorageKey.LOGS);

      expect(storage.get).toHaveBeenCalledWith(LocalStorageKey.LOGS);
    });
  });

  describe('setItem', () => {
    it('should return default when not iOS', async () => {
      spyOn(provider, 'isIos').and.returnValue(false);
      expect(await provider.setItem(null, null)).toEqual('');
    });
    it('should call `set` with a key and a value', async () => {
      spyOn(provider, 'isIos').and.returnValue(true);

      storage.set = jasmine.createSpy().and.returnValue(Promise.resolve());

      await provider.setItem(LocalStorageKey.LOGS, 'val1');

      expect(storage.set).toHaveBeenCalledWith(LocalStorageKey.LOGS, 'val1');
    });
    it('should return an error string if the function throws an error', async () => {
      storage.set = jasmine.createSpy().and.returnValue(Promise.reject('error'));

      try {
        await provider.setItem(LocalStorageKey.LOGS, 'val1');
      } catch (err) {
        expect(err).toEqual('error');
      }
    });
  });
  describe('removeItem', () => {
    it('should return default when not iOS', async () => {
      spyOn(provider, 'isIos').and.returnValue(false);

      expect(await provider.removeItem(null)).toEqual('');
    });
    it('should return an empty string if secureContainer is null', async () => {
      spyOn(provider, 'isIos').and.returnValue(true);

      storage.remove = jasmine.createSpy().and.returnValue(Promise.resolve());

      await provider.removeItem(LocalStorageKey.LOGS);

      expect(storage.remove).toHaveBeenCalledWith(LocalStorageKey.LOGS);
    });
    it('should return an error string if the function throws an error', async () => {
      storage.remove = jasmine.createSpy().and.returnValue(Promise.reject('error'));

      await provider.removeItem(LocalStorageKey.LOGS);

      expect(store$.dispatch).toHaveBeenCalledWith(
        SaveLog({
          payload: {
            message: 'error',
            type: LogType.ERROR,
            timestamp: 123,
            description: 'Description',
            appVersion: '1.1.0',
            iosVersion: '1.0.0',
            deviceId: 'fb455c20-c025-4d6b-bbf2-aab80af6efb8',
            drivingExaminerId: 'testData',
          } as unknown as Log,
        })
      );
    });
  });

  describe('migrateKey', () => {
    beforeEach(() => {
      storage.set = jasmine.createSpy().and.returnValue(Promise.resolve());

      provider.secureContainer = {
        get(key: string): Promise<string> {
          return mockStorage[key];
        },
        remove(key: string): Promise<string> {
          return;
        },
      } as SecureStorageObject;
    });

    it('should call through to storage.set when they key is found', async () => {
      await provider.migrateKey(LocalStorageKey.CONFIG);
      expect(storage.set).toHaveBeenCalledWith(LocalStorageKey.CONFIG, 'this is the data we want');
    });

    it('should not call set when no key exists in secure container', async () => {
      await provider.migrateKey(LocalStorageKey.LOGS);
      expect(storage.set).not.toHaveBeenCalled();
    });
  });
  describe('migrateAllKeys', () => {
    beforeEach(() => {
      spyOn(provider, 'migrateKey').and.returnValue(Promise.resolve());
    });

    it('should not call migrate when no secureContainer exists', async () => {
      provider.secureContainer = null;

      await provider.migrateAllKeys();

      expect(provider.migrateKey).not.toHaveBeenCalled();
    });

    it('should call migrate for each key found', async () => {
      provider.secureContainer = {
        keys(): Promise<string[]> {
          return Promise.resolve(['key1', 'key2']);
        },
      } as SecureStorageObject;

      await provider.migrateAllKeys();

      expect(provider.migrateKey).toHaveBeenCalledTimes(2);
    });
  });
});
