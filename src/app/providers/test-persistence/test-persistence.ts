/* eslint-disable no-param-reassign */
import { Injectable } from '@angular/core';
import { DateTime } from '@shared/helpers/date-time';
import { TestsModel } from '@store/tests/tests.model';
import { DataStoreProvider } from '../data-store/data-store';
import { AppConfigProvider } from '../app-config/app-config';

@Injectable()
export class TestPersistenceProvider {

  constructor(
    private dataStoreProvider: DataStoreProvider,
    private appConfigProvider: AppConfigProvider,
  ) {}

  private testKeychainKey = 'TESTS';

  persistTests(tests: TestsModel): Promise<string> {
    return this.dataStoreProvider.setItem(this.testKeychainKey, JSON.stringify(tests));
  }

  async loadPersistedTests(): Promise<TestsModel | null> {
    let testsModel: TestsModel | null = null;
    try {
      const persistedTestJson = await this.dataStoreProvider.getItem(this.testKeychainKey);
      testsModel = persistedTestJson.length > 0 ? JSON.parse(persistedTestJson) : null;
    } catch (err) {
      if (!/The specified item could not be found in the keychain/.test(err)) {
        console.error(`Error loading persisted tests: ${err}`);
      }
    }
    return this.clearCachedTests(testsModel);
  }

  async clearPersistedTests(): Promise<void> {
    const items: string[] = await this.dataStoreProvider.getKeys();
    if (items.indexOf(this.testKeychainKey) >= 0) {
      await this.dataStoreProvider.removeItem(this.testKeychainKey);
    }
    return Promise.resolve();
  }

  clearCachedTests(tests: TestsModel): TestsModel {
    if (tests === null) {
      return null;
    }

    const testsToDelete = this.getTestsToDelete(tests);

    return {
      currentTest: {
        slotId: this.shouldResetCurrentTest(tests.currentTest.slotId, testsToDelete) ? null : tests.currentTest.slotId,
      },
      startedTests: {
        ...this.deleteTestsFromTestObject(tests.startedTests, testsToDelete),
      },
      testStatus: {
        ...this.deleteTestsFromTestObject(tests.testStatus, testsToDelete),
      },
    };

  }

  getTestsToDelete(tests: TestsModel): string[] {
    return Object.keys(tests.startedTests).filter((key) => {
      const startDate: DateTime = new DateTime(tests.startedTests[key].journalData.testSlotAttributes.start);
      return startDate.daysDiff(new DateTime()) > this.appConfigProvider.getAppConfig().journal.daysToCacheJournalData;
    });
  }

  deleteTestsFromTestObject(testObject: any, keysToDelete: string[]): any {
    keysToDelete.forEach((key) => {
      delete testObject[key];
    });
    return testObject;
  }

  shouldResetCurrentTest(slotId: string, keysToDelete: string[]): boolean {
    return keysToDelete.includes(slotId);
  }
}
