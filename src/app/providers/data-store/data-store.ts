import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

import { Capacitor } from '@capacitor/core';
import { Drivers } from '@ionic/storage';
import { Store } from '@ngrx/store';
import { Token } from '@providers/authentication/authentication';
import { serialiseLogMessage } from '@shared/helpers/serialise-log-message';
import { LogType } from '@shared/models/log.model';
import { StoreModel } from '@shared/models/store.model';
import { selectAppConfig } from '@store/app-config/app-config.selectors';
import { selectAuthResult } from '@store/app-info/app-info.selectors';
import { selectExaminerRecords } from '@store/examiner-records/examiner-records.selectors';
import { getJournalState } from '@store/journal/journal.reducer';
import { getRecallAutoPopupLastDisplayedTime } from '@store/journal/journal.selector';
import { SaveLog } from '@store/logs/logs.actions';
import { getLogsState } from '@store/logs/logs.reducer';
import { getTests } from '@store/tests/tests.reducer';
import CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';
import { get } from 'lodash-es';
import { LogHelper } from '../logs/logs-helper';

interface SQLitePlugin {
  deleteDatabase(
    options: { name: string; location: string },
    success?: () => void,
    error?: (err: unknown) => void
  ): Promise<void>;
}

interface WindowWithSQLitePlugin extends Window {
  sqlitePlugin?: SQLitePlugin;
}

export enum LocalStorageKey {
  COMPLETED_TESTS = 'COMPLETED_TESTS',
  CONFIG = 'CONFIG',
  JOURNAL = 'JOURNAL',
  JOURNAL_RECALL_AUTO_DISPLAY_TIME = 'JOURNAL_RECALL_AUTO_DISPLAY_TIME',
  LOGS = 'LOGS',
  STORAGE_MIGRATED = 'STORAGE_MIGRATED',
  TESTS = 'TESTS',
  EXAMINER_STATS_KEY = 'EXAMINER_STAT_PREFERENCES',
  AUTH_RESULT = 'AUTH_RESULT',
}

export type StorageKey = LocalStorageKey | Token;

@Injectable()
export class DataStoreProvider {
  private static readonly defaultStorageTimeoutMilliseconds = 5000;
  private static readonly storageTimeoutErrorText = 'DataStoreProvider Storage Call Timeout';
  private static readonly defaultStoreName = 'DES';

  constructor(
    public platform: Platform,
    private logHelper: LogHelper,
    private store$: Store<StoreModel>,
    private storage: Storage
  ) {}

  /**
   * Initializes the data store by defining the storage driver and creating the storage instance.
   * It also attempts to migrate any old IndexedDB data to Ionic Storage if applicable.
   */
  async initDataStore() {
    try {
      //Define the storage driver
      await this.storage.defineDriver(CordovaSQLiteDriver);
      // Create the storage instance
      console.log('init store');
      this.storage = await this.storage.create();
      console.log('store created');

      //Attempt to migrate any old IndexedDB data to Ionic Storage
      await this.attemptDataStoreMigration();
    } catch (err) {
      console.error(err);
      // If there is an error during initialization, log it
      this.reportLog('initDataStore', '', err);
      throw err;
    }
  }

  /**
   * Attempts to migrate IndexedDB data to Ionic Storage if the platform is not web.
   * This method checks if there is any old IndexedDB data and migrates it to Ionic Storage.
   * It also clears the IndexedDB after migration.
   */
  async attemptDataStoreMigration(): Promise<void> {
    try {
      // Check if there is any old IndexedDB data to migrate and the platform is not web
      if (
        this.storage.driver !== Drivers.IndexedDB &&
        (await window.indexedDB.databases()).length > 0 &&
        Capacitor.getPlatform() !== 'web'
      ) {
        // If the platform is not web, migrate IndexedDB data to Ionic Storage
        await this.migrateIndexedDBData(await this.getIndexDBData());
        // clear IndexedDB after migration
        await this.clearIndexedDB();
      }
    } catch (err) {
      this.reportLog('attemptDataStoreMigration', '', err);
    }
  }

  /**
   * Migrates IndexedDB data to Ionic Storage.
   *
   * @param indexdbData - The IndexedDB data to be migrated.
   * @returns A promise that resolves when the migration is complete.
   */
  async migrateIndexedDBData(indexdbData: Record<string, unknown>): Promise<void> {
    // Check if the data to be migrated is valid
    if (indexdbData) {
      // Iterate over the keys in the IndexedDB data and set them in Ionic Storage
      for (const key in indexdbData) {
        await this.storage.set(key, JSON.stringify(indexdbData[key]));
      }
    }
  }

