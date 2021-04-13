import { TestResultSchemasUnion } from '@dvsa/mes-test-schema/categories';
import { CategoryCode, TestResultCommonSchema } from '@dvsa/mes-test-schema/categories/common';
import {
  getCurrentTest,
  getTestStatus,
  isPassed,
  getTestOutcomeText,
  getActivityCode,
  isTestReportPracticeTest,
  isEndToEndPracticeTest,
  getActivityCodeBySlotId,
  getIncompleteTests,
  getIncompleteTestsCount,
  getOldestIncompleteTest,
  isDelegatedTest,
  hasStartedTests,
} from '../tests.selector';
import { JournalModel } from '../../journal/journal.model';
import { AppInfoStateModel } from '../../app-info/app-info.model';
import { LogsModel } from '../../logs/logs.model';
import { TestStatus } from '../test-status/test-status.model';
import { DateTime } from '../../../app/shared/helpers/date-time';
import { TestsModel } from '../tests.model';
import { ActivityCodes } from '../../../app/shared/models/activity-codes';
import { testReportPracticeSlotId, end2endPracticeSlotId } from '../../../app/shared/mocks/test-slot-ids.mock';
import { TestOutcome } from '../tests.constants';
import { ActivityCodeDescription } from '../../../app/shared/constants/activity-code/activity-code.constants';

