import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { LogHelper } from '@providers/logs/logs-helper';
import { DateTime } from '@shared/helpers/date-time';
import { serialiseLogMessage } from '@shared/helpers/serialise-log-message';
import { isAnyOf } from '@shared/helpers/simplifiers';
import { LogType } from '@shared/models/log.model';
import { StoreModel } from '@shared/models/store.model';
import { SaveLog } from '@store/logs/logs.actions';
import { TestStatus } from '@store/tests/test-status/test-status.model';
import { TestsModel } from '@store/tests/tests.model';
import { omit } from 'lodash-es';
import { AppConfigProvider } from '../app-config/app-config';
import { DataStoreProvider, LocalStorageKey } from '../data-store/data-store';

@Injectable()
export class TestPersistenceProvider {
  private testKeychainKey = LocalStorageKey.TESTS;

  constructor(
    private dataStoreProvider: DataStoreProvider,
    private appConfigProvider: AppConfigProvider,
    private store$: Store<StoreModel>,
    private logHelper: LogHelper
  ) {}

  persistTests(tests: TestsModel): Promise<string> {
    try {
      return this.dataStoreProvider.setItem(this.testKeychainKey, JSON.stringify(tests));
    } catch (error) {
      this.store$.dispatch(
        SaveLog({
          payload: this.logHelper.createLog(
            LogType.ERROR,
            'Set persisted tests error',
            `TestPersistence => ${serialiseLogMessage(error)}`
          ),
        })
      );
    }
  }

  async loadPersistedTests(): Promise<TestsModel | null> {
    let testsModel: TestsModel | null = null;
    try {
      const persistedTestJson = await this.dataStoreProvider.getItem(this.testKeychainKey);
      if (persistedTestJson) {
        testsModel = persistedTestJson.length > 0 ? JSON.parse(persistedTestJson) : null;
      }
    } catch (err) {
      if (!/The specified item could not be found in the keychain/.test(err)) {
        console.error(`Error loading persisted tests: ${err}`);
        this.store$.dispatch(
          SaveLog({
            payload: this.logHelper.createLog(
              LogType.ERROR,
              'Error loading persisted tests',
              `TestPersistence => ${serialiseLogMessage(err)}`
            ),
          })
        );
      }
    }
    return this.clearCachedTests(testsModel);
  }

  async clearPersistedTests(): Promise<void> {
    const items: string[] = await this.dataStoreProvider.getKeys();
    if (items?.indexOf(this.testKeychainKey) >= 0) {
      try {
        await this.dataStoreProvider.removeItem(this.testKeychainKey);
      } catch (error) {
        this.store$.dispatch(
          SaveLog({
            payload: this.logHelper.createLog(
              LogType.ERROR,
              'Clear persisted tests error',
              `TestPersistence => ${serialiseLogMessage(error)}`
            ),
          })
        );
      }
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
    const { daysToCacheJournalData } = this.appConfigProvider.getAppConfig().journal;

    const notAllCompleted = Object.keys(tests.testStatus).some(
      (key) => !isAnyOf(tests.testStatus[key], [TestStatus.Submitted, TestStatus.Completed])
    );

    // Grace period is set to 46 in order to make up a 60-day window to retain incomplete tests if present
    const GRACE_PERIOD_TO_RETAIN_TEST_IN_DAYS: number = notAllCompleted ? 46 : 3;

    return Object.keys(tests.startedTests).filter((key) => {
      const startDate: DateTime = new DateTime(tests?.startedTests[key]?.journalData?.testSlotAttributes?.start);
      return startDate.daysDiff(new DateTime()) > daysToCacheJournalData + GRACE_PERIOD_TO_RETAIN_TEST_IN_DAYS;
    });
  }

  deleteTestsFromTestObject<T>(testObject: { [slotId: string]: T }, keysToDelete: string[]) {
    return omit(testObject, keysToDelete);
  }

  shouldResetCurrentTest(slotId: string, keysToDelete: string[]): boolean {
    return keysToDelete.includes(slotId);
  }
}
