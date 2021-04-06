import { ActivityCode, JournalData, TestResultCommonSchema } from '@dvsa/mes-test-schema/categories/common';
import { TestResultSchemasUnion } from '@dvsa/mes-test-schema/categories';
import { CatBEUniqueTypes } from '@dvsa/mes-test-schema/categories/BE';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { TestResultCatCPCSchema } from '@dvsa/mes-test-schema/categories/CPC';
import { startsWith } from 'lodash';
import { TestStatus } from './test-status/test-status.model';
import { TestsModel } from './tests.model';
import { TestOutcome } from './tests.constants';
import {
  ActivityCodeModel,
  activityCodeModelList,
  activityCodeModelListDelegatedExaminer,
} from '../../app/shared/constants/activity-code/activity-code.constants';
import { DateTime } from '../../app/shared/helpers/date-time';
import { ActivityCodes } from '../../app/shared/models/activity-codes';
import { end2endPracticeSlotId, testReportPracticeSlotId } from '../../app/shared/mocks/test-slot-ids.mock';

export const getCurrentTestSlotId = (tests: TestsModel): string => tests.currentTest.slotId;

export const getCurrentTest = (tests: TestsModel): TestResultSchemasUnion => {
  const currentTestSlotId = tests.currentTest.slotId;
  return tests.startedTests[currentTestSlotId];
};

export const getCurrentTestStatus = (tests: TestsModel): TestStatus => {
  const currentTestSlotId = tests.currentTest.slotId;
  return tests.testStatus[currentTestSlotId];
};

export const getTestById = (tests: TestsModel, slotId: string): TestResultSchemasUnion => {
  return tests.startedTests[slotId];
};

export const getJournalData = (
  test: TestResultCommonSchema,
): JournalData | CatBEUniqueTypes.JournalData => test.journalData;

export const getTestStatus = (tests: TestsModel, slotId: number) => tests.testStatus[slotId] || TestStatus.Booked;

export const getTestOutcome = (test: TestResultCommonSchema) => test.activityCode;

export const getTestOutcomeText = (test: TestResultSchemasUnion) => {
  if (test.activityCode === ActivityCodes.PASS) {
    return TestOutcome.Passed;
  }

  if (
    test.activityCode === ActivityCodes.FAIL
    || test.activityCode === ActivityCodes.FAIL_CANDIDATE_STOPS_TEST
    || test.activityCode === ActivityCodes.FAIL_EYESIGHT
    || test.activityCode === ActivityCodes.FAIL_PUBLIC_SAFETY
  ) {
    return TestOutcome.Failed;
  }

  return TestOutcome.Terminated;
};

export const isTestOutcomeSet = (test: TestResultCommonSchema) => {
  if (test.activityCode) {
    return true;
  }
  return false;
};

export const isPassed = (test: TestResultSchemasUnion): boolean => {
  return test.activityCode === ActivityCodes.PASS;
};

export const getActivityCode = (test: TestResultCommonSchema): ActivityCodeModel => {
  if (test.delegatedTest) {
    return activityCodeModelListDelegatedExaminer.find((code) => code.activityCode === test.activityCode);
  }
  return activityCodeModelList.find((code) => code.activityCode === test.activityCode);
};

export const isTestReportPracticeTest = (
  tests: TestsModel,
): boolean => tests.currentTest.slotId === testReportPracticeSlotId;

export const isEndToEndPracticeTest = (
  tests: TestsModel,
): boolean => startsWith(tests.currentTest.slotId, end2endPracticeSlotId);

export const isPracticeMode = (
  tests: TestsModel,
): boolean => isTestReportPracticeTest(tests) || isEndToEndPracticeTest(tests);

export const isDelegatedTest = (tests: TestsModel): boolean => {
  const test = getCurrentTest(tests);

  if (test.category === TestCategory.BE
    || test.category === TestCategory.C
    || test.category === TestCategory.CE
    || test.category === TestCategory.C1
    || test.category === TestCategory.C1E
    || test.category === TestCategory.D
    || test.category === TestCategory.DE
    || test.category === TestCategory.D1
    || test.category === TestCategory.D1E) {
    return (test as TestResultCommonSchema).delegatedTest || false;
  }

  if (test.category === TestCategory.CCPC
    || test.category === TestCategory.DCPC) {
    return (test as TestResultCatCPCSchema).delegatedTest || false;
  }

  return false;
};

export const getAllTestStatuses = (test: TestsModel): { [slotId: string]: TestStatus; } => {
  return test.testStatus;
};

export const getActivityCodeBySlotId = (testsModel: TestsModel, id: number): ActivityCode => {
  if (testsModel && testsModel.startedTests && testsModel.startedTests[id]) {
    return testsModel.startedTests[id].activityCode;
  }
  return null;
};

const isTestBeforeToday = (test: TestResultSchemasUnion): boolean => {
  const testDate = new DateTime(test.journalData.testSlotAttributes.start);
  const today = new DateTime();
  return today.daysDiff(new Date(testDate.format('YYYY-MM-DD'))) < 0;
};

export const getIncompleteTestsSlotIds = (tests: TestsModel): string[] => {
  return Object.keys(tests.testStatus)
    .filter((slotId) =>
      isTestBeforeToday(tests.startedTests[slotId])
      && tests.testStatus[slotId] !== TestStatus.Submitted
      && tests.testStatus[slotId] !== TestStatus.Completed);
};

export const getIncompleteTests = (tests: TestsModel): TestResultSchemasUnion[] => {
  const incompleteTestsSlotIds: string[] = getIncompleteTestsSlotIds(tests);
  return incompleteTestsSlotIds.map((slotId: string) => tests.startedTests[slotId]);
};

export const getIncompleteTestsCount = (tests: TestsModel): number => {
  const incompleteTestsSlotIds: string[] = getIncompleteTestsSlotIds(tests);
  return incompleteTestsSlotIds.length;
};

export const getOldestIncompleteTest = (tests: TestsModel): TestResultSchemasUnion => {
  const incompleteTestsSlotIds: string[] = getIncompleteTestsSlotIds(tests);

  let oldestTest: TestResultSchemasUnion;

  incompleteTestsSlotIds.forEach((slotId: string) => {
    if (!oldestTest) {
      oldestTest = tests.startedTests[slotId];
      return;
    }

    const oldestStartDate: DateTime = new DateTime(oldestTest.journalData.testSlotAttributes.start);
    const currentStartDate: DateTime = new DateTime(tests.startedTests[slotId].journalData.testSlotAttributes.start);
    if (currentStartDate.isBefore(oldestStartDate)) {
      oldestTest = tests.startedTests[slotId];
    }
  });
  return oldestTest;
};

export const hasStartedTests = (tests: TestsModel): boolean => {
  return Object.keys(tests.startedTests).length > 0;
};
