import { forOwn, get, isEqual, transform, uniqBy } from 'lodash';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import {
  Manoeuvre,
  SafetyQuestionResult,
  TestCentre,
  TestResultCommonSchema,
} from '@dvsa/mes-test-schema/categories/common';
import { ManoeuvreTypes } from '@store/tests/test-data/test-data.constants';
import { StartedTests } from '@store/tests/tests.selector';
import { ActivityCodes } from '@shared/models/activity-codes';
import { DateRange, DateTime } from '@shared/helpers/date-time';
import { TestResultSchemasUnion } from '@dvsa/mes-test-schema/categories';
import { QuestionResult } from '@dvsa/mes-test-schema/categories/C/partial';
import { getTestOutcome } from '@pages/debrief/debrief.selector';
import { QuestionProvider } from '@providers/question/question';
import { manoeuvreTypeLabelsCatD } from '@shared/constants/competencies/catd-manoeuvres';
import { manoeuvreTypeLabels as manoeuvreTypeLabelsCatB } from '@shared/constants/competencies/catb-manoeuvres';
import { manoeuvreTypeLabels as manoeuvreTypeLabelsCatBE } from '@shared/constants/competencies/catbe-manoeuvres';
import { manoeuvreTypeLabels as manoeuvreTypeLabelsCatADI2 } from '@shared/constants/competencies/catadi2-manoeuvres';
import { isAnyOf } from '@shared/helpers/simplifiers';

// Generic `T` is the configurable type of the item
export interface ExaminerStatData<T> {
  item: T;
  count: number;
  percentage: string;
}

// add date range filter
const dateFilter = (test: TestResultSchemasUnion, range: DateRange = null): boolean => (range)
  // use range when provided
  ? new DateTime(get(test, 'journalData.testSlotAttributes.start')).isDuring(range)
  // return true to get all tests when no range provided
  : true;

const getIndex = (item: string) => {
  const regex = /[A-Za-z]*(\d+)/;
  const match = item.match(regex);
  return match && match[1] ? Number(match[1]) : null;
};

export const getEligibleTests = (startedTests: StartedTests, range: DateRange = null) => {
  return Object.keys(startedTests)
    .filter((slotID: string) => !slotID.includes('practice'))
    .filter((slotID: string) => dateFilter(startedTests[slotID], range));
};

export const getPassedTestCount = (
  startedTests: StartedTests,
  range: DateRange = null,
  location: number = null,
  category: TestCategory = null,
): number =>
  getEligibleTests(startedTests, range)
    .filter((slotID) =>
      get(startedTests[slotID], 'journalData.testCentre.centreId') === location)
    .filter((slotID) =>
      get(startedTests[slotID], 'category') === category)
    .filter((slotID: string) => startedTests[slotID]?.activityCode === ActivityCodes.PASS)
    .length;

export const getOutcome = (
  startedTests: StartedTests,
  range: DateRange = null,
  location: number = null,
  category: TestCategory = null,
): ExaminerStatData<string>[] => {
  const data = getEligibleTests(startedTests, range)
    // filter for any nulls
    .filter((slotID) => startedTests[slotID].activityCode !== null)
    .filter((slotID) =>
      get(startedTests[slotID], 'journalData.testCentre.centreId') === location)
    .filter((slotID) =>
      get(startedTests[slotID], 'category') === category)
    // extract route number
    .map((slotID: string) => getTestOutcome(startedTests[slotID] as TestResultCommonSchema));

  return uniqBy(data.map((item) => {
    const count = data.filter((val) => val === item).length;
    return {
      item,
      count,
      percentage: `${((count) / data.length * 100).toFixed(1)}%`,
    };
  }), 'item')
    .sort((item1, item2) =>
      (item1.item as string) > (item2.item as string) ? 1 : - 1);
};

export const getControlledStopCount = (
  startedTests: StartedTests,
  range: DateRange = null,
  location: number = null,
  category: TestCategory = null,
): number =>
  getEligibleTests(startedTests, range)
    .filter((slotID) =>
      get(startedTests[slotID], 'journalData.testCentre.centreId') === location)
    .filter((slotID) =>
      get(startedTests[slotID], 'category') === category)
    .map((slotID: string) => get(startedTests[slotID], 'testData.controlledStop', null))
    .filter((controlledStop) => !!controlledStop?.selected)
    .length;

export const getLocations = (
  startedTests: StartedTests,
  range: DateRange = null,
  // Omit is a TS type, to remove a property from an interface
): Omit<ExaminerStatData<TestCentre>, 'percentage'>[] => {
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
  }), 'item.centreId')
    .sort((item1, item2) =>
      (item1.item.centreName) > (item2.item.centreName) ? 1 : - 1);
};

