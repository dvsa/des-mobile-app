import { forOwn, get, isEqual, transform, uniqBy } from 'lodash';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import {
  Manoeuvre,
  SafetyQuestionResult,
  TestCentre,
  TestResultCommonSchema,
} from '@dvsa/mes-test-schema/categories/common';
import { ManoeuvreTypes } from '@store/tests/test-data/test-data.constants';
import { AlternativeManoeuvreTypeLabels, BaseManoeuvreTypeLabels } from '@pages/examiner-stats/examiner-stats.page';
import { StartedTests } from '@store/tests/tests.selector';
import { ActivityCodes } from '@shared/models/activity-codes';
import { DateRange, DateTime } from '@shared/helpers/date-time';
import { TestResultSchemasUnion } from '@dvsa/mes-test-schema/categories';
import { QuestionResult } from '@dvsa/mes-test-schema/categories/C/partial';
import { getTestOutcome } from '@pages/debrief/debrief.selector';

export type ExaminerStatData = {
  item: string,
  count: number,
  percentage: string
};

// add date range filter
const dateFilter = (test: TestResultSchemasUnion, range: DateRange = null): boolean => (range)
// use range when provided
  ? new DateTime(get(test, 'journalData.testSlotAttributes.start')).isDuring(range)
// return true to get all tests when no range provided
  : true;

export const getEligibleTests = (startedTests: StartedTests, range: DateRange = null) => {
  return Object.keys(startedTests)
    .filter((slotID: string) => !slotID.includes('practice'))
    .filter((slotID: string) => dateFilter(startedTests[slotID], range));
};

export const getPassedTestCount = (
  startedTests: StartedTests,
  range: DateRange = null,
  location: number = null,
  category: string = null,
): number =>
  getEligibleTests(startedTests, range)
    .filter((slotID) =>
      location ? get(startedTests[slotID], 'journalData.testCentre.centreId') === location : true)
    .filter((slotID) =>
      category ? get(startedTests[slotID], 'category') === category : true)
    .filter((slotID: string) => startedTests[slotID]?.activityCode === ActivityCodes.PASS)
    .length;

export const getOutcome = (
  startedTests: StartedTests,
  range: DateRange = null,
  location: number = null,
  category: string = null,
): ExaminerStatData[] => {
  const data = getEligibleTests(startedTests, range)
  // filter for any nulls
    .filter((slotID) => startedTests[slotID].activityCode !== null)
    .filter((slotID) =>
      location ? get(startedTests[slotID], 'journalData.testCentre.centreId') === location : true)
    .filter((slotID) =>
      category ? get(startedTests[slotID], 'category') === category : true)
  // extract route number
    .map((slotID: string) => getTestOutcome(startedTests[slotID] as TestResultCommonSchema));

  return uniqBy(data.map((item) => {
    const count = data.filter((val) => val === item).length;
    return {
      item,
      count,
      percentage: `${((count) / data.length * 100).toFixed(1)}%`,
    };
  }), 'item');
};

export const getControlledStopCount = (
  startedTests: StartedTests,
  range: DateRange = null,
  location: number = null,
  category: string = null,
): number =>
  getEligibleTests(startedTests, range)
    .filter((slotID) =>
      location ? get(startedTests[slotID], 'journalData.testCentre.centreId') === location : true)
    .filter((slotID) =>
      category ? get(startedTests[slotID], 'category') === category : true)
    .map((slotID: string) => get(startedTests[slotID], 'testData.controlledStop', null))
    .filter((controlledStop) => !!controlledStop?.selected)
    .length;

export const getLocations = (
  startedTests: StartedTests,
  range: DateRange = null,
): {
  item: TestCentre;
  count: number
}[] => {
  const data = (getEligibleTests(startedTests, range)
  // extract cost codes
    .map((slotID: string) => get(startedTests[slotID], 'journalData.testCentre', null))
  // filter for any nulls
    .filter((testCentre) => !!testCentre.centreId));

  return uniqBy(data.map((item: TestCentre) => {
    return {
      item,
      count: data.filter((val) => isEqual(val, item)).length,
    };
  }), 'item.centreId');
};

export const getIndependentDrivingStats = (
  startedTests: StartedTests,
  range: DateRange = null,
  location: number,
  category: string,
):ExaminerStatData[] => {
  const data = (getEligibleTests(startedTests, range)
    .filter((slotID) =>
      location ? get(startedTests[slotID], 'journalData.testCentre.centreId') === location : true)
    .filter((slotID) =>
      category ? get(startedTests[slotID], 'category') === category : true)
  // extract cost codes
    .map((slotID: string) => get(startedTests[slotID], 'testSummary.independentDriving', null))
  // filter for any nulls
    .filter((driving) => !!driving));

  return uniqBy(data.map((item: string) => {
    const count = data.filter((val) => val === item).length;
    return {
      item,
      count: data.filter((val) => isEqual(val, item)).length,
      percentage: `${((count) / data.length * 100).toFixed(1)}%`,
    };
  }), 'item');
};
export const getCategories = (
  startedTests: StartedTests,
  range: DateRange = null,
): {
  item: TestCategory;
  count: number
}[] => {
  const data = (getEligibleTests(startedTests, range)
  // extract cost codes
    .map((slotID: string) => get(startedTests[slotID], 'category', null))
  // filter for any nulls
    .filter((category) => !!category));

  return uniqBy(data.map((item: TestCategory) => {
    return {
      item,
      count: data.filter((val) => isEqual(val, item)).length,
    };
  }), 'item');
};

