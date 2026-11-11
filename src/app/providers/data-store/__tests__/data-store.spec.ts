import { signal } from '@angular/core';
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
import { StoreModel } from '@shared/models/store.model';
import { selectAppConfig } from '@store/app-config/app-config.selectors';
import { selectAuthResult } from '@store/app-info/app-info.selectors';
import { selectExaminerRecords } from '@store/examiner-records/examiner-records.selectors';
import { getJournalState } from '@store/journal/journal.reducer';
import { getRecallAutoPopupLastDisplayedTime } from '@store/journal/journal.selector';
import { getLogsState } from '@store/logs/logs.reducer';
import { getTests } from '@store/tests/tests.reducer';
import CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';
import { type Mock, type MockedObject, beforeEach, describe, expect, it, vi } from 'vitest';
import { WindowWithSQLitePlugin } from '../data-store';

describe('DataStoreProvider', () => {
  let provider: DataStoreProvider;
  let store$: Store<StoreModel>;
  let platform: Platform;
  let secureStorage: SecureStorage;
  let storage: Storage;
  const secureStorageMock: MockedObject<SecureStorage> = {
    create: vi
      .fn()
      .mockName('SecureStorage.create')
      .mockReturnValue(Promise.resolve({} as SecureStorageObject)),
  };
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
    vi.spyOn(store$, 'dispatch').mockReturnValue(undefined);
    vi.spyOn(platform, 'is').mockReturnValue(true);
    secureStorage.create = vi.fn().mockReturnValue(Promise.resolve({} as SecureStorageObject));
  });

  describe('tryToResetStorage', () => {
    it('calls resetStorage when error message equals storage timeout text', async () => {
      const timeoutMsg = 'DataStoreProvider Storage Call Timeout';
      const err = new Error(timeoutMsg);
      const resetSpy = vi.spyOn(provider, 'resetStorage').mockReturnValue(Promise.resolve());
      await provider.tryToResetStorage(err);
      expect(resetSpy).toHaveBeenCalled();
    });
    it('calls resetStorage when error message contains "malformed"', async () => {
      const err = new Error('response malformed payload');
      const resetSpy = vi.spyOn(provider, 'resetStorage').mockReturnValue(Promise.resolve());
      await provider.tryToResetStorage(err);
      expect(resetSpy).toHaveBeenCalled();
    });
    it('calls resetStorage when error message contains both "no such table" and "_ionicstorage"', async () => {
      const err = new Error('no such table some_table _ionicstorage');
      const resetSpy = vi.spyOn(provider, 'resetStorage').mockReturnValue(Promise.resolve());
      await provider.tryToResetStorage(err);
      expect(resetSpy).toHaveBeenCalled();
    });
    it('does not call resetStorage for unrelated error messages', async () => {
      const err = new Error('unrelated error occurred');
      const resetSpy = vi.spyOn(provider, 'resetStorage').mockReturnValue(Promise.resolve());
      await provider.tryToResetStorage(err);
      expect(resetSpy).not.toHaveBeenCalled();
    });
    it('reports and rethrows when resetStorage throws an error', async () => {
      const timeoutMsg = 'DataStoreProvider Storage Call Timeout';
      const resetError = new Error('reset failed');
      vi.spyOn(provider, 'resetStorage').mockReturnValue(Promise.reject(resetError));
      const reportSpy = vi.spyOn(provider, 'reportLog').mockReturnValue(undefined);

      await expect(provider.tryToResetStorage(new Error(timeoutMsg))).rejects.toThrowError('reset failed');
      expect(reportSpy).toHaveBeenCalledWith('Resetting storage error', '', resetError, false);
    });
  });

  describe('resetStorage', () => {
    it('throws Missing SQL Lite plugin error when sqlitePlugin is not present', async () => {
      (window as WindowWithSQLitePlugin).sqlitePlugin = null;
      await expect(provider.resetStorage()).rejects.toThrowError('Missing SQL Lite plugin');
    });
    it('calls initDataStore and repopulateStorage when deleteDatabase success callback is invoked', async () => {
      (window as WindowWithSQLitePlugin).sqlitePlugin = {
        deleteDatabase: vi.fn().mockImplementation(
          (
            options: {
              name: string;
              location: string;
            },
            success?: () => void,
            error?: (err: unknown) => void
          ): Promise<void> => {
            if (success) {
              success();
            }
            return Promise.resolve();
          }
        ),
      };

      vi.spyOn(provider, 'initDataStore').mockReturnValue(Promise.resolve());
      vi.spyOn(provider, 'repopulateStorage').mockReturnValue(Promise.resolve());

      await provider.resetStorage();

      expect((window as any).sqlitePlugin.deleteDatabase).toHaveBeenCalledWith(
        { name: '_ionicstorage', location: 'default' },
        expect.any(Function),
        expect.any(Function)
      );
      expect(provider.initDataStore).toHaveBeenCalled();
      expect(provider.repopulateStorage).toHaveBeenCalled();
    });
    it('rejects when deleteDatabase promise rejects with an error', async () => {
      (window as WindowWithSQLitePlugin).sqlitePlugin = {
        deleteDatabase: vi.fn().mockReturnValue(Promise.reject(new Error('delete failed'))),
      };

      await expect(provider.resetStorage()).rejects.toThrowError('delete failed');
    });
  });

  describe('attemptDataStoreMigration', () => {
    it('should migrate IndexedDB data and clear IndexedDB when conditions are met', async () => {
      Object.defineProperty(storage, 'driver', { get: () => 'not indexeddb' });
      vi.spyOn(window.indexedDB, 'databases').mockReturnValue(Promise.resolve([{}]));
      vi.spyOn(Capacitor, 'getPlatform').mockReturnValue('ios');
      vi.spyOn(provider, 'migrateIndexedDBData').mockReturnValue(Promise.resolve());
      vi.spyOn(provider, 'getIndexDBData').mockReturnValue(Promise.resolve({}));
      vi.spyOn(provider, 'clearIndexedDB').mockReturnValue(Promise.resolve());

      await provider.attemptDataStoreMigration();

      expect(provider.migrateIndexedDBData).toHaveBeenCalled();
      expect(provider.getIndexDBData).toHaveBeenCalled();
      expect(provider.clearIndexedDB).toHaveBeenCalled();
    });

    it('should not migrate if storage driver is IndexedDB', async () => {
      Object.defineProperty(storage, 'driver', { get: () => Drivers.IndexedDB });
      vi.spyOn(window.indexedDB, 'databases').mockReturnValue(Promise.resolve([{}]));
      vi.spyOn(Capacitor, 'getPlatform').mockReturnValue('ios');
      vi.spyOn(provider, 'migrateIndexedDBData').mockReturnValue(undefined);
      vi.spyOn(provider, 'clearIndexedDB').mockReturnValue(undefined);

      await provider.attemptDataStoreMigration();

      expect(provider.migrateIndexedDBData).not.toHaveBeenCalled();
      expect(provider.clearIndexedDB).not.toHaveBeenCalled();
    });

    it('should not migrate if there are no IndexedDB databases', async () => {
      Object.defineProperty(storage, 'driver', { get: () => 'not indexeddb' });
      vi.spyOn(window.indexedDB, 'databases').mockReturnValue(Promise.resolve([]));
      vi.spyOn(Capacitor, 'getPlatform').mockReturnValue('ios');
      vi.spyOn(provider, 'migrateIndexedDBData').mockReturnValue(undefined);
      vi.spyOn(provider, 'clearIndexedDB').mockReturnValue(undefined);

      await provider.attemptDataStoreMigration();

      expect(provider.migrateIndexedDBData).not.toHaveBeenCalled();
      expect(provider.clearIndexedDB).not.toHaveBeenCalled();
    });

    it('should not migrate if platform is web', async () => {
      Object.defineProperty(storage, 'driver', { get: () => 'not indexeddb' });
      vi.spyOn(window.indexedDB, 'databases').mockReturnValue(Promise.resolve([{}]));
      vi.spyOn(Capacitor, 'getPlatform').mockReturnValue('web');
      vi.spyOn(provider, 'migrateIndexedDBData').mockReturnValue(undefined);
      vi.spyOn(provider, 'clearIndexedDB').mockReturnValue(undefined);

      await provider.attemptDataStoreMigration();

      expect(provider.migrateIndexedDBData).not.toHaveBeenCalled();
      expect(provider.clearIndexedDB).not.toHaveBeenCalled();
    });

    it('should call reportLog if an error is thrown during migration', async () => {
      Object.defineProperty(storage, 'driver', { get: () => 'not indexeddb' });
      vi.spyOn(window.indexedDB, 'databases').mockReturnValue(Promise.reject('error'));
      const reportLogSpy = vi.spyOn(provider, 'reportLog').mockReturnValue(undefined);

      await provider.attemptDataStoreMigration();

      expect(reportLogSpy).toHaveBeenCalledWith('attemptDataStoreMigration error', '', 'error');
    });
  });

  describe('initDataStore', () => {
    it('should define the CordovaSQLiteDriver and create storage successfully', async () => {
      vi.spyOn(storage, 'defineDriver').mockReturnValue(Promise.resolve());
      const createSpy = vi.spyOn(storage, 'create').mockReturnValue(Promise.resolve({} as Storage));
      await provider.initDataStore();
      expect(storage.defineDriver).toHaveBeenCalledWith(CordovaSQLiteDriver);
      expect(createSpy).toHaveBeenCalled();
    });

    it('should call attemptDataStoreMigration after storage is created', async () => {
      vi.spyOn(storage, 'defineDriver').mockReturnValue(Promise.resolve());
      vi.spyOn(storage, 'create').mockReturnValue(Promise.resolve({} as Storage));
      vi.spyOn(provider, 'attemptDataStoreMigration').mockReturnValue(undefined);
      await provider.initDataStore();
      expect(storage.create).toHaveBeenCalled();
      expect(provider.attemptDataStoreMigration).toHaveBeenCalled();
    });

    it('should call reportLog and throw if defineDriver throws an error', async () => {
      const error = new Error('defineDriver failed');
      vi.spyOn(storage, 'defineDriver').mockReturnValue(Promise.reject(error));
      const reportLogSpy = vi.spyOn(provider, 'reportLog').mockReturnValue(undefined);
      await expect(provider.initDataStore()).rejects.toEqual(error);
      expect(reportLogSpy).toHaveBeenCalledWith('initDataStore error', '', error);
    });

    it('should call reportLog and throw if storage.create throws an error', async () => {
      vi.spyOn(storage, 'defineDriver').mockReturnValue(Promise.resolve());
      const error = new Error('create failed');
      vi.spyOn(storage, 'create').mockReturnValue(Promise.reject(error));
      const reportLogSpy = vi.spyOn(provider, 'reportLog').mockReturnValue(undefined);
      await expect(provider.initDataStore()).rejects.toEqual(error);
      expect(reportLogSpy).toHaveBeenCalledWith('initDataStore error', '', error);
    });
  });

  describe('clearIndexedDB', () => {
    it('should delete all IndexedDB databases when clearIndexedDB is called', async () => {
      const mockDatabases = [{ name: 'db1' }, { name: 'db2' }];
      vi.spyOn(window.indexedDB, 'databases').mockReturnValue(Promise.resolve(mockDatabases));
      vi.spyOn(window.indexedDB, 'deleteDatabase').mockReturnValue(undefined);

      await provider.clearIndexedDB();

      expect(window.indexedDB.databases).toHaveBeenCalled();
      expect(window.indexedDB.deleteDatabase).toHaveBeenCalledWith('db1');
      expect(window.indexedDB.deleteDatabase).toHaveBeenCalledWith('db2');
      expect(window.indexedDB.deleteDatabase).toHaveBeenCalledTimes(2);
    });

    it('should call reportLog and throw if an error occurs during clearIndexedDB', async () => {
      const error = new Error('databases failed');
      vi.spyOn(window.indexedDB, 'databases').mockReturnValue(Promise.reject(error));
      const reportLogSpy = vi.spyOn(provider, 'reportLog').mockReturnValue(undefined);

      await expect(provider.clearIndexedDB()).rejects.toEqual(error);
      expect(reportLogSpy).toHaveBeenCalledWith('clearIndexedDB error', '', error);
    });
  });

  describe('migrateIndexedDBData', () => {
    it('should set each key in indexdbData to storage as a stringified value', async () => {
      const indexdbData = { key1: { a: 1 }, key2: [1, 2, 3] };

      vi.spyOn(storage, 'set');

      await provider.migrateIndexedDBData(indexdbData);

      expect(storage.set).toHaveBeenCalledWith('key1', JSON.stringify({ a: 1 }));
      expect(storage.set).toHaveBeenCalledWith('key2', JSON.stringify([1, 2, 3]));
      expect(vi.mocked(storage.set as Mock).mock.calls.length).toBe(2);
    });

    it('should not call storage.set if indexdbData is null', async () => {
      vi.spyOn(storage, 'set');

      await provider.migrateIndexedDBData(null);

      expect(storage.set).not.toHaveBeenCalled();
    });

    it('should not call storage.set if indexdbData is undefined', async () => {
      vi.spyOn(storage, 'set');

      await provider.migrateIndexedDBData(undefined);

      expect(storage.set).not.toHaveBeenCalled();
    });

    it('should handle empty object without calling storage.set', async () => {
      vi.spyOn(storage, 'set');

      await provider.migrateIndexedDBData({});

      expect(storage.set).not.toHaveBeenCalled();
    });
  });

  describe('getIndexDBDataByKey', () => {
    it('resolves with parsed JSON when value exists in object store', async () => {
      const mockValue = '{"property":"value"}';
      const mockEvent = { target: { result: mockValue } };
      const objectStore = {
        get: vi.fn().mockImplementation(() => {
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
        get: vi.fn().mockImplementation(() => {
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
        get: vi.fn().mockImplementation(() => {
          return {
            set onsuccess(fn) {
              setTimeout(() => fn(mockEvent));
            },
            set onerror(_) {},
          };
        }),
      } as unknown as IDBObjectStore;
      vi.spyOn(provider, 'reportLog').mockReturnValue(undefined);

      await expect(provider.getIndexDBDataByKey('key', objectStore)).rejects.toThrow();
      expect(provider.reportLog).toHaveBeenCalledWith('getIndexDBDataByKey error', '', expect.any(SyntaxError));
    });

    it('rejects and logs when request.onerror is triggered', async () => {
      const mockError = new Error('IndexedDB error');
      const mockEvent = { target: { error: mockError } };
      const objectStore = {
        get: vi.fn().mockImplementation(() => {
          return {
            set onsuccess(_) {},
            set onerror(fn) {
              setTimeout(() => fn(mockEvent));
            },
          };
        }),
      } as unknown as IDBObjectStore;
      vi.spyOn(provider, 'reportLog').mockReturnValue(undefined);

      await expect(provider.getIndexDBDataByKey('key', objectStore)).rejects.toEqual(mockError);
      expect(provider.reportLog).toHaveBeenCalledWith('getIndexDBDataByKey error', '', mockError);
    });
  });

  describe('getIndexDBData', () => {
    it('returns null if database is not found', async () => {
      vi.spyOn(window.indexedDB, 'open').mockImplementation(() => {
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
      vi.spyOn(window.indexedDB, 'open').mockImplementation(() => {
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
      vi.spyOn(window.indexedDB, 'open').mockImplementation(() => {
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
      vi.spyOn(window.indexedDB, 'open').mockImplementation(() => {
        return {
          set onsuccess(fn: (arg0: {
            target: {
              result: {
                objectStoreNames: string[];
                transaction: () => {
                  objectStore: () => {
                    get: (key: string) => {
                      onsuccess: any;
                      onerror: any;
                    };
                  };
                  oncomplete: any;
                };
              };
            };
          }) => void) {
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
      vi.spyOn(window.indexedDB, 'open').mockImplementation(() => {
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
      vi.spyOn(window.indexedDB, 'open').mockImplementation(() => {
        return {
          set onsuccess(_) {},
          set onerror(fn) {
            setTimeout(() => fn({ target: { error: 'open error' } }));
          },
        } as any;
      });

      await expect(provider.getIndexDBData()).rejects.toEqual('open error');
    });
  });

  describe('getKeys', () => {
    it('should return default when not iOS', async () => {
      vi.spyOn(provider, 'isIos').mockReturnValue(false);

      expect(await provider.getKeys()).toEqual(['']);
    });
    it('should get `keys` from storage', async () => {
      vi.spyOn(provider, 'isIos').mockReturnValue(true);
      storage.keys = vi.fn().mockReturnValue(['testData']);
      expect(await provider.getKeys()).toEqual(['testData']);
    });
    it('retries keys after reset and returns keys when retry succeeds', async () => {
      vi.spyOn(provider, 'isIos').mockReturnValue(true);
      const initialError = new Error('initial failure');
      vi.spyOn(storage, 'keys')
        .mockReturnValueOnce(Promise.reject(initialError))
        .mockReturnValueOnce(Promise.resolve(['recoveredKey']));
      vi.spyOn(provider, 'reportLog').mockReturnValue(undefined);
      vi.spyOn(provider, 'tryToResetStorage').mockReturnValue(Promise.resolve());

      const result = await provider.getKeys();

      expect(provider.reportLog).toHaveBeenCalledWith('Getting keys error', '', initialError, false);
      expect(provider.tryToResetStorage).toHaveBeenCalledWith(initialError);
      expect(vi.mocked(storage.keys as Mock).mock.calls.length).toBe(2);
      expect(result).toEqual(['recoveredKey']);
    });
    it('propagates original error when tryToResetStorage throws while handling keys error', async () => {
      vi.spyOn(provider, 'isIos').mockReturnValue(true);
      const initialError = new Error('initial failure');
      vi.spyOn(storage, 'keys').mockReturnValue(Promise.reject(initialError));
      vi.spyOn(provider, 'tryToResetStorage').mockReturnValue(Promise.reject(new Error('reset failed')));
      vi.spyOn(provider, 'reportLog').mockReturnValue(undefined);

      await expect(provider.getKeys()).rejects.toEqual(initialError);
      expect(provider.tryToResetStorage).toHaveBeenCalledWith(initialError);
    });
    it('throws post-retry error and logs when retrying keys after reset fails', async () => {
      vi.spyOn(provider, 'isIos').mockReturnValue(true);
      const initialError = new Error('initial failure');
      const postError = new Error('post retry failure');
      vi.spyOn(storage, 'keys')
        .mockReturnValueOnce(Promise.reject(initialError))
        .mockReturnValueOnce(Promise.reject(postError));
      vi.spyOn(provider, 'tryToResetStorage').mockReturnValue(Promise.resolve());
      vi.spyOn(provider, 'reportLog').mockReturnValue(undefined);

      await expect(provider.getKeys()).rejects.toEqual(postError);
      expect(provider.reportLog).toHaveBeenCalledWith('Getting keys error', '', initialError, false);
      expect(provider.reportLog).toHaveBeenCalledWith('Removing storage post error', '', initialError, false);
      expect(provider.tryToResetStorage).toHaveBeenCalledWith(initialError);
      expect(vi.mocked(storage.keys as Mock).mock.calls.length).toBe(2);
    });
  });

  describe('repopulateStorageSetter', () => {
    it('calls storage.set with the provided key and value when set succeeds', async () => {
      vi.spyOn(storage, 'set').mockReturnValue(Promise.resolve('ok'));
      vi.spyOn(provider, 'reportLog').mockReturnValue(undefined);

      await provider.repopulateStorageSetter(LocalStorageKey.CONFIG, 'config-value', 'config');

      expect(storage.set).toHaveBeenCalledWith(LocalStorageKey.CONFIG, 'config-value');
      expect(provider.reportLog).not.toHaveBeenCalled();
    });

    it('logs error and does not throw when storage.set rejects', async () => {
      vi.spyOn(storage, 'set').mockReturnValue(Promise.reject('set-failure'));
      vi.spyOn(provider, 'reportLog').mockReturnValue(undefined);

      await provider.repopulateStorageSetter(LocalStorageKey.JOURNAL, JSON.stringify({}), 'journal');

      expect(provider.reportLog).toHaveBeenCalledWith(
        'repopulating journal error',
        LocalStorageKey.JOURNAL,
        'set-failure'
      );
    });

    it('passes non-string values through to storage.set without modification', async () => {
      vi.spyOn(storage, 'set').mockReturnValue(Promise.resolve('ok'));
      const numericValue: unknown = 12345;

      await provider.repopulateStorageSetter(
        LocalStorageKey.JOURNAL_RECALL_AUTO_DISPLAY_TIME,
        numericValue as unknown as string,
        'journal recall auto display time'
      );

      expect(storage.set).toHaveBeenCalledWith(LocalStorageKey.JOURNAL_RECALL_AUTO_DISPLAY_TIME, numericValue);
    });
  });

  describe('repopulateStorage', () => {
    it('repopulates all storage keys with values from store and calls setItem for each key', async () => {
      vi.spyOn(store$, 'selectSignal').mockImplementation((selector) => {
        if (selector === selectAppConfig) return signal({ app: 'config' });
        if (selector === getJournalState) return signal({ journal: 'state' });
        if (selector === getRecallAutoPopupLastDisplayedTime) return signal(999);
        if (selector === getLogsState) return signal({ logs: [] });
        if (selector === getTests) return signal({ tests: [] });
        if (selector === selectExaminerRecords) return signal({ examiner: 1 });
        if (selector === selectAuthResult) return signal({ auth: true });
        return signal(null);
      });

      vi.spyOn(provider, 'repopulateStorageSetter').mockResolvedValue(undefined);

      await provider.repopulateStorage();

      expect(vi.mocked(provider.repopulateStorageSetter as Mock).mock.calls.length).toBe(7);
      expect(provider.repopulateStorageSetter).toHaveBeenCalledWith(
        LocalStorageKey.CONFIG,
        JSON.stringify({ app: 'config' }),
        'config'
      );
      expect(provider.repopulateStorageSetter).toHaveBeenCalledWith(
        LocalStorageKey.JOURNAL,
        JSON.stringify({ journal: 'state' }),
        'journal'
      );
      expect(provider.repopulateStorageSetter).toHaveBeenCalledWith(
        LocalStorageKey.JOURNAL_RECALL_AUTO_DISPLAY_TIME,
        '999',
        'journal recall auto display time'
      );
      expect(provider.repopulateStorageSetter).toHaveBeenCalledWith(
        LocalStorageKey.LOGS,
        JSON.stringify({ logs: [] }),
        'logs'
      );
      expect(provider.repopulateStorageSetter).toHaveBeenCalledWith(
        LocalStorageKey.TESTS,
        JSON.stringify({ tests: [] }),
        'tests'
      );
      expect(provider.repopulateStorageSetter).toHaveBeenCalledWith(
        LocalStorageKey.EXAMINER_STATS_KEY,
        JSON.stringify({ examiner: 1 }),
        'examiner records'
      );
      expect(provider.repopulateStorageSetter).toHaveBeenCalledWith(
        LocalStorageKey.AUTH_RESULT,
        JSON.stringify({ auth: true }),
        'auth result'
      );
    });
  });

  describe('getItem', () => {
    it('resolves with stored value when platform is iOS and storage.get succeeds', async () => {
      vi.spyOn(provider, 'isIos').mockReturnValue(true);
      vi.spyOn(storage, 'get').mockReturnValue(Promise.resolve('storedValue'));

      const result = await provider.getItem(LocalStorageKey.LOGS);

      expect(storage.get).toHaveBeenCalledWith(LocalStorageKey.LOGS);
      expect(result).toEqual('storedValue');
    });
    it('retries after reset and returns value when initial storage.get fails then reset succeeds and second get succeeds', async () => {
      vi.spyOn(provider, 'isIos').mockReturnValue(true);
      const initialError = new Error('initial failure');
      vi.spyOn(storage, 'get')
        .mockReturnValueOnce(Promise.reject(initialError))
        .mockReturnValueOnce(Promise.resolve('savedAfterRetry'));
      vi.spyOn(provider, 'tryToResetStorage').mockReturnValue(Promise.resolve());

      const result = await provider.getItem(LocalStorageKey.LOGS);

      expect(provider.tryToResetStorage).toHaveBeenCalledWith(initialError);
      expect(vi.mocked(storage.get as Mock).mock.calls.length).toBe(2);
      expect(result).toEqual('savedAfterRetry');
    });
    it('propagates the original error when tryToResetStorage throws while handling a storage.get error', async () => {
      vi.spyOn(provider, 'isIos').mockReturnValue(true);
      const initialError = new Error('initial failure');
      vi.spyOn(storage, 'get').mockReturnValue(Promise.reject(initialError));
      vi.spyOn(provider, 'tryToResetStorage').mockReturnValue(Promise.reject(new Error('reset failed')));

      await expect(provider.getItem(LocalStorageKey.LOGS)).rejects.toEqual(initialError);
      expect(provider.tryToResetStorage).toHaveBeenCalledWith(initialError);
    });
    it('throws the post-retry error when retrying storage.get after reset fails', async () => {
      vi.spyOn(provider, 'isIos').mockReturnValue(true);
      const initialError = new Error('initial failure');
      const postError = new Error('post retry failure');
      vi.spyOn(storage, 'get')
        .mockReturnValueOnce(Promise.reject(initialError))
        .mockReturnValueOnce(Promise.reject(postError));
      vi.spyOn(provider, 'tryToResetStorage').mockReturnValue(Promise.resolve());

      await expect(provider.getItem(LocalStorageKey.LOGS)).rejects.toEqual(postError);
      expect(provider.tryToResetStorage).toHaveBeenCalledWith(initialError);
      expect(vi.mocked(storage.get as Mock).mock.calls.length).toBe(2);
    });
  });

  describe('setItem', () => {
    it('should return default when not iOS', async () => {
      vi.spyOn(provider, 'isIos').mockReturnValue(false);
      expect(await provider.setItem(null, null)).toEqual('');
    });
    it('should call `set` with a key and a value', async () => {
      vi.spyOn(provider, 'isIos').mockReturnValue(true);
      vi.spyOn(storage, 'set');

      await provider.setItem(LocalStorageKey.LOGS, 'val1');

      expect(storage.set).toHaveBeenCalledWith(LocalStorageKey.LOGS, 'val1');
    });
    it('should return an error string if the function throws an error', async () => {
      vi.spyOn(storage, 'set').mockRejectedValue('error');

      try {
        await provider.setItem(LocalStorageKey.LOGS, 'val1');
      } catch (err) {
        expect(err).toEqual('error');
      }
    });
    it('returns the stored value when storage.set resolves successfully', async () => {
      vi.spyOn(provider, 'isIos').mockReturnValue(true);
      vi.spyOn(storage, 'set').mockReturnValue(Promise.resolve('savedValue'));

      const result = await provider.setItem(LocalStorageKey.LOGS, 'val1');

      expect(storage.set).toHaveBeenCalledWith(LocalStorageKey.LOGS, 'val1');
      expect(result).toEqual('savedValue');
    });
    it('retries setting storage after reset when initial set fails and retry succeeds', async () => {
      vi.spyOn(provider, 'isIos').mockReturnValue(true);
      const initialError = new Error('initial failure');
      vi.spyOn(storage, 'set')
        .mockReturnValueOnce(Promise.reject(initialError))
        .mockReturnValueOnce(Promise.resolve('savedAfterRetry'));
      vi.spyOn(provider, 'tryToResetStorage').mockReturnValue(Promise.resolve());

      const result = await provider.setItem(LocalStorageKey.LOGS, 'val1');

      expect(provider.tryToResetStorage).toHaveBeenCalledWith(initialError);
      expect(vi.mocked(storage.set as Mock).mock.calls.length).toBe(2);
      expect(result).toEqual('savedAfterRetry');
    });
    it('propagates the original error if tryToResetStorage throws while handling a set error', async () => {
      vi.spyOn(provider, 'isIos').mockReturnValue(true);
      const initialError = new Error('initial failure');
      vi.spyOn(storage, 'set').mockReturnValue(Promise.reject(initialError));
      vi.spyOn(provider, 'tryToResetStorage').mockReturnValue(Promise.reject(new Error('reset failed')));

      await expect(provider.setItem(LocalStorageKey.LOGS, 'val1')).rejects.toEqual(initialError);
      expect(provider.tryToResetStorage).toHaveBeenCalledWith(initialError);
    });
    it('throws the post-retry error if retrying storage.set after reset fails', async () => {
      vi.spyOn(provider, 'isIos').mockReturnValue(true);
      const initialError = new Error('initial failure');
      const postError = new Error('post retry failure');
      vi.spyOn(storage, 'set')
        .mockReturnValueOnce(Promise.reject(initialError))
        .mockReturnValueOnce(Promise.reject(postError));
      vi.spyOn(provider, 'tryToResetStorage').mockReturnValue(Promise.resolve());

      await expect(provider.setItem(LocalStorageKey.LOGS, 'val1')).rejects.toEqual(postError);
      expect(provider.tryToResetStorage).toHaveBeenCalledWith(initialError);
      expect(vi.mocked(storage.set as Mock).mock.calls.length).toBe(2);
    });
  });

  describe('removeItem', () => {
    it('should return default when not iOS', async () => {
      vi.spyOn(provider, 'isIos').mockReturnValue(false);

      expect(await provider.removeItem(null)).toEqual('');
    });
    it('should return an empty string if secureContainer is null', async () => {
      vi.spyOn(provider, 'isIos').mockReturnValue(true);

      storage.remove = vi.fn().mockReturnValue(Promise.resolve());

      await provider.removeItem(LocalStorageKey.LOGS);

      expect(storage.remove).toHaveBeenCalledWith(LocalStorageKey.LOGS);
    });
    it('should return an error string if the function throws an error', async () => {
      storage.remove = vi.fn().mockReturnValue(Promise.reject('error'));

      try {
        await provider.removeItem(LocalStorageKey.LOGS);
      } catch (err) {
        expect(err).toEqual('error');
      }
    });
    it('retries remove after reset and returns value when initial remove fails then retry succeeds', async () => {
      vi.spyOn(provider, 'isIos').mockReturnValue(true);
      const initialError = new Error('initial failure');
      vi.spyOn(storage, 'remove')
        .mockReturnValueOnce(Promise.reject(initialError))
        .mockReturnValueOnce(Promise.resolve('removedAfterRetry'));
      vi.spyOn(provider, 'tryToResetStorage').mockReturnValue(Promise.resolve());

      const result = await provider.removeItem(LocalStorageKey.LOGS);

      expect(provider.tryToResetStorage).toHaveBeenCalledWith(initialError);
      expect(vi.mocked(storage.remove as Mock).mock.calls.length).toBe(2);
      expect(result).toEqual('removedAfterRetry');
    });
    it('propagates the original error when tryToResetStorage throws while handling a remove error', async () => {
      vi.spyOn(provider, 'isIos').mockReturnValue(true);
      const initialError = new Error('initial failure');
      vi.spyOn(storage, 'remove').mockReturnValue(Promise.reject(initialError));
      vi.spyOn(provider, 'tryToResetStorage').mockReturnValue(Promise.reject(new Error('reset failed')));

      await expect(provider.removeItem(LocalStorageKey.LOGS)).rejects.toEqual(initialError);
      expect(provider.tryToResetStorage).toHaveBeenCalledWith(initialError);
    });
    it('throws the post-retry error when retrying storage.remove after reset fails', async () => {
      vi.spyOn(provider, 'isIos').mockReturnValue(true);
      const initialError = new Error('initial failure');
      const postError = new Error('post retry failure');
      vi.spyOn(storage, 'remove')
        .mockReturnValueOnce(Promise.reject(initialError))
        .mockReturnValueOnce(Promise.reject(postError));
      vi.spyOn(provider, 'tryToResetStorage').mockReturnValue(Promise.resolve());

      await expect(provider.removeItem(LocalStorageKey.LOGS)).rejects.toEqual(postError);
      expect(provider.tryToResetStorage).toHaveBeenCalledWith(initialError);
      expect(vi.mocked(storage.remove as Mock).mock.calls.length).toBe(2);
    });
  });
});
