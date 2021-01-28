import { TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { configureTestSuite } from 'ng-bullet';
import { DataStoreProvider } from '../../data-store/data-store';
import { DataStoreProviderMock } from '../../data-store/__mocks__/data-store.mock';
import { TestPersistenceProvider } from '../test-persistence';
import { TestsModel } from '../../../../store/tests/tests.model';
import { AppConfigProvider } from '../../app-config/app-config';
import { AppConfigProviderMock } from '../../app-config/__mocks__/app-config.mock';
import { DateTime } from '../../../shared/helpers/date-time';
import { TestStatus } from '../../../../store/tests/test-status/test-status.model';

describe('TestPersistenceProvider', () => {
  let testPersistenceProvider: TestPersistenceProvider;
  let dataStoreProvider;
  let testState: TestsModel;
  const todaysDate = new DateTime().format('YYYY-MM-DDTHH:mm:ss');

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        TestPersistenceProvider,
        { provide: DataStoreProvider, useClass: DataStoreProviderMock },
        { provide: AppConfigProvider, useClass: AppConfigProviderMock },
      ],
      imports: [
        StoreModule.forRoot({
          tests: () => testState,
        }),
      ],
    });
  });

  beforeEach(() => {
    testState = {
      currentTest: { slotId: '23456789' },
      startedTests: {
        12345678: {
          rekey: false,
          changeMarker: false,
          examinerBooked: 1,
          examinerConducted: 1,
          examinerKeyed: 1,
          version: '0.0.1',
          category: 'B',
          activityCode: '1',
          journalData: {
            examiner: {
              staffNumber: '12345',
            },
            candidate: {},
            testCentre: {
              centreId: 12345,
              costCode: '12345',
            },
            testSlotAttributes: {
              slotId: 1,
              welshTest: true,
              specialNeeds: true,
              extendedTest: true,
              vehicleTypeCode: '12345',
              start: '2019-01-05T18:20:58',
            },
            applicationReference: {
              applicationId: 1,
              bookingSequence: 1,
              checkDigit: 1,
            },
          },
        },
        23456789: {
          rekey: false,
          changeMarker: false,
          examinerBooked: 1,
          examinerConducted: 1,
          examinerKeyed: 1,
          version: '0.0.1',
          category: 'B',
          activityCode: '1',
          journalData: {
            examiner: {
              staffNumber: '12345',
            },
            candidate: {},
            testCentre: {
              centreId: 12345,
              costCode: '12345',
            },
            testSlotAttributes: {
              slotId: 1,
              welshTest: true,
              specialNeeds: true,
              extendedTest: true,
              vehicleTypeCode: '12345',
              start: todaysDate,
            },
            applicationReference: {
              applicationId: 1,
              bookingSequence: 1,
              checkDigit: 1,
            },
          },
        },
      },
      testStatus: {
        12345678: TestStatus.Booked,
        23456789: TestStatus.Booked,
      },
    };
    testPersistenceProvider = TestBed.inject(TestPersistenceProvider);
    dataStoreProvider = TestBed.inject(DataStoreProvider);
  });

  describe('persistTests', () => {
    it('should take the tests state slice and pass it to the data store provider stringified', async () => {
      await testPersistenceProvider.persistTests(testState);

      expect(dataStoreProvider.setItem).toHaveBeenCalledTimes(1);
      expect(dataStoreProvider.setItem.calls.first().args[0]).toBe('TESTS');
      expect(JSON.parse(dataStoreProvider.setItem.calls.first().args[1])).toEqual(testState);
    });
  });

  describe('loadPersistedTests', () => {
    it('should return the test JSON from the data store parsed into a TestsModel', async () => {
      dataStoreProvider.getItem.and.returnValue(JSON.stringify(testState));

      const result = await testPersistenceProvider.loadPersistedTests();

      expect(dataStoreProvider.getItem).toHaveBeenCalledWith('TESTS');
      expect(result).toEqual({
        currentTest: { slotId: '23456789' },
        startedTests: {
          23456789: testState.startedTests[23456789],
        },
        testStatus: {
          23456789: testState.testStatus[23456789],
        },
      });
    });
    it('should return null if the data store provider throws', async () => {
      dataStoreProvider.getItem.and.throwError('test error');

      const result = await testPersistenceProvider.loadPersistedTests();

      expect(dataStoreProvider.getItem).toHaveBeenCalledWith('TESTS');
      expect(result).toBeNull();
    });
  });
  describe('clearPersistedTests', () => {
    it('should remove item on the data stores test key', async () => {
      await testPersistenceProvider.clearPersistedTests();

      expect(dataStoreProvider.removeItem).toHaveBeenCalledWith('TESTS');
    });
  });
  describe('clearCachedTests', () => {
    it('should return null if there is no data in the store', () => {
      expect(testPersistenceProvider.clearCachedTests(null)).toEqual(null);
    });
    // TODO fix failing test
    xit('should remove all tests that are over 14 days old', () => {
      expect(testPersistenceProvider.clearCachedTests(testState)).toEqual({
        currentTest: { slotId: '23456789' },
        startedTests: {
          23456789: testState.startedTests[23456789],
        },
        testStatus: {
          23456789: testState.testStatus[23456789],
        },
      });
    });
  });
  describe('getTestsToDelete', () => {
    it('should return the correct tests to delete', () => {
      const result = testPersistenceProvider.getTestsToDelete(testState);
      expect(result).toEqual(['12345678']);
    });
  });
  describe('deleteTestsFromTestObject', () => {
    it('should delete the correct tests from the started tests object', () => {
      const keysToDelete = ['12345678'];
      const result = testPersistenceProvider.deleteTestsFromTestObject(testState.startedTests, keysToDelete);
      expect(result).toEqual({ 23456789: testState.startedTests[23456789] });
    });

    it('should delete the correct tests from the test status object', () => {
      const keysToDelete = ['12345678'];
      const result = testPersistenceProvider.deleteTestsFromTestObject(testState.testStatus, keysToDelete);
      expect(result).toEqual({ 23456789: TestStatus.Booked });
    });
  });
  describe('shouldResetCurrentTest', () => {
    it('should return true if the current test is in the keys to delete', () => {
      const testsToDelete = ['1', '2', '3'];
      expect(testPersistenceProvider.shouldResetCurrentTest('2', testsToDelete)).toEqual(true);
    });
    it('should return false if the current test is not in the keys to delete', () => {
      const testsToDelete = ['1', '2', '3'];
      expect(testPersistenceProvider.shouldResetCurrentTest('4', testsToDelete)).toEqual(false);
    });
  });
});