export const getStartedTestCount = (
  startedTests: StartedTests,
  range: DateRange = null,
  location: number = null,
  category: string = null,
): number =>
  getEligibleTests(startedTests, range)
    .filter((slotID) =>
      location ? get(startedTests[slotID], 'journalData.testCentre.centreId') === location : true)
    .filter((slotID) =>
      category ? get(startedTests[slotID], 'category') === category : true).length;

export const getRouteNumbers = (
  startedTests: StartedTests,
  range: DateRange = null,
  location: number = null,
  category: string = null,
): ExaminerStatData[] => {
  const data = getEligibleTests(startedTests, range)
    .filter((slotID) =>
      location ? get(startedTests[slotID], 'journalData.testCentre.centreId') === location : true)
    .filter((slotID) =>
      category ? get(startedTests[slotID], 'category') === category : true)
  // extract route number
    .map((slotID: string) => (
      {
        routeNum: get(startedTests[slotID], 'testSummary.routeNumber', null),
        testCentre: get(startedTests[slotID], 'journalData.testCentre.costCode', null),
      }))// filter for any nulls
    .filter((route) => route.routeNum !== null);

  return uniqBy(data.map((item) => {
    const count = data.filter((val) => isEqual(val, item)).length;
    return {
      item: item.routeNum,
      count,
      percentage: `${((count) / data.length * 100).toFixed(1)}%`,
    };
  }), 'item');
};

export const getSafetyAndBalanceQuestions = (
  startedTests: StartedTests,
  range: DateRange = null,
  location: number = null,
  category: string = null,
): ExaminerStatData[] => {
  const data = getEligibleTests(startedTests, range)
    .filter((slotID) =>
      location ? get(startedTests[slotID], 'journalData.testCentre.centreId') === location : true)
    .filter((slotID) =>
      category ? get(startedTests[slotID], 'category') === category : true)
    .map((slotID: string) => [
      ...get(startedTests[slotID], 'testData.safetyQuestions.questions', []) as SafetyQuestionResult[],
      ...get(startedTests[slotID], 'testData.safetyAndBalanceQuestions.safetyQuestions', []) as QuestionResult[],
      ...get(startedTests[slotID], 'testData.safetyAndBalanceQuestions.balanceQuestions', []) as QuestionResult[],
    ])
    .flat()
  // filter for any empty string/null values
    .filter((question: SafetyQuestionResult | QuestionResult) =>
      ('code' in question) ? !!question?.code : !!question?.description);
  return uniqBy(data.map((item: SafetyQuestionResult | QuestionResult) => {
    const count = data.filter((val) => val === item).length;
    return {
      item: ('code' in item) ? `${item.code} - ${item.description}` : item.description,
      count,
      percentage: `${((count) / data.length * 100).toFixed(1)}%`,
    };
  }), 'item');
};
export const getShowMeQuestions = (
  startedTests: StartedTests,
  range: DateRange = null,
  location: number = null,
  category: string = null,
): ExaminerStatData[] => {
  const data = getEligibleTests(startedTests, range)
    .filter((slotID) =>
      location ? get(startedTests[slotID], 'journalData.testCentre.centreId') === location : true)
    .filter((slotID) =>
      category ? get(startedTests[slotID], 'category') === category : true)
    .map((slotID: string) => [
      ...[get(startedTests[slotID], 'testData.vehicleChecks.showMeQuestion', null)] as [QuestionResult],
      ...get(startedTests[slotID], 'testData.vehicleChecks.showMeQuestions', []) as QuestionResult[],
    ])
    .flat()
  // filter for any empty string/null values
    .filter((question: QuestionResult) => !!question?.code);

  return uniqBy(data.map((item) => {
    const count = data.filter((val) => isEqual(val, item)).length;
    return {
      item: `${item.code} - ${item.description}`,
      count,
      percentage: `${((count) / data.length * 100).toFixed(1)}%`,
    };
  }), 'item');
};

export const getTellMeQuestions = (
  startedTests: StartedTests,
  range: DateRange = null,
  location: number = null,
  category: string = null,
): ExaminerStatData[] => {
  const data = getEligibleTests(startedTests, range)
    .filter((slotID) =>
      location ? get(startedTests[slotID], 'journalData.testCentre.centreId') === location : true)
    .filter((slotID) =>
      category ? get(startedTests[slotID], 'category') === category : true)
    .map((slotID: string) => [
      ...[get(startedTests[slotID], 'testData.vehicleChecks.tellMeQuestion', null)] as [QuestionResult],
      ...get(startedTests[slotID], 'testData.vehicleChecks.tellMeQuestions', []) as QuestionResult[],
    ])
    .flat()
  // filter for any empty string/null values
    .filter((question: QuestionResult) => !!question?.code);
  return uniqBy(data.map((item) => {
    const count = data.filter((val) => isEqual(val, item)).length;
    return {
      item: `${item.code} - ${item.description}`,
      count,
      percentage: `${((count) / data.length * 100).toFixed(1)}%`,
    };
  }), 'item');
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

export const getManoeuvresUsed = (
  startedTests: StartedTests,
  range: DateRange = null,
  location: number = null,
  category: string = null,
): ExaminerStatData[] => {
  const faultsEncountered: string[] = [];

  getEligibleTests(startedTests, range)
    .filter((slotID) =>
      location ? get(startedTests[slotID], 'journalData.testCentre.centreId') === location : true)
    .filter((slotID) =>
      category ? get(startedTests[slotID], 'category') === category : true)
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
      .map((item) => {
        const count = faultsEncountered.filter((f) => f === item).length;
        return {
          item,
          count,
          percentage: `${(count / faultsEncountered.length * 100).toFixed(1)}%`,
        };
      }), 'item',
  );
};
