import { ExaminerRecordModel } from '@dvsa/mes-microservice-common/domain/examiner-records';
import { QuestionResult } from '@dvsa/mes-test-schema/categories/C/partial';
import { Manoeuvre, SafetyQuestionResult, TestCentre } from '@dvsa/mes-test-schema/categories/common';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { QuestionProvider } from '@providers/question/question';
import { manoeuvreTypeLabels as manoeuvreTypeLabelsCatADI2 } from '@shared/constants/competencies/catadi2-manoeuvres';
import { manoeuvreTypeLabels as manoeuvreTypeLabelsCatB } from '@shared/constants/competencies/catb-manoeuvres';
import { manoeuvreTypeLabels as manoeuvreTypeLabelsCatBE } from '@shared/constants/competencies/catbe-manoeuvres';
import { DateRange, DateTime } from '@shared/helpers/date-time';
import { isAnyOf } from '@shared/helpers/simplifiers';
import { ManoeuvreTypes } from '@store/tests/test-data/test-data.constants';
import { forOwn, get, uniqBy } from 'lodash-es';

// Generic `T` is the configurable type of the item
export interface ExaminerRecordData<T> {
  item: T;
  count: number;
}

// Generic `T` is the configurable type of the item
export interface ExaminerRecordDataWithPercentage<T> extends ExaminerRecordData<T> {
  percentage: string;
}

const unwantedCategories: TestCategory[] = [
  TestCategory.ADI3,
  TestCategory.SC,
  TestCategory.CCPC,
  TestCategory.DCPC,
  TestCategory.CM,
  TestCategory.DM,
  TestCategory.D1M,
  TestCategory.D1EM,
  TestCategory.DEM,
  TestCategory.CM,
  TestCategory.C1M,
  TestCategory.C1EM,
  TestCategory.CEM,
  TestCategory.F,
  TestCategory.G,
  TestCategory.H,
  TestCategory.K,
];

// add date range filter
export const dateFilter = (test: ExaminerRecordModel, range: DateRange = null): boolean =>
  range
    ? // use range when provided
      new DateTime(get(test, 'startDate')).isDuringDateRange(range)
    : // return true to get all tests when no range provided
      true;

/**
 * strip out the prefix letter to get the numerical value in the code of the string
 */
export const getIndex = (item: string) => {
  const regex = /[A-Za-z]*(\d+)/;
  const match = item.match(regex);
  return match && match[1] ? Number(match[1]) : null;
};

/**
 * returns all the tests that fall within the filters given
 */
export const getEligibleTests = (
  startedTests: ExaminerRecordModel[],
  category: TestCategory = null,
  range: DateRange = null,
  centreId: number = null,
  filterByLocation = true,
  filterByCategory = true,
  allowExtendedTests = false
): ExaminerRecordModel[] => {
  if (startedTests) {
    return startedTests.filter((value: ExaminerRecordModel) => {
      return (
        (range ? dateFilter(value, range as DateRange) : true) &&
        (filterByCategory ? (category ? get(value, 'testCategory') === category : true) : true) &&
        (filterByLocation ? (centreId ? get(value, 'testCentre.centreId') === centreId : true) : true) &&
        (allowExtendedTests ? true : !(get(value, 'extendedTest') === true))
      );
    });
  } else {
    return [];
  }
};

/**
 * Return the total amount of tests with an emergency stop from the eligible tests
 */
export const getEmergencyStopCount = (startedTests: ExaminerRecordModel[]): number => {
  if (startedTests) {
    return startedTests.filter((controlledStop) => get(controlledStop, 'controlledStop', null) === true).length;
  } else {
    return 0;
  }
};

/**
 * Returns an array of locations the examiner has conducted a test in within the date range and
 * the amount of tests they have conducted there
 */
