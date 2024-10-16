import { TestResultSchemasUnion } from '@dvsa/mes-test-schema/categories';
import { TestResultCatCPCSchema } from '@dvsa/mes-test-schema/categories/CPC';
import { ActivityCode, JournalData, TestResultCommonSchema } from '@dvsa/mes-test-schema/categories/common';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import {
  ActivityCodeModel,
  activityCodeModelList,
  activityCodeModelListDelegatedExaminer,
  adi3activityCodeModelList,
} from '@shared/constants/activity-code/activity-code.constants';
import { DateTime } from '@shared/helpers/date-time';
import { isAnyOf } from '@shared/helpers/simplifiers';
import { end2endPracticeSlotId, testReportPracticeSlotId } from '@shared/mocks/test-slot-ids.mock';
import { ActivityCodes } from '@shared/models/activity-codes';
import { get, startsWith } from 'lodash-es';
import { TestStatus } from './test-status/test-status.model';
import { TestOutcome } from './tests.constants';
import { TestsModel } from './tests.model';

export type StartedTests = { [slotId: string]: TestResultSchemasUnion };

export const getCurrentTestSlotId = (tests: TestsModel): string => tests.currentTest.slotId;

export const getCurrentTest = (tests: TestsModel): TestResultSchemasUnion => {
  const currentTestSlotId = tests.currentTest.slotId;
  return tests.startedTests[currentTestSlotId];
};

export const getStartedTests = (tests: TestsModel): StartedTests => {
  return tests.startedTests;
};

export const isPassed = (test: TestResultSchemasUnion): boolean => {
  return test.activityCode === ActivityCodes.PASS;
};

export const getStartedTestsWithPassOutcome = (tests: TestsModel): StartedTests => {
  const { startedTests } = tests;

  return (
    Object.keys(startedTests)
      // loop through started test, extract all that are passes
      .filter((slotID) => isPassed(startedTests[slotID]))
      // reconstruct startedTestsx
      .reduce((obj: StartedTests, key) => {
        obj[key] = startedTests[key];
        return obj;
      }, {})
  );
};

export const getAllPassCerts = (startedTests: StartedTests): string[] => {
  return (
    Object.keys(startedTests)
      // extract pass cert
      .map((slotID: string) => get(startedTests[slotID], 'passCompletion.passCertificateNumber', null))
      // filter for any empty string/null values
      .filter((passCert: string) => !!passCert)
      // uppercase all to ensure consistent formatting
      .map((passCert: string) => passCert?.toUpperCase())
  );
};

export const getCurrentTestStatus = (tests: TestsModel): TestStatus => {
  const currentTestSlotId = tests.currentTest.slotId;
  return tests.testStatus[currentTestSlotId];
};

export const getTestById = (tests: TestsModel, slotId: string): TestResultSchemasUnion => {
  return tests.startedTests[slotId];
};

export const getJournalData = (test: TestResultCommonSchema): JournalData => test.journalData;

export const getTestStatus = (tests: TestsModel, slotId: number) => tests.testStatus[slotId] || TestStatus.Booked;

export const getTestOutcome = (test: TestResultCommonSchema) => test.activityCode;

export const getTestOutcomeText = (test: TestResultSchemasUnion) => {
  if (test.activityCode === ActivityCodes.PASS) {
    return TestOutcome.Passed;
  }

  if (
    test.activityCode === ActivityCodes.FAIL ||
    test.activityCode === ActivityCodes.FAIL_CANDIDATE_STOPS_TEST ||
    test.activityCode === ActivityCodes.FAIL_EYESIGHT ||
    test.activityCode === ActivityCodes.FAIL_PUBLIC_SAFETY
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

export const getActivityCode = (test: TestResultCommonSchema): ActivityCodeModel => {
  if (test.delegatedTest) {
    return activityCodeModelListDelegatedExaminer.find((code) => code.activityCode === test.activityCode);
  }
  if (isAnyOf(test.category, [TestCategory.ADI3, TestCategory.SC])) {
    return adi3activityCodeModelList.find((code) => code.activityCode === test.activityCode);
  }
  return activityCodeModelList.find((code) => code.activityCode === test.activityCode);
};

export const isTestReportPracticeTest = (tests: TestsModel): boolean =>
  tests.currentTest.slotId === testReportPracticeSlotId;

export const isEndToEndPracticeTest = (tests: TestsModel): boolean =>
  startsWith(tests.currentTest.slotId, end2endPracticeSlotId);

export const isPracticeMode = (tests: TestsModel): boolean =>
  isTestReportPracticeTest(tests) || isEndToEndPracticeTest(tests);

export const isDelegatedTest = (tests: TestsModel): boolean => {
  const test = getCurrentTest(tests);
  if (!test) return false;

  if (
    test.category === TestCategory.BE ||
    test.category === TestCategory.C ||
    test.category === TestCategory.CE ||
    test.category === TestCategory.C1 ||
    test.category === TestCategory.C1E ||
    test.category === TestCategory.D ||
    test.category === TestCategory.DE ||
    test.category === TestCategory.D1 ||
    test.category === TestCategory.D1E
  ) {
    return (test as TestResultCommonSchema).delegatedTest || false;
  }

  if (test.category === TestCategory.CCPC || test.category === TestCategory.DCPC) {
    return (test as TestResultCatCPCSchema).delegatedTest || false;
  }

  return false;
};

export const getActivityCodeBySlotId = (testsModel: TestsModel, id: number): ActivityCode => {
  if (testsModel?.startedTests?.[id]) {
    return testsModel.startedTests[id].activityCode;
  }
  return null;
};

export const getPassCertificateBySlotId = (testsModel: TestsModel, id: number): string => {
  if (testsModel?.startedTests?.[id]) {
    return get(testsModel.startedTests[id], 'passCompletion.passCertificateNumber', null);
  }
  return null;
};

const calculateDaysDiff = (test: TestResultSchemasUnion): number => {
  const testDate = new DateTime(test.journalData.testSlotAttributes.start);
  const today = new DateTime();
  return today.daysDiff(new Date(testDate.format('YYYY-MM-DD')));
};

export const isTestBeforeToday = (test: TestResultSchemasUnion): boolean => {
  return calculateDaysDiff(test) < 0;
};

export const getIncompleteTestsSlotIds = (tests: TestsModel): string[] => {
  return Object.keys(tests.testStatus).filter(
    (slotId) =>
      isTestBeforeToday(tests.startedTests[slotId]) &&
      tests.testStatus[slotId] !== TestStatus.Submitted &&
      tests.testStatus[slotId] !== TestStatus.Completed
  );
};

export const hasStartedTests = (tests: TestsModel): boolean => {
  return Object.keys(tests.startedTests).length > 0;
};