export const getIndependentDrivingStats = (
  startedTests: StartedTests,
  range: DateRange = null,
  location: number,
  category: TestCategory,
): ExaminerStatData<string>[] => {
  //IndependentDriving is not applicable to the following categories, and so we can avoid the entire function
  if (isAnyOf(category, [
    TestCategory.ADI3,
    TestCategory.F, TestCategory.G, TestCategory.H, TestCategory.K,
    TestCategory.CCPC, TestCategory.DCPC,
    TestCategory.EUA1M1, TestCategory.EUA2M1, TestCategory.EUAM1, TestCategory.EUAMM1,
    TestCategory.CM, TestCategory.C1M, TestCategory.CEM, TestCategory.C1EM,
    TestCategory.DM, TestCategory.D1M, TestCategory.DEM, TestCategory.D1EM,
  ])) {
    return [];
  }
  const indDrivingOptions = ['Traffic signs', 'Sat nav', 'N/A'];

  const data: string[] = getEligibleTests(startedTests, range)
    .filter((slotID) => get(startedTests[slotID], 'journalData.testCentre.centreId') === location)
    .filter((slotID) => get(startedTests[slotID], 'category') === category)
    // extract cost codes
    .map((slotID: string) => get(startedTests[slotID], 'testSummary.independentDriving', null))
    // filter for any nulls
    .filter((driving) => !!driving);

  return indDrivingOptions.map((item: string, index) => {
    const count = data.filter((val) => val === item).length;
    return {
      item: `I${index + 1} - ${item}`,
      count,
      percentage: `${(count / data.length * 100).toFixed(1)}%`,
    };
  })
    .sort((item1, item2) =>
      getIndex(item1.item as string) - getIndex(item2.item as string));
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
  }), 'item')
    .sort((item1, item2) =>
      (item1.item as string) > (item2.item as string) ? 1 : - 1);
};

export const getStartedTestCount = (
  startedTests: StartedTests,
  range: DateRange = null,
  location: number = null,
  category: string = null,
): number =>
  getEligibleTests(startedTests, range)
    .filter((slotID) =>
      get(startedTests[slotID], 'journalData.testCentre.centreId') === location)
    .filter((slotID) =>
      get(startedTests[slotID], 'category') === category).length;

export const getRouteNumbers = (
  startedTests: StartedTests,
  range: DateRange = null,
  location: number = null,
  category: TestCategory = null,
): ExaminerStatData<string>[] => {
  const data = getEligibleTests(startedTests, range)
    .filter((slotID) =>
      get(startedTests[slotID], 'journalData.testCentre.centreId') === location)
    .filter((slotID) =>
      get(startedTests[slotID], 'category') === category)
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
      item: `Route ${item.routeNum}`,
      count,
      percentage: `${((count) / data.length * 100).toFixed(1)}%`,
    };
  }), 'item')
    .sort((item1, item2) =>
      getIndex(item1.item as string) - getIndex(item2.item as string));
};

export const getSafetyAndBalanceQuestions = (
  startedTests: StartedTests,
  range: DateRange = null,
  location: number = null,
  category: TestCategory = null,
): ExaminerStatData<string>[] => {
  const qp = new QuestionProvider();

  const questions = [
    ...qp.getSafetyQuestions(category)
      .map((q) => ({
        code: q.code,
        description: q.shortName,
      })),
    ...qp.getBalanceQuestions(category)
      .map((q) => ({
        code: q.code,
        description: q.shortName,
      })),
    ...qp.getVocationalSafetyQuestions(category),
  ];

  const data = getEligibleTests(startedTests, range)
    .filter((slotID) =>
      get(startedTests[slotID], 'journalData.testCentre.centreId') === location)
    .filter((slotID) =>
      get(startedTests[slotID], 'category') === category)
    .map((slotID: string) => [
      ...get(startedTests[slotID], 'testData.safetyQuestions.questions', []) as SafetyQuestionResult[],
      ...get(startedTests[slotID], 'testData.safetyAndBalanceQuestions.safetyQuestions', []) as QuestionResult[],
      ...get(startedTests[slotID], 'testData.safetyAndBalanceQuestions.balanceQuestions', []) as QuestionResult[],
    ])
    .flat()
    // filter for any empty string/null values
    .filter((question: SafetyQuestionResult | QuestionResult) =>
      ('code' in question) ? !!question?.code : !!question?.description);

  return questions.map((q, index) => {
    const count = data.filter((val) => val.description === q.description).length;

    return {
      item: ('code' in q) ? `${q.code} - ${q.description}` : `B${index + 1} - ${q.description}`,
      count,
      percentage: `${((count / data.length) * 100).toFixed(1)}%`,
    };
  })
    .sort((item1, item2) =>
      getIndex(item1.item as string) - getIndex(item2.item as string));
};