export const getLocations = (
  startedTests: ExaminerRecordModel[],
  range: DateRange = null
): ExaminerRecordData<TestCentre>[] => {
  if (startedTests) {
    const data: ExaminerRecordModel[] = getEligibleTests(startedTests, null, range, null).filter((record) => {
      //Do not return tests that are categories we do not want to track to avoid test centres with no tests in them
      if (!unwantedCategories.includes(get(record, 'testCategory', null))) {
        return !!get(record, 'testCentre', null).centreId;
      }
      return false;
    });

    return uniqBy(
      data.map(({ testCentre }): ExaminerRecordData<TestCentre> => {
        return {
          item: testCentre,
          count: data.filter((val) => val.testCentre.centreId === testCentre.centreId).length,
        };
      }),
      'item.centreId'
    ).sort((item1, item2) => (item1.item.centreName > item2.item.centreName ? 1 : -1));
  } else {
    return [];
  }
};

/**
 * Returns an array containing the counts of both independent driving options within the tests for the given category
 */
export const getIndependentDrivingStats = (
  startedTests: ExaminerRecordModel[],
  category: TestCategory
): ExaminerRecordDataWithPercentage<string>[] => {
  //IndependentDriving is not applicable to the following categories, and so we can avoid the entire function
  if (
    !startedTests ||
    !category ||
    isAnyOf(category, [
      TestCategory.ADI3,
      TestCategory.SC,
      TestCategory.F,
      TestCategory.G,
      TestCategory.H,
      TestCategory.K,
      TestCategory.CCPC,
      TestCategory.DCPC,
      TestCategory.EUA1M1,
      TestCategory.EUA2M1,
      TestCategory.EUAM1,
      TestCategory.EUAMM1,
      TestCategory.CM,
      TestCategory.C1M,
      TestCategory.CEM,
      TestCategory.C1EM,
      TestCategory.DM,
      TestCategory.D1M,
      TestCategory.DEM,
      TestCategory.D1EM,
    ])
  ) {
    return [];
  }
  let indDrivingOptions: string[];
  if (
    isAnyOf(category, [
      TestCategory.C,
      TestCategory.C1,
      TestCategory.CE,
      TestCategory.C1E, // C
      TestCategory.D,
      TestCategory.D1,
      TestCategory.DE,
      TestCategory.D1E, // D
      TestCategory.EUAMM2,
      TestCategory.EUA1M2,
      TestCategory.EUA2M2,
      TestCategory.EUAM2, // Mod 2
    ])
  ) {
    indDrivingOptions = ['Traffic signs', 'Diagram'];
  } else {
    indDrivingOptions = ['Traffic signs', 'Sat nav'];
  }

  const data: ExaminerRecordModel[] = startedTests
    // extract cost codes
    .filter((record) => !!get(record, 'independentDriving', null));

  return indDrivingOptions
    .map((item: string, index) => {
      const count = data.filter((val) => val.independentDriving === item).length;
      return {
        item: `I${index + 1} - ${item}`,
        count,
        percentage: `${((count / data.length) * 100).toFixed(1)}%`,
      };
    })
    .sort((item1, item2) => getIndex(item1.item as string) - getIndex(item2.item as string));
};

/**
 * Returns an array containing the counts of both circuit options within the given tests
 */
export const getCircuits = (
  startedTests: ExaminerRecordModel[],
  category: TestCategory
): ExaminerRecordDataWithPercentage<string>[] => {
  //getCircuits is only applicable to the following categories, and so we can avoid the entire function
  if (
    !startedTests ||
    !category ||
    !isAnyOf(category, [TestCategory.EUA1M1, TestCategory.EUA2M1, TestCategory.EUAM1, TestCategory.EUAMM1])
  ) {
    return [];
  }
  const circuitOptions = ['Left', 'Right'];

  const data: ExaminerRecordModel[] = startedTests
    // extract circuits
    .filter((record) => !!get(record, 'circuit', null));

  return circuitOptions
    .map((item: string, index) => {
      const count = data.filter((val) => val.circuit === item).length;
      return {
        item: `C${index + 1} - ${item}`,
        count,
        percentage: `${((count / data.length) * 100).toFixed(1)}%`,
      };
    })
    .sort((item1, item2) => getIndex(item1.item as string) - getIndex(item2.item as string));
};

/**
 * Returns an array of categories the examiner has conducted a test in within the date range
 * at the selected location and the amount of tests of that type they have conducted
 */
