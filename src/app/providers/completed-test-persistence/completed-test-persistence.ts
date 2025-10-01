import { Injectable } from '@angular/core';
import { SearchResultTestSchema } from '@dvsa/mes-search-schema';
import { Store } from '@ngrx/store';
import { LogHelper } from '@providers/logs/logs-helper';
import { serialiseLogMessage } from '@shared/helpers/serialise-log-message';
import { LogType } from '@shared/models/log.model';
import { StoreModel } from '@shared/models/store.model';
import { LoadCompletedTestsSuccess } from '@store/journal/journal.actions';
import { SaveLog } from '@store/logs/logs.actions';
import { DataStoreProvider, LocalStorageKey } from '../data-store/data-store';

@Injectable()
export class CompletedTestPersistenceProvider {
  constructor(
    private dataStoreProvider: DataStoreProvider,
    private store$: Store<StoreModel>,
    private logHelper: LogHelper
  ) {}

  private completedTestKeychainKey = LocalStorageKey.COMPLETED_TESTS;

  async persistCompletedTests(completedTests: SearchResultTestSchema[]): Promise<void> {
    await this.dataStoreProvider.setItem(this.completedTestKeychainKey, JSON.stringify(completedTests));
  }

  async clearPersistedCompletedTests(): Promise<void> {
    const items: string[] = await this.dataStoreProvider.getKeys();
    if (items?.indexOf(this.completedTestKeychainKey) >= 0) {
      try {
        await this.dataStoreProvider.removeItem(this.completedTestKeychainKey);
      } catch (error) {
        this.store$.dispatch(
          SaveLog({
            payload: this.logHelper.createLog(
              LogType.ERROR,
              'Clear completed persisted tests error',
              `CompletedTestPersistence => ${serialiseLogMessage(error)}`
            ),
          })
        );
      }
    }
    return Promise.resolve();
  }

  async loadCompletedPersistedTests(): Promise<void> {
    let completedTests: SearchResultTestSchema[] | null = null;
    try {
      const persistedTestJson = await this.dataStoreProvider.getItem(this.completedTestKeychainKey);
      completedTests = persistedTestJson.length > 0 ? JSON.parse(persistedTestJson) : null;
      if (completedTests) {
        this.store$.dispatch(LoadCompletedTestsSuccess(completedTests));
      }
    } catch (err) {
      if (!/The specified item could not be found in the keychain/.test(err)) {
        console.error(`Error loading completed persisted tests: ${err}`);
      }
    }
  }
}