  /**
   * Retrieves and parses a value by key from the given IndexedDB object store.
   *
   * @param key - The key to look up in the object store.
   * @param objectStore - The IndexedDB object store to query.
   * @returns A promise resolving to the parsed JSON value, or null if not found.
   */
  async getIndexDBDataByKey(key: string, objectStore: IDBObjectStore): Promise<Record<string, unknown>> {
    return new Promise((resolve, reject) => {
      //try to get the value from the object store by key
      const request = objectStore.get(key);
      // Handle the success and error events
      request.onsuccess = (event) => {
        // If the value is found, parse it and resolve the promise
        try {
          // Get the result from the event
          const value = get(event, 'target.result');
          // If the value is null or undefined, resolve with null
          if (!value) return resolve(null);
          // Parse the value as JSON and resolve the promise
          resolve(JSON.parse(value));
        } catch (err) {
          this.reportLog('getIndexDBDataByKey', '', err);
          reject(err);
        }
      };
      request.onerror = (event) => {
        // If there is an error, log it and reject the promise
        const error = get(event, 'target.error');
        this.reportLog('getIndexDBDataByKey', '', error);
        reject(error);
      };
    });
  }

  async getIndexDBData(): Promise<Record<string, unknown>> {
    return new Promise((resolve, reject) => {
      // Open the IndexedDB database
      const request = window.indexedDB.open('_ionicstorage');
      // Handle the success and error events
      request.onsuccess = async (event) => {
        // Get the database from the event
        const db: IDBDatabase = get(event, 'target.result');
        // If the database is not found, resolve with null
        if (!db) {
          return resolve(null);
        }
        // Get the names of all object stores in the database
        const storeNames = Array.from(db.objectStoreNames);
        // If there are no object stores, resolve with null
        if (!storeNames.length) {
          return resolve(null);
        }
        // Start a transaction to read from the object store
        const transaction = db.transaction(storeNames, 'readonly');
        // Get the object store from the transaction
        const objectStore = transaction.objectStore('_ionickv');
        // If the object store is not found, resolve with null
        if (!objectStore) {
          return resolve(null);
        }
        // Create an empty object to hold the data
        const holdingJSON = {};
        // Define the keys to be migrated
        const keysToBeMigrated = [LocalStorageKey.JOURNAL, LocalStorageKey.EXAMINER_STATS_KEY, LocalStorageKey.TESTS];
        // Iterate over the keys to be migrated and get their values from the object store
        for (const key of keysToBeMigrated) {
          // Get the value for each key from the object store
          const oldDataKey = await this.getIndexDBDataByKey(key, objectStore);
          // If the value is found, add it to the holding JSON object
          if (oldDataKey) {
            holdingJSON[key] = oldDataKey;
          }
        }
        // Close the transaction
        transaction.oncomplete = () => {
          db.close();
        };

        // Resolve the promise with the holding JSON object
        resolve(holdingJSON);
      };
      // Handle the error event
      request.onerror = (event) => reject(get(event, 'target.error'));
    });
  }

  async clearIndexedDB() {
    try {
      // Clear all IndexedDB databases
      (await window.indexedDB.databases()).forEach((db) => {
        window.indexedDB.deleteDatabase(db.name);
      });
    } catch (err) {
      this.reportLog('clearIndexedDB', '', err);
      throw err;
    }
  }

  isIos = () => this.platform.is('cordova');

  /**
   * Get all stored keys
   * NOTE: isIos guard clause allows app to run in browser
   * @returns Promise
   */
  async getKeys(): Promise<string[]> {
    try {
      if (!this.isIos()) {
        return [''];
      }
      return await this.timeout(this.storage.keys());
    } catch (err) {
      this.reportLog('Getting keys', '', err, false);
      try {
        await this.tryToResetStorage(err);
      } catch (error) {
        throw err;
      }
      try {
        return await this.timeout(this.storage.keys());
      } catch (error) {
        this.reportLog('Removing storage post error', '', err, false);
        throw error;
      }
    }
  }

  tryToResetStorage = async (error: Error) => {
    console.log('error', error);
    if (
      error.message === DataStoreProvider.storageTimeoutErrorText ||
      error.message.includes('malformed') ||
      (error.message.includes('no such table') && error.message.includes('_ionicstorage'))
    ) {
      try {
        await this.resetStorage();
      } catch (error) {
        this.reportLog('Resetting storage', '', error, false);
        throw error;
      }
    }
  };

  async resetStorage() {
    const sqlLitePlugin: SQLitePlugin = (window as WindowWithSQLitePlugin)?.sqlitePlugin;
    if (!sqlLitePlugin) {
      throw new Error('Missing SQL Lite plugin');
    }
    //Delete the old database
    await sqlLitePlugin?.deleteDatabase(
      {
        name: '_ionicstorage',
        location: 'default',
      },
      async () => {
        //Re-initialize the storage
        await this.initDataStore();
        await this.repopulateStorage();
        return;
      },
      (error: Error) => {
        throw error;
      }
    );
  }