export const getShowMeQuestions = (
  startedTests: StartedTests,
  range: DateRange = null,
  location: number = null,
  category: TestCategory = null,
): ExaminerStatData<string>[] => {
  const qp = new QuestionProvider();

  const questions = qp.getShowMeQuestions(category);

  const data = getEligibleTests(startedTests, range)
    .filter((slotID) =>
      get(startedTests[slotID], 'journalData.testCentre.centreId') === location)
    .filter((slotID) =>
      get(startedTests[slotID], 'category') === category)
    .map((slotID: string) => [
      ...[get(startedTests[slotID], 'testData.vehicleChecks.showMeQuestion', null)] as [QuestionResult],
      ...get(startedTests[slotID], 'testData.vehicleChecks.showMeQuestions', []) as QuestionResult[],
    ])
    .flat()
    // filter for any empty string/null values
    .filter((question: QuestionResult) => !!question?.code);

  return questions.map((q) => {
    const count = data.filter((val) => val.code === q.code).length;
    return {
      item: `${q.code} - ${q.shortName}`,
      count,
      percentage: `${((count / data.length) * 100).toFixed(1)}%`,
    };
  })
    .sort((item1, item2) =>
      getIndex(item1.item as string) - getIndex(item2.item as string));
};

export const getTellMeQuestions = (
  startedTests: StartedTests,
  range: DateRange = null,
  location: number = null,
  category: TestCategory = null,
): ExaminerStatData<string>[] => {
  const qp = new QuestionProvider();
  const questions = qp.getTellMeQuestions(category);
  const data = getEligibleTests(startedTests, range)
    .filter((slotID) =>
      get(startedTests[slotID], 'journalData.testCentre.centreId') === location)
    .filter((slotID) =>
      get(startedTests[slotID], 'category') === category)
    .map((slotID: string) => [
      ...[get(startedTests[slotID], 'testData.vehicleChecks.tellMeQuestion', null)] as [QuestionResult],
      ...get(startedTests[slotID], 'testData.vehicleChecks.tellMeQuestions', []) as QuestionResult[],
    ])
    .flat()
    // filter for any empty string/null values
    .filter((question: QuestionResult) => !!question?.code);

  return questions.map((q) => {
    const count = data.filter((val) => val.code === q.code).length;
    return {
      item: `${q.code} - ${q.shortName}`,
      count,
      percentage: `${((count / data.length) * 100).toFixed(1)}%`,
    };
  })
    .sort((item1, item2) =>
      getIndex(item1.item as string) - getIndex(item2.item as string));
};

export const getManoeuvreTypeLabels = (category: TestCategory, type?: ManoeuvreTypes) => {
  if ([TestCategory.CM, TestCategory.C1M, TestCategory.CEM, TestCategory.C1EM,
    TestCategory.DM, TestCategory.D1M, TestCategory.DEM, TestCategory.D1EM,
  ].includes(category)) {
    enum left {
      reverseManoeuvre = 'Reverse',
    }

    return type ? left[type] : left;
  } else if ([TestCategory.C, TestCategory.C1, TestCategory.CE, TestCategory.C1E].includes(category)) {
    enum man {
      reverseLeft = 'Reverse',
    }

    return type ? man[type] : man;
  } else if ([TestCategory.D, TestCategory.D1, TestCategory.DE, TestCategory.D1E].includes(category)) {
    return type ? manoeuvreTypeLabelsCatD[type] : manoeuvreTypeLabelsCatD;
  } else if ([TestCategory.B, TestCategory.B1].includes(category)) {
    return type ? manoeuvreTypeLabelsCatB[type] : manoeuvreTypeLabelsCatB;
  } else if ([TestCategory.BE].includes(category)) {
    return type ? manoeuvreTypeLabelsCatBE[type] : manoeuvreTypeLabelsCatBE;
  } else if ([TestCategory.ADI2].includes(category)) {
    return type ? manoeuvreTypeLabelsCatADI2[type] : manoeuvreTypeLabelsCatADI2;
  } else {
    return null;
  }
};

export const getManoeuvresUsed = (
  startedTests: StartedTests,
  range: DateRange = null,
  location: number = null,
  category: TestCategory = null,
): ExaminerStatData<string>[] => {
  let faultsEncountered: string[] = [];

  const manoeuvreTypeLabels: string[] = Object.values(getManoeuvreTypeLabels(category));

  getEligibleTests(startedTests, range)
    .filter((slotID) => get(startedTests[slotID], 'journalData.testCentre.centreId') === location)
    .filter((slotID) => get(startedTests[slotID], 'category') === category)
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
      faultsEncountered = faultsEncountered.filter((fault) => !!fault);
    });

  return manoeuvreTypeLabels.map((q, index) => {
    const count = faultsEncountered.filter((val) => val === q).length;
    return {
      item: `M${index + 1} - ${q}`,
      count,
      percentage: `${((count / faultsEncountered.length) * 100).toFixed(1)}%`,
    };
  })
    .sort((item1, item2) =>
      getIndex(item1.item as string) - getIndex(item2.item as string));
};
