import { Injectable } from '@angular/core';
import { SearchResultTestSchema } from '@dvsa/mes-search-schema';
import { Store } from '@ngrx/store';
import { LoadCompletedTestsSuccess } from '@store/journal/journal.actions';
import { DataStoreProvider } from '../data-store/data-store';
import { StoreModel } from '../../shared/models/store.model';

@Injectable()
export class CompletedTestPersistenceProvider {

  constructor(
    private dataStoreProvider: DataStoreProvider,
    private store$: Store<StoreModel>,
  ) {}

  private completedTestKeychainKey = 'COMPLETED_TESTS';

  async persistCompletedTests(completedTests: SearchResultTestSchema[]): Promise<void> {
    console.log('persistCompletedTests CompletedTests', completedTests);
    await this.dataStoreProvider.setItem(this.completedTestKeychainKey, JSON.stringify(completedTests));
  }

  async clearPersistedCompletedTests(): Promise<void> {
    const items: string[] = await this.dataStoreProvider.getKeys();
    if (items.indexOf(this.completedTestKeychainKey) >= 0) {
      await this.dataStoreProvider.removeItem(this.completedTestKeychainKey);
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