export const getCategories = (
  startedTests: ExaminerRecordModel[],
  range: DateRange,
  category: TestCategory,
  centreId: number
): {
  item: TestCategory;
  count: number;
}[] => {
  if (startedTests) {
    const data: ExaminerRecordModel[] = startedTests.filter(
      (record: ExaminerRecordModel) =>
        get(record, 'testCentre.centreId', null) === centreId &&
        !isAnyOf(get(record, 'testCategory', null), unwantedCategories)
    );

    return uniqBy(
      data.map(({ testCategory }) => {
        return {
          item: testCategory,
          count: data.filter((val) => val.testCategory === testCategory).length,
        };
      }),
      'item'
    ).sort((item1, item2) => ((item1.item as string) > (item2.item as string) ? 1 : -1));
  } else {
    return [];
  }
};

/**
 * Returns the total number of conducted tests of the selected category at the selected location within
 * the selected time frame
 */
export const getStartedTestCount = (startedTests: ExaminerRecordModel[]): number =>
  startedTests ? startedTests.length : 0;

/**
 * Returns an array containing the conducted test routes within the given tests and their frequency of appearance
 */
export const getRouteNumbers = (startedTests: ExaminerRecordModel[]): ExaminerRecordDataWithPercentage<string>[] => {
  if (startedTests) {
    const data = startedTests.filter((record: ExaminerRecordModel) => get(record, 'routeNumber', null) !== null);

    return uniqBy(
      data.map(({ routeNumber }) => {
        const count = data.filter((val) => val.routeNumber === routeNumber).length;
        return {
          item: `R${routeNumber} - Route ${routeNumber}`,
          count,
          percentage: `${((count / data.length) * 100).toFixed(1)}%`,
        };
      }),
      'item'
    ).sort((item1, item2) => getIndex(item1.item as string) - getIndex(item2.item as string));
  } else {
    return [];
  }
};

/**
 * Returns an array containing the selected safety questions within the given tests and their frequency of appearance
 */
export const getSafetyQuestions = (
  startedTests: ExaminerRecordModel[],
  category: TestCategory = null
): ExaminerRecordDataWithPercentage<string>[] => {
  const qp = new QuestionProvider();

  if (startedTests) {
    const questions = [
      ...qp.getSafetyQuestions(category).map((q) => ({
        code: q.code,
        description: q.shortName,
      })),
    ];

    const data = startedTests
      .flatMap((record: ExaminerRecordModel) => [...(get(record, 'safetyQuestions', []) as QuestionResult[])])
      // filter for any empty string/null values
      .filter((question: SafetyQuestionResult | QuestionResult) =>
        'code' in question ? !!question?.code : !!question?.description
      );

    return questions
      .map((q) => {
        const count = data.filter((val) => val.code === q.code).length;
        return {
          item: `${q.code} - ${q.description}`,
          count,
          percentage: `${((count / data.length) * 100).toFixed(1)}%`,
        };
      })
      .sort((item1, item2) => getIndex(item1.item as string) - getIndex(item2.item as string));
  } else {
    return [];
  }
};

/**
 * Returns an array containing the selected balance questions within the given tests and their frequency of appearance
 */
export const getBalanceQuestions = (
  startedTests: ExaminerRecordModel[],
  category: TestCategory = null
): ExaminerRecordDataWithPercentage<string>[] => {
  const qp = new QuestionProvider();

  if (startedTests) {
    const questions = [
      ...qp.getBalanceQuestions(category).map((q) => ({
        code: q.code,
        description: q.shortName,
      })),
    ];

    const data = startedTests
      .flatMap((record: ExaminerRecordModel) => get(record, 'balanceQuestions', []) as QuestionResult[])
      // filter for any empty string/null values
      .filter((question: QuestionResult) => ('code' in question ? !!question?.code : !!question?.description));

    return questions
      .map((q) => {
        const count = data.filter((val) => val.code === q.code).length;
        return {
          item: `${q.code} - ${q.description}`,
          count,
          percentage: `${((count / data.length) * 100).toFixed(1)}%`,
        };
      })
      .sort((item1, item2) => getIndex(item1.item as string) - getIndex(item2.item as string));
  } else {
    return [];
  }
};

/**
 * Returns an array containing the selected show me questions within the given tests and their frequency of appearance
 */
