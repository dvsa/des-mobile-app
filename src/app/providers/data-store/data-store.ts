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
import { SaveLog } from '@store/logs/logs.actions';
import CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';
import { LogHelper } from '../logs/logs-helper';

export enum LocalStorageKey {
  COMPLETED_TESTS = 'COMPLETED_TESTS',
  CONFIG = 'CONFIG',
  JOURNAL = 'JOURNAL',
  LOGS = 'LOGS',
  STORAGE_MIGRATED = 'STORAGE_MIGRATED',
  TESTS = 'TESTS',
  EXAMINER_STATS_KEY = 'EXAMINER_STAT_PREFERENCES',
}

export type StorageKey = LocalStorageKey | Token;

@Injectable()
export class DataStoreProvider {
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
      this.reportLog('clearIndexedDB', '', err, LogType.ERROR);
      throw err;
    }
  }

  isIos = () => this.platform.is('cordova');

  /**
   * Get all stored keys
   * NOTE: secureContainer guard clause allows app to run in browser
   * @returns Promise
   */
  async getKeys(): Promise<string[]> {
    try {
      if (!this.isIos()) {
        return [''];
      }
      return await this.storage.keys();
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
  async setItem(key: StorageKey, value: unknown): Promise<string> {
    try {
      if (!this.isIos()) {
        return '';
      }
      return await this.storage.set(key, value);
    } catch (err) {
      this.reportLog('setting storage', key, err);
      throw err;
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
      return await this.storage.get(key);
    } catch (err) {
      this.reportLog('getting storage', key, err);
      throw err;
    }
  }

  /**
   * removes the item for a given key
   * NOTE: secureContainer guard clause allows app to run in browser
   * @param key - identifier to remove
   * @returns Promise
   */
  async removeItem(key: StorageKey): Promise<string> {
    try {
      if (!this.isIos()) return '';

      return await this.storage.remove(key);
    } catch (err) {
      this.reportLog('removing', key, err);
      return Promise.resolve('');
    }
  }

  private reportLog = (action: string, key: string, error: Error | unknown, level: LogType = LogType.ERROR): void => {
    this.store$.dispatch(
      SaveLog({
        payload: this.logHelper.createLog(
          level,
          `DataStoreProvider ${level} ${action} ${key}`,
          serialiseLogMessage(error)
        ),
      })
    );
  };
}