  async repopulateStorage() {
    try {
      await this.setItem(LocalStorageKey.CONFIG, JSON.stringify(this.store$.selectSignal(selectAppConfig)()));
    } catch (error) {
      this.reportLog('repopulating config', LocalStorageKey.CONFIG, error);
    }
    try {
      await this.setItem(LocalStorageKey.JOURNAL, JSON.stringify(this.store$.selectSignal(getJournalState)()));
    } catch (error) {
      this.reportLog('repopulating journal', LocalStorageKey.JOURNAL, error);
    }
    try {
      await this.setItem(
        LocalStorageKey.JOURNAL_RECALL_AUTO_DISPLAY_TIME,
        this.store$.selectSignal(getRecallAutoPopupLastDisplayedTime)()
      );
    } catch (error) {
      this.reportLog(
        'repopulating journal recall auto display time',
        LocalStorageKey.JOURNAL_RECALL_AUTO_DISPLAY_TIME,
        error
      );
    }
    try {
      await this.setItem(LocalStorageKey.LOGS, JSON.stringify(this.store$.selectSignal(getLogsState)()));
    } catch (error) {
      this.reportLog('repopulating logs', LocalStorageKey.LOGS, error);
    }
    try {
      await this.setItem(LocalStorageKey.TESTS, JSON.stringify(this.store$.selectSignal(getTests)()));
    } catch (error) {
      this.reportLog('repopulating TESTS', LocalStorageKey.TESTS, error);
    }
    try {
      await this.setItem(
        LocalStorageKey.EXAMINER_STATS_KEY,
        JSON.stringify(this.store$.selectSignal(selectExaminerRecords)())
      );
    } catch (error) {
      this.reportLog('repopulating examiner records', LocalStorageKey.EXAMINER_STATS_KEY, error);
    }
    try {
      await this.setItem(LocalStorageKey.AUTH_RESULT, JSON.stringify(this.store$.selectSignal(selectAuthResult)()));
    } catch (error) {
      this.reportLog('repopulating auth result', LocalStorageKey.AUTH_RESULT, error);
    }
  }

  timeout = <T>(
    promise: Promise<T>,
    timeoutInMilliseconds: number = DataStoreProvider.defaultStorageTimeoutMilliseconds
  ): Promise<T> =>
    Promise.race([
      promise,
      new Promise<T>((_resolve, reject) => {
        setTimeout(() => {
          reject(new Error(DataStoreProvider.storageTimeoutErrorText));
        }, timeoutInMilliseconds);
      }),
    ]);

  /**
   * sets the value for specified key
   * NOTE: isIos guard clause allows app to run in browser
   * @param key - identifier
   * @param value - value to pair with key
   * @returns Promise
   */
  async setItem(key: StorageKey, value: unknown): Promise<string> {
    try {
      if (!this.isIos()) {
        return '';
      }
      return await this.timeout(this.storage.set(key, value));
    } catch (err) {
      this.reportLog('Setting storage', key, err, false);
      try {
        await this.tryToResetStorage(err);
      } catch (error) {
        throw err;
      }
      try {
        return await this.timeout(this.storage.set(key, value));
      } catch (error) {
        this.reportLog('Setting storage post error', key, err, false);
        throw error;
      }
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
      return await this.timeout(this.storage.get(key));
    } catch (err) {
      this.reportLog('Getting storage', key, err, false);
      try {
        await this.tryToResetStorage(err);
      } catch (error) {
        throw err;
      }
      try {
        return await this.timeout(this.storage.get(key));
      } catch (error) {
        this.reportLog('Getting storage post error', key, err, false);
        throw error;
      }
    }
  }

  /**
   * removes the item for a given key
   * NOTE: isIos guard clause allows app to run in browser
   * @param key - identifier to remove
   * @returns Promise
   */
  async removeItem(key: StorageKey): Promise<string> {
    try {
      if (!this.isIos()) return '';
      return await this.timeout(this.storage.remove(key));
    } catch (err) {
      this.reportLog('Removing storage', key, err, false);
      try {
        await this.tryToResetStorage(err);
      } catch (error) {
        throw err;
      }
      try {
        return await this.timeout(this.storage.remove(key));
      } catch (error) {
        this.reportLog('Removing storage post error', key, err, false);
        throw error;
      }
    }
  }

  private reportLog = (
    action: string,
    key: string,
    error: Error | unknown,
    saveToStorage = true,
    level: LogType = LogType.ERROR
  ): void => {
    console.log('error logged', action, key, error, saveToStorage);
    this.store$.dispatch(
      SaveLog(
        {
          payload: this.logHelper.createLog(
            level,
            `DataStoreProvider ${level} ${action} ${key}`,
            serialiseLogMessage(error)
          ),
        },
        saveToStorage
      )
    );
  };
}