export const getShowMeQuestions = (
  startedTests: ExaminerRecordModel[],
  category: TestCategory = null
): ExaminerRecordDataWithPercentage<string>[] => {
  const qp = new QuestionProvider();

  if (startedTests) {
    const questions = qp.getShowMeQuestions(category).filter((q) => q.code !== 'N/A');

    const data = startedTests
      .flatMap((record: ExaminerRecordModel) => get(record, 'showMeQuestions', []) as QuestionResult[])
      // filter for any empty string/null values
      .filter((question: QuestionResult) => !!question?.code);

    return questions
      .map((q) => {
        const count = data.filter((val) => val.code === q.code).length;
        return {
          item: `${q.code} - ${q.shortName}`,
          count,
          percentage: `${((count / data.length) * 100).toFixed(1)}%`,
        };
      })
      .sort((item1, item2) => getIndex(item1.item as string) - getIndex(item2.item as string));
  } else {
    return [];
  }
};

/**
 * Returns an array containing the selected tell me questions within the given tests and their frequency of appearance
 */
export const getTellMeQuestions = (
  startedTests: ExaminerRecordModel[],
  category: TestCategory = null
): ExaminerRecordDataWithPercentage<string>[] => {
  const qp = new QuestionProvider();

  if (startedTests) {
    const questions = qp.getTellMeQuestions(category);
    const data = startedTests
      .flatMap((record: ExaminerRecordModel) => get(record, 'tellMeQuestions', []) as QuestionResult[])
      // filter for any empty string/null values
      .filter((question: QuestionResult) => !!question?.code);

    return questions
      .map((q) => {
        const count = data.filter((val) => val.code === q.code).length;
        return {
          item: `${q.code} - ${q.shortName}`,
          count,
          percentage: `${((count / data.length) * 100).toFixed(1)}%`,
        };
      })
      .sort((item1, item2) => getIndex(item1.item as string) - getIndex(item2.item as string));
  } else {
    return [];
  }
};

/**
 * Returns the correct labels for manoeuvres in a specified category
 */
export const getManoeuvreTypeLabels = (category: TestCategory, type?: ManoeuvreTypes) => {
  if ([TestCategory.B].includes(category)) {
    return type ? manoeuvreTypeLabelsCatB[type] : manoeuvreTypeLabelsCatB;
  } else if ([TestCategory.BE].includes(category)) {
    return type ? manoeuvreTypeLabelsCatBE[type] : manoeuvreTypeLabelsCatBE;
  } else if ([TestCategory.ADI2].includes(category)) {
    return type ? manoeuvreTypeLabelsCatADI2[type] : manoeuvreTypeLabelsCatADI2;
  } else {
    return {};
  }
};

/**
 * Returns an array containing the selected manoeuvres within the given tests and their frequency of appearance
 */
export const getManoeuvresUsed = (
  startedTests: ExaminerRecordModel[],
  category: TestCategory = null
): ExaminerRecordDataWithPercentage<string>[] => {
  let manoeuvresEncountered: string[] = [];
  let manoeuvreTypeLabels: string[] = [];
  if (category) {
    manoeuvreTypeLabels = Object.values(getManoeuvreTypeLabels(category));
  }
  if (manoeuvreTypeLabels.length === 0 || !startedTests || startedTests.length === 0) {
    return [];
  }

  startedTests.forEach((record: ExaminerRecordModel) => {
    const manoeuvres = get(record, 'manoeuvres');
    if (!manoeuvres) return;
    const mans = Array.isArray(manoeuvres) ? manoeuvres : [manoeuvres];
    mans.forEach((manoeuvre) => {
      forOwn(manoeuvre, (man: Manoeuvre, type: ManoeuvreTypes) => {
        if (man.selected) {
          const label = getManoeuvreTypeLabels(category, type);
          if (label) {
            manoeuvresEncountered.push(label);
          }
        }
      });
    });
    manoeuvresEncountered = manoeuvresEncountered.filter((fault) => !!fault);
  });

  return manoeuvreTypeLabels
    .map((q, index) => {
      const count = manoeuvresEncountered.filter((val) => val === q).length;
      return {
        item: `E${index + 1} - ${q}`,
        count,
        percentage: `${((count / manoeuvresEncountered.length) * 100).toFixed(1)}%`,
      };
    })
    .sort((item1, item2) => getIndex(item1.item as string) - getIndex(item2.item as string));
};