describe('testsSelector', () => {
  describe('getCurrentTest', () => {
    it('should return whichever test is the current one', () => {
      const currentTest: TestResultSchemasUnion = {
        version: '0.0.1',
        category: 'B',
        journalData: {
          testSlotAttributes: {
            welshTest: false,
            slotId: 123,
            start: '11:34',
            vehicleTypeCode: 'C',
            extendedTest: false,
            specialNeeds: false,
          },
          examiner: {
            staffNumber: '',
          },
          testCentre: {
            centreId: 1,
            costCode: '',
          },
          candidate: {},
          applicationReference: {
            applicationId: 999,
            bookingSequence: 3,
            checkDigit: 5,
          },
        },
        activityCode: ActivityCodes.PASS,
        rekey: false,
        changeMarker: false,
        examinerBooked: 1,
        examinerConducted: 1,
        examinerKeyed: 1,
      };
      const journal: JournalModel = {
        isLoading: false,
        lastRefreshed: new Date(),
        slots: {},
        selectedDate: 'dummy',
        examiner: { staffNumber: '123', individualId: 456 },
        completedTests: [],
      };
      const appInfo: AppInfoStateModel = { versionNumber: '0.0.0', employeeId: '1234567', employeeName: 'Fake Name' };
      const logs: LogsModel = [];
      const state = {
        journal,
        appInfo,
        logs,
        tests: {
          startedTests: { 123: currentTest },
          currentTest: { slotId: '123' },
          testStatus: {},
          completedTests: [],
        },
      };

      const result = getCurrentTest(state.tests);

      expect(result).toBe(currentTest);
    });
  });

  describe('getTestStatus', () => {
    it('should retrieve the status of the test with the given slotId', () => {
      const testState: TestsModel = {
        currentTest: { slotId: null },
        startedTests: {},
        testStatus: { 12345: TestStatus.Decided },
      };

      const result = getTestStatus(testState, 12345);

      expect(result).toBe(TestStatus.Decided);
    });

    it('should default to booked if the test with the given slot ID does not have a status yet', () => {
      const testState: TestsModel = {
        currentTest: { slotId: null },
        startedTests: {},
        testStatus: {},
      };

      const result = getTestStatus(testState, 12345);

      expect(result).toBe(TestStatus.Booked);
    });
  });

  describe('getTestOutcomeText', () => {
    const testState: TestResultCommonSchema = {
      activityCode: ActivityCodes.PASS,
      version: '0.0.1',
      category: 'x' as CategoryCode,
      journalData: {
        examiner: { staffNumber: '12345' },
        testCentre: { centreId: 1, costCode: '12345' },
        testSlotAttributes: {
          slotId: 12345,
          vehicleTypeCode: 'C',
          start: new DateTime().format('HH:mm'),
          welshTest: false,
          extendedTest: false,
          specialNeeds: false,
        },
        candidate: {},
        applicationReference: {
          applicationId: 123,
          bookingSequence: 1,
          checkDigit: 2,
        },
      },
      rekey: false,
      changeMarker: false,
      examinerBooked: 1,
      examinerConducted: 1,
      examinerKeyed: 1,
    };
    it('should retrieve a passed result for a pass activity code', () => {
      const result = getTestOutcomeText(testState as TestResultCommonSchema);
      expect(result).toBe(TestOutcome.Passed);
    });
    it('should retrieve an unsuccessful result for a fail activity code', () => {
      testState.activityCode = ActivityCodes.FAIL;
      const result = getTestOutcomeText(testState);
      expect(result).toBe(TestOutcome.Failed);
    });
    it('should retrieve a terminated result for terminated activity code', () => {
      testState.activityCode = ActivityCodes.CANDIDATE_NOT_HAPPY_WITH_AUTHORISED_OCCUPANT;
      const result = getTestOutcomeText(testState);
      expect(result).toBe(TestOutcome.Terminated);
      expect(result).toBe('Terminated');
    });
  });

  describe('getTestOutcomeClass', () => {
    const testState: TestResultCommonSchema = {
      activityCode: ActivityCodes.PASS,
      version: '0.0.1',
      category: 'x' as CategoryCode,
      journalData: {
        examiner: { staffNumber: '12345' },
        testCentre: { centreId: 1, costCode: '12345' },
        testSlotAttributes: {
          slotId: 12345,
          vehicleTypeCode: 'C',
          start: new DateTime().format('HH:mm'),
          welshTest: false,
          extendedTest: false,
          specialNeeds: false,
        },
        candidate: {},
        applicationReference: {
          applicationId: 123,
          bookingSequence: 1,
          checkDigit: 2,
        },
      },
      rekey: false,
      changeMarker: false,
      examinerBooked: 1,
      examinerConducted: 1,
      examinerKeyed: 1,
    };
    it('should return true for a passed activity code', () => {
      const result = isPassed(testState);
      expect(result).toEqual(true);
    });
    it('should return false for a failed activity code', () => {
      testState.activityCode = ActivityCodes.FAIL;
      const result = isPassed(testState);
      expect(result).toEqual(false);
    });
    it('should return false for a terminated activity code', () => {
      testState.activityCode = ActivityCodes.MECHANICAL_FAILURE;
      const result = isPassed(testState);
      expect(result).toEqual(false);
    });
  });

  describe('getActivityCode', () => {
    const testState: TestResultCommonSchema = {
      // DVSA_RADIO_FAILURE = '25'
      activityCode: ActivityCodes.DVSA_RADIO_FAILURE,
      version: '0.0.1',
      category: 'x' as CategoryCode,
      journalData: {
        examiner: { staffNumber: '12345' },
        testCentre: { centreId: 1, costCode: '12345' },
        testSlotAttributes: {
          slotId: 12345,
          vehicleTypeCode: 'C',
          start: new DateTime().format('HH:mm'),
          welshTest: false,
          extendedTest: false,
          specialNeeds: false,
        },
        candidate: {},
        applicationReference: {
          applicationId: 123,
          bookingSequence: 1,
          checkDigit: 2,
        },
      },
      rekey: false,
      changeMarker: false,
      examinerBooked: 1,
      examinerConducted: 1,
      examinerKeyed: 1,
    };
    it('should return the DVSA_RADIO_FAILURE ActivityCode', () => {
      const activityCode = getActivityCode(testState);
      expect(activityCode.activityCode).toEqual(ActivityCodes.DVSA_RADIO_FAILURE);
      expect(activityCode.description).toEqual(ActivityCodeDescription.DVSA_RADIO_FAILURE);
    });
  });

  describe('isTestReportPracticeTest', () => {
    const testState: TestsModel = {
      currentTest: { slotId: null },
      startedTests: {},
      testStatus: { 12345: TestStatus.Decided },
    };

    it('should return false when no tests started', () => {
      const result = isTestReportPracticeTest(testState);
      expect(result).toEqual(false);
    });

    it('should return false when slot id is numeric', () => {
      testState.currentTest.slotId = '1';
      const result = isTestReportPracticeTest(testState);
      expect(result).toEqual(false);
    });

    it('should return true when slot id starts with practice', () => {
      testState.currentTest.slotId = testReportPracticeSlotId;
      const result = isTestReportPracticeTest(testState);
      expect(result).toEqual(true);
    });
  });

  describe('isEndToEndPracticeTest', () => {
    const testState: TestsModel = {
      currentTest: { slotId: null },
      startedTests: {},
      testStatus: { 12345: TestStatus.Decided },
    };

    it('should return false when no tests started', () => {
      const result = isEndToEndPracticeTest(testState);
      expect(result).toEqual(false);
    });

    it('should return false when slot id is numeric', () => {
      testState.currentTest.slotId = '1';
      const result = isEndToEndPracticeTest(testState);
      expect(result).toEqual(false);
    });

    it('should return true when slot id starts with practice', () => {
      testState.currentTest.slotId = end2endPracticeSlotId;
      const result = isEndToEndPracticeTest(testState);
      expect(result).toEqual(true);
    });
  });

  describe('getActivityCodeBySlotId', () => {
    it('should return a valid activity code if available', () => {
      const testState: TestsModel = {
        currentTest: { slotId: null },
        startedTests: {
          1234: {
            version: '0.0.1',
            category: 'B',
            activityCode: ActivityCodes.ACCIDENT,
            journalData: null,
            rekey: false,
            changeMarker: false,
            examinerBooked: 1,
            examinerConducted: 1,
            examinerKeyed: 1,
          },
        },
        testStatus: {},
      };
      const result = getActivityCodeBySlotId(testState, 1234);
      expect(result).toEqual(ActivityCodes.ACCIDENT);
    });
    it('should return undefined if no activity code yet', () => {
      const testState: TestsModel = {
        currentTest: { slotId: null },
        startedTests: {
          1234: null,
        },
        testStatus: {},
      };
      const result = getActivityCodeBySlotId(testState, 1234);
      expect(result).toBeNull();
    });
  });

  describe('unsubmitted tests', () => {
    const initialState: TestsModel = {
      currentTest: { slotId: null },
      startedTests: {},
      testStatus: {},
    };
    const testState: TestsModel = {
      currentTest: { slotId: null },
      startedTests: {
        1001: {
          version: '0.0.1',
          category: 'B',
          activityCode: ActivityCodes.PASS,
          journalData: {
            testSlotAttributes: {
              welshTest: false,
              slotId: 1001,
              start: '2019-08-28T14:30:00',
              vehicleTypeCode: 'C',
              extendedTest: false,
              specialNeeds: false,
            },
            examiner: {
              staffNumber: '',
            },
            testCentre: {
              centreId: 1,
              costCode: '',
            },
            candidate: {},
            applicationReference: {
              applicationId: 999,
              bookingSequence: 3,
              checkDigit: 5,
            },
          },
          rekey: false,
          changeMarker: false,
          examinerBooked: 1,
          examinerConducted: 1,
          examinerKeyed: 1,
        },
        2008: {
          version: '0.0.1',
          category: 'B',
          activityCode: ActivityCodes.CANDIDATE_REFUSED_TO_SIGN_RESIDENCY_DECLARATION,
          journalData: {
            testSlotAttributes: {
              welshTest: false,
              slotId: 2008,
              start: '2019-08-23T15:14:00',
              vehicleTypeCode: 'C',
              extendedTest: false,
              specialNeeds: false,
            },
            examiner: {
              staffNumber: '',
            },
            testCentre: {
              centreId: 1,
              costCode: '',
            },
            candidate: {},
            applicationReference: {
              applicationId: 999,
              bookingSequence: 3,
              checkDigit: 5,
            },
          },
          rekey: false,
          changeMarker: false,
          examinerBooked: 1,
          examinerConducted: 1,
          examinerKeyed: 1,
        },
        2027: {
          version: '0.0.1',
          category: 'B',
          activityCode: ActivityCodes.ACCIDENT,
          journalData: {
            testSlotAttributes: {
              welshTest: false,
              slotId: 2027,
              start: '2019-08-30T09:14:00',
              vehicleTypeCode: 'C',
              extendedTest: false,
              specialNeeds: false,
            },
            examiner: {
              staffNumber: '',
            },
            testCentre: {
              centreId: 1,
              costCode: '',
            },
            candidate: {},
            applicationReference: {
              applicationId: 999,
              bookingSequence: 3,
              checkDigit: 5,
            },
          },
          rekey: false,
          changeMarker: false,
          examinerBooked: 1,
          examinerConducted: 1,
          examinerKeyed: 1,
        },
        3002: {
          version: '0.0.1',
          category: 'B',
          activityCode: ActivityCodes.PASS,
          journalData: {
            testSlotAttributes: {
              welshTest: false,
              slotId: 3002,
              start: '2019-08-30T10:14:00',
              vehicleTypeCode: 'C',
              extendedTest: false,
              specialNeeds: false,
            },
            examiner: {
              staffNumber: '',
            },
            testCentre: {
              centreId: 1,
              costCode: '',
            },
            candidate: {},
            applicationReference: {
              applicationId: 999,
              bookingSequence: 3,
              checkDigit: 5,
            },
          },
          rekey: false,
          changeMarker: false,
          examinerBooked: 1,
          examinerConducted: 1,
          examinerKeyed: 1,
        },
      },
      testStatus: {
        1001: TestStatus.Decided,
        2008: TestStatus.Decided,
        2027: TestStatus.Decided,
        3002: TestStatus.Submitted,
      },
    };
    describe('getIncompleteTests', () => {
      it('should return the unsubmitted tests', () => {
        const result = getIncompleteTests(testState);
        expect(result.length).toEqual(3);
      });
      it('should return no unsubmitted tests', () => {
        const result = getIncompleteTests(initialState);
        expect(result.length).toEqual(0);
      });
    });
    describe('getIncompleteTestsCount', () => {
      it('should return the correct number of unsubmitted tests', () => {
        const result = getIncompleteTestsCount(testState);
        expect(result).toEqual(3);
      });
      it('should return the correct number of unsubmitted tests', () => {
        const result = getIncompleteTestsCount(initialState);
        expect(result).toEqual(0);
      });
    });
    describe('getOldestIncompleteTest', () => {
      it('should return the oldest unsubmitted test', () => {
        const result = getOldestIncompleteTest(testState);
        expect(result.journalData.testSlotAttributes.slotId).toEqual(2008);
      });
      it('should return null for the oldest unsubmitted test', () => {
        const result = getOldestIncompleteTest(initialState);
        expect(result).toBeUndefined();
      });
    });
  });

  describe('isDelegatedTest', () => {
    const testsState: TestsModel = {
      currentTest: { slotId: '12345' },
      startedTests: {
        12345: {
          version: '0.0.1',
          category: 'B',
          activityCode: ActivityCodes.PASS,
          journalData: {
            testSlotAttributes: {
              welshTest: false,
              slotId: 3002,
              start: '2019-08-30T10:14:00',
              vehicleTypeCode: 'C',
              extendedTest: false,
              specialNeeds: false,
            },
            examiner: {
              staffNumber: '',
            },
            testCentre: {
              centreId: 1,
              costCode: '',
            },
            candidate: {},
            applicationReference: {
              applicationId: 999,
              bookingSequence: 3,
              checkDigit: 5,
            },
          },
          rekey: false,
          changeMarker: false,
          examinerBooked: 1,
          examinerConducted: 1,
          examinerKeyed: 1,
        },
      },
      testStatus: {},
    };

    it('should return false when no delegated tests possible for the category', () => {
      const localTestsState: TestsModel = {
        ...testsState,
        startedTests: {
          ...testsState.startedTests,
          12345: {
            ...testsState.startedTests['12345'],
            category: 'B',
          },
        },
      };
      const result = isDelegatedTest(localTestsState);
      expect(result).toBe(false);
    });

    it('should return false when test has valid category but delegatedTest flag is not set', () => {
      const localTestsState: TestsModel = {
        ...testsState,
        startedTests: {
          ...testsState.startedTests,
          12345: {
            ...testsState.startedTests['12345'],
            category: 'B+E',
            delegatedTest: undefined,
          },
        },
      };
      const result = isDelegatedTest(localTestsState);
      expect(result).toBe(false);
    });

    it('should return false when test has valid category but delegatedTest flag is set to false', () => {
      const localTestsState: TestsModel = {
        ...testsState,
        startedTests: {
          ...testsState.startedTests,
          12345: {
            ...testsState.startedTests['12345'],
            category: 'B+E',
            delegatedTest: false,
          },
        },
      };
      const result = isDelegatedTest(localTestsState);
      expect(result).toBe(false);
    });

    it('should return true when test has valid common category and delegatedTest flag is set to true', () => {
      const localTestsState: TestsModel = {
        ...testsState,
        startedTests: {
          ...testsState.startedTests,
          12345: {
            ...testsState.startedTests['12345'],
            category: 'B+E',
            delegatedTest: true,
          },
        },
      };
      const result = isDelegatedTest(localTestsState);
      expect(result).toBe(true);
    });

    it('should return true when test has valid CPC category and delegatedTest flag is set to true', () => {
      const localTestsState: TestsModel = {
        ...testsState,
        startedTests: {
          ...testsState.startedTests,
          12345: {
            ...testsState.startedTests['12345'],
            category: 'CCPC',
            delegatedTest: true,
          },
        },
      };
      const result = isDelegatedTest(localTestsState);
      expect(result).toBe(true);
    });
  });
  describe('hasStartedTests', () => {
    it('should return correct data', () => {
      const testsModel: TestsModel = {
        currentTest: null,
        startedTests: {
          entry1: null,
        },
        testStatus: null,
      };

      const data = hasStartedTests(testsModel);

      expect(data).toEqual(true);
    });
  });
});
