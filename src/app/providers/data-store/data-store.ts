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

export interface WindowWithSQLitePlugin extends Window {
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
      this.storage = await this.storage.create();

      //Attempt to migrate any old IndexedDB data to Ionic Storage
      await this.attemptDataStoreMigration();
    } catch (err) {
      // If there is an error during initialization, log it
      this.reportLog('initDataStore error', '', err);
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
      this.reportLog('attemptDataStoreMigration error', '', err);
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
          this.reportLog('getIndexDBDataByKey error', '', err);
          reject(err);
        }
      };
      request.onerror = (event) => {
        // If there is an error, log it and reject the promise
        const error = get(event, 'target.error');
        this.reportLog('getIndexDBDataByKey error', '', error);
        reject(error);
      };
    });
  }

  /**
   * Extracts all data from the old index db database.
   */
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

  /**
   * Deletes the old index db databases.
   */
  async clearIndexedDB() {
    try {
      // Clear all IndexedDB databases
      (await window.indexedDB.databases()).forEach((db) => {
        window.indexedDB.deleteDatabase(db.name);
      });
    } catch (err) {
      this.reportLog('clearIndexedDB error', '', err);
      throw err;
    }
  }

  /**
   Check if the platform is iOS
   @returns boolean - whether the platform is iOS
   */
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
      // Get the keys from storage with a timeout (Some storage errors can hang indefinitely)
      return await this.forceTimeoutAfterSetTime(this.storage.keys());
    } catch (err) {
      console.error('get keys', err);
      this.reportLog('Getting keys error', '', err, false);
      try {
        await this.tryToResetStorage(err);
      } catch (error) {
        //Throw the original error if storage reset fails for clarity in the functions that called this method
        throw err;
      }
      try {
        //Retry getting the keys from storage with a timeout
        return await this.forceTimeoutAfterSetTime(this.storage.keys());
      } catch (error) {
        this.reportLog('Removing storage post error', '', err, false);
        throw error;
      }
    }
  }

  /**
   * Check if the error justifies a storage reset. If it does, reset the storage.
   *
   * @returns A promise resolving to the parsed JSON value, or null if not found.
   * @param error - The Error we're assessing.
   */
  tryToResetStorage = async (error: Error) => {
    console.error(error);
    if (
      error.message === DataStoreProvider.storageTimeoutErrorText ||
      error.message.includes('malformed') ||
      error.message.includes('readonly') ||
      (error.message.includes('no such table') && error.message.includes('_ionicstorage'))
    ) {
      try {
        await this.resetStorage();
        this.reportLog('Resetting storage success', '', error, false, LogType.INFO);
      } catch (error) {
        this.reportLog('Resetting storage error', '', error, false);
        throw error;
      }
    }
  };

  /**
   * Delete the SQL Lite database from the device, create a new one and repopulate its contents
   */
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
      async (error: string) => {
        if (error.includes('does not exist')) {
          //Re-initialize the storage
          await this.initDataStore();
          await this.repopulateStorage();
          return;
        }
        throw error;
      }
    );
  }

  /**
   * Repopulate a specific storage key with passed value, logging any errors
   */
  async repopulateStorageSetter(key: StorageKey, value: string, logName: string) {
    try {
      await this.forceTimeoutAfterSetTime(this.storage.set(key, value));
    } catch (error) {
      this.reportLog(`repopulating ${logName} error`, key, error);
    }
  }

  /**
   * Repopulate every storage key with the latest data from the state
   */
  async repopulateStorage() {
    await this.repopulateStorageSetter(
      LocalStorageKey.CONFIG,
      JSON.stringify(this.store$.selectSignal(selectAppConfig)()),
      'config'
    );
    await this.repopulateStorageSetter(
      LocalStorageKey.JOURNAL,
      JSON.stringify(this.store$.selectSignal(getJournalState)()),
      'journal'
    );
    await this.repopulateStorageSetter(
      LocalStorageKey.JOURNAL_RECALL_AUTO_DISPLAY_TIME,
      JSON.stringify(this.store$.selectSignal(getRecallAutoPopupLastDisplayedTime)()),
      'journal recall auto display time'
    );
    await this.repopulateStorageSetter(
      LocalStorageKey.LOGS,
      JSON.stringify(this.store$.selectSignal(getLogsState)()),
      'logs'
    );
    await this.repopulateStorageSetter(
      LocalStorageKey.TESTS,
      JSON.stringify(this.store$.selectSignal(getTests)()),
      'tests'
    );
    await this.repopulateStorageSetter(
      LocalStorageKey.EXAMINER_STATS_KEY,
      JSON.stringify(this.store$.selectSignal(selectExaminerRecords)()),
      'examiner records'
    );
    await this.repopulateStorageSetter(
      LocalStorageKey.AUTH_RESULT,
      JSON.stringify(this.store$.selectSignal(selectAuthResult)()),
      'auth result'
    );
  }

  /**
   * Places the passed function in a timeout with a duration of the passed milliseconds, throwing an error if the
   * function times out
   * @param promise - passed promise that needs to resolve
   * @param timeoutInMilliseconds - amount of time promise has to resolve (in milliseconds)
   */
  forceTimeoutAfterSetTime = <T>(
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
      // Set the item in storage with a timeout (Some storage errors can hang indefinitely)
      return await this.forceTimeoutAfterSetTime(this.storage.set(key, value));
    } catch (err) {
      this.reportLog('Setting storage error', key, err, false);
      try {
        await this.tryToResetStorage(err);
      } catch (error) {
        //Throw the original error if storage reset fails for clarity in the functions that called this method
        throw err;
      }
      try {
        //Retry setting the item in storage with a timeout
        return await this.forceTimeoutAfterSetTime(this.storage.set(key, value));
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
      // Get the item in storage with a timeout (Some storage errors can hang indefinitely)
      return await this.forceTimeoutAfterSetTime(this.storage.get(key));
    } catch (err) {
      this.reportLog('Getting storage error', key, err, false);
      try {
        await this.tryToResetStorage(err);
      } catch (error) {
        //Throw the original error if storage reset fails for clarity in the functions that called this method
        throw err;
      }
      try {
        //Retry getting the item in storage with a timeout
        return await this.forceTimeoutAfterSetTime(this.storage.get(key));
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
      // Remove the item in storage with a timeout (Some storage errors can hang indefinitely)
      return await this.forceTimeoutAfterSetTime(this.storage.remove(key));
    } catch (err) {
      this.reportLog('Removing storage error', key, err, false);
      try {
        await this.tryToResetStorage(err);
      } catch (error) {
        //Throw the original error if storage reset fails for clarity in the functions that called this method
        throw err;
      }
      try {
        //Retry removing the item in storage with a timeout
        return await this.forceTimeoutAfterSetTime(this.storage.remove(key));
      } catch (error) {
        this.reportLog('Removing storage post error', key, err, false);
        throw error;
      }
    }
  }

  /**
   * log report handler
   *
   * @param action - The main body of text for the log
   * @param key - identifier
   * @param error - The associated error, if there is one
   * @param saveToStorage - Should this log be saved permanently to the storage
   * @param level - The Log level of this log (info, debug, error, etc.)
   */
  reportLog = (
    action: string,
    key: string,
    error: Error | unknown,
    saveToStorage = true,
    level: LogType = LogType.ERROR
  ): void => {
    console.error(action, key, error);
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
