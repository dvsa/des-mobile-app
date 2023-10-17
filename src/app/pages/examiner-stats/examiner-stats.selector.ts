import { forOwn, get, transform, uniqBy } from 'lodash';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { Manoeuvre } from '@dvsa/mes-test-schema/categories/common';
import { ManoeuvreTypes } from '@store/tests/test-data/test-data.constants';
import { AlternativeManoeuvreTypeLabels, BaseManoeuvreTypeLabels } from '@pages/examiner-stats/examiner-stats.page';
import { StartedTests } from '@store/tests/tests.selector';
import { ActivityCodes } from '@shared/models/activity-codes';

export type ExaminerStatData = { item: string, count: number };
export const getRouteNumbers = (startedTests: StartedTests): ExaminerStatData[] => {
  const data = Object.keys(startedTests)
    // extract route number
    .map((slotID: string) => (get(startedTests[slotID], 'testSummary.routeNumber', null)))
    // filter for any nulls
    .filter((route) => route !== null);
  return uniqBy(data.map((item) => ({
    item,
    count: data.filter((r1) => r1 === item).length,
  })), 'item');
};

export const getPassedTestCount = (startedTests: StartedTests): number => {
  return Object.keys(startedTests)
    .filter((slotID: string) => startedTests[slotID]?.activityCode === ActivityCodes.PASS)
    .length;
};

export const getControlledStopCount = (startedTests: StartedTests): number => {
  return Object.keys(startedTests)
    .map((slotID: string) => get(startedTests[slotID], 'testData.controlledStop', null))
    .filter((controlledStop) => !!controlledStop?.selected)
    .length;
};

export const getStartedTestCount = (startedTests: StartedTests): number => {
  return Object.keys(startedTests).length;
};

export const getShowMeQuestions = (startedTests: StartedTests): ExaminerStatData[] => {
  const data = Object.keys(startedTests)
  // extract pass cert
    .map((slotID: string) => get(startedTests[slotID], 'testData.vehicleChecks.showMeQuestion', null)).flat()
  // filter for any empty string/null values
    .filter((question: { code: string, description: string }) => !!question?.code);
  return uniqBy(data.map((item) => ({
    item: `${item.code} - ${item.description}`,
    count: data.filter((r1) => r1 === item).length,
  })), 'item');
};

export const getTellMeQuestions = (startedTests: StartedTests): ExaminerStatData[] => {
  const data = Object.keys(startedTests)
  // extract pass cert
    .map((slotID: string) => get(startedTests[slotID], 'testData.vehicleChecks.tellMeQuestion', null)).flat()
  // filter for any empty string/null values
    .filter((question: { code: string, description: string }) => !!question?.code);

  return uniqBy(data.map((item) => ({
    item: `${item.code} - ${item.description}`,
    count: data.filter((r1) => r1 === item).length,
  })), 'item');
};

export const getManoeuvreTypeLabels = (category: TestCategory, type: ManoeuvreTypes) => {
  if ([TestCategory.BE, TestCategory.CM, TestCategory.C1M, TestCategory.CEM, TestCategory.C1EM,
    TestCategory.DM, TestCategory.D1M, TestCategory.DEM, TestCategory.D1EM,
  ].includes(category)) {
    return AlternativeManoeuvreTypeLabels[type];
  } else {
    return BaseManoeuvreTypeLabels[type];
  }
};

export const getManoeuvresUsed = (startedTests: StartedTests): ExaminerStatData[] => {
  const faultsEncountered: string[] = [];

  Object.keys(startedTests)
    .forEach((slotID) => {
      const manoeuvres = get(startedTests[slotID], 'testData.manoeuvres');
      if (!manoeuvres) return;
      const testCategory = get(startedTests[slotID], 'category') as TestCategory;
      const mans = testCategory === TestCategory.ADI2 ? manoeuvres : [manoeuvres];
      mans.forEach((manoeuvre) => {
        forOwn(manoeuvre, (man: Manoeuvre, type: ManoeuvreTypes) => {
          const faults = !man.selected ? [] : transform(man, (result) => {
            result.push(getManoeuvreTypeLabels(testCategory, type));
          }, []);
          faultsEncountered.push(...faults);
        });
      });
    });
  return uniqBy(
    faultsEncountered
      .filter((fault) => !!fault)
      .map((item) => ({
        item,
        count: faultsEncountered.filter((f) => f === item).length,
      })), 'item',
  );
};
