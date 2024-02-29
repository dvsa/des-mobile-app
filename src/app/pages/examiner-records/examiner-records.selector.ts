import { forOwn, get, transform, uniqBy } from 'lodash-es';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { Manoeuvre, SafetyQuestionResult, TestCentre } from '@dvsa/mes-test-schema/categories/common';
import { ManoeuvreTypes } from '@store/tests/test-data/test-data.constants';
import { DateRange, DateTime } from '@shared/helpers/date-time';
import { QuestionResult } from '@dvsa/mes-test-schema/categories/C/partial';
import { QuestionProvider } from '@providers/question/question';
import { manoeuvreTypeLabelsCatD } from '@shared/constants/competencies/catd-manoeuvres';
import { manoeuvreTypeLabels as manoeuvreTypeLabelsCatB } from '@shared/constants/competencies/catb-manoeuvres';
import { manoeuvreTypeLabels as manoeuvreTypeLabelsCatBE } from '@shared/constants/competencies/catbe-manoeuvres';
import { manoeuvreTypeLabels as manoeuvreTypeLabelsCatADI2 } from '@shared/constants/competencies/catadi2-manoeuvres';
import { isAnyOf } from '@shared/helpers/simplifiers';
import { ExaminerRecordModel } from '@dvsa/mes-microservice-common/domain/examiner-records';
import { ExaminerRecordsRange } from '@providers/examiner-records/examiner-records';

// Generic `T` is the configurable type of the item
export interface ExaminerRecordData<T> {
  item: T;
  count: number;
  percentage: string;
}

// add date range filter
const dateFilter = (test: ExaminerRecordModel, range: DateRange = null): boolean => (range)
  // use range when provided
  ? new DateTime(get(test, 'startDate')).isDuring(range)
  // return true to get all tests when no range provided
  : true;

const getIndex = (item: string) => {
  const regex = /[A-Za-z]*(\d+)/;
  const match = item.match(regex);
  return match && match[1] ? Number(match[1]) : null;
};

export const getEligibleTests = (
  startedTests: ExaminerRecordModel[],
  range: ExaminerRecordsRange = null,
  centreId: number = null,
  category: TestCategory = null,
  filterByCategoryAndCentre: boolean = true,
): ExaminerRecordModel[] => {

  let trimmedArray = false
  if (!!Number(range)) {
    trimmedArray = true
    startedTests = startedTests.slice(0, Number(range));
  }

  return startedTests.filter((value: ExaminerRecordModel) => (
    (!trimmedArray ? (dateFilter(value, range as DateRange)): true) &&
    (filterByCategoryAndCentre ?
      (get(value, 'testCentre.centreId') === centreId && get(value, 'testCategory') === category) : true)));
};

export const getEmergencyStopCount = (
  startedTests: ExaminerRecordModel[],
  range: ExaminerRecordsRange = null,
  centreId: number = null,
  category: TestCategory = null,
): number =>
  getEligibleTests(startedTests, range, centreId, category)
    .map((record: ExaminerRecordModel) => get(record, 'controlledStop', null))
    .filter((controlledStop) => (!!controlledStop && (controlledStop === 'true')))
    .length;

export const getLocations = (
  startedTests: ExaminerRecordModel[],
  range: ExaminerRecordsRange = null,
  // Omit is a TS type, to remove a property from an interface
): Omit<ExaminerRecordData<TestCentre>, 'percentage'>[] => {
  const data = getEligibleTests(startedTests, range, null, null, false)
    // extract cost codes
    .map((record) => get(record, 'testCentre', null))
    // filter for any nulls
    .filter((testCentre) => !!testCentre.centreId);

  return uniqBy(data.map((item: TestCentre) => {
    return {
      item,
      count: data.filter((val: TestCentre) => val.centreId === item.centreId).length,
    };
  }), 'item.centreId')
    .sort((item1, item2) =>
      (item1.item.centreName) > (item2.item.centreName) ? 1 : -1);
};

export const getIndependentDrivingStats = (
  startedTests: ExaminerRecordModel[],
  range: ExaminerRecordsRange = null,
  centreId: number,
  category: TestCategory,
): ExaminerRecordData<string>[] => {
  //IndependentDriving is not applicable to the following categories, and so we can avoid the entire function
  if (isAnyOf(category, [undefined, null,
    TestCategory.ADI3,
    TestCategory.F, TestCategory.G, TestCategory.H, TestCategory.K,
    TestCategory.CCPC, TestCategory.DCPC,
    TestCategory.EUA1M1, TestCategory.EUA2M1, TestCategory.EUAM1, TestCategory.EUAMM1,
    TestCategory.CM, TestCategory.C1M, TestCategory.CEM, TestCategory.C1EM,
    TestCategory.DM, TestCategory.D1M, TestCategory.DEM, TestCategory.D1EM,
  ])) {
    return [];
  }
  let indDrivingOptions: string[];
  if (isAnyOf(category, [
    TestCategory.C, TestCategory.C1, TestCategory.CE, TestCategory.C1E, // C
    TestCategory.EUAMM2, TestCategory.EUA1M2, TestCategory.EUA2M2, TestCategory.EUAM2, // Mod 2
  ])) {
    indDrivingOptions = ['Traffic signs', 'Diagram'];
  } else {
    indDrivingOptions = ['Traffic signs', 'Sat nav'];
  }

  const data: string[] = getEligibleTests(startedTests, range, centreId, category)
    // extract cost codes
    .map((record: ExaminerRecordModel) => get(record, 'independentDriving', null))
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

export const getCircuits = (
  startedTests: ExaminerRecordModel[],
  range: ExaminerRecordsRange = null,
  centreId: number,
  category: TestCategory,
): ExaminerRecordData<string>[] => {
  //getCircuits is only applicable to the following categories, and so we can avoid the entire function
  if (!isAnyOf(category, [undefined, null,
    TestCategory.EUA1M1, TestCategory.EUA2M1, TestCategory.EUAM1, TestCategory.EUAMM1,
  ])) {
    return [];
  }
  const circuitOptions = ['Left', 'Right'];

  const data: string[] = getEligibleTests(startedTests, range, centreId, category)
    // extract cost codes
    .map((record: ExaminerRecordModel) => get(record, 'circuit', null))
    // filter for any nulls
    .filter((driving) => !!driving);

  return circuitOptions.map((item: string, index) => {
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
  startedTests: ExaminerRecordModel[],
  range: ExaminerRecordsRange = null,
  centreId: number,
): {
  item: TestCategory;
  count: number
}[] => {

  const data = getEligibleTests(startedTests, range, null, null, false)
    .filter((record: ExaminerRecordModel) => get(record, 'testCentre.centreId') === centreId)
    // extract categories
    .map((record: ExaminerRecordModel) => get(record, 'testCategory', null))
    // filter for any nulls
    .filter((category) => !!category);

  return uniqBy(data.map((item: TestCategory) => {
    return {
      item,
      count: data.filter((val: TestCategory) => val === item).length,
    };
  }), 'item')
    .sort((item1, item2) =>
      (item1.item as string) > (item2.item as string) ? 1 : -1);
};

export const getStartedTestCount = (
  startedTests: ExaminerRecordModel[],
  range: ExaminerRecordsRange = null,
  centreId: number = null,
  category: TestCategory = null,
): number =>
  getEligibleTests(startedTests, range, centreId, category).length;

export const getRouteNumbers = (
  startedTests: ExaminerRecordModel[],
  range: ExaminerRecordsRange = null,
  centreId: number = null,
  category: TestCategory = null,
): ExaminerRecordData<string>[] => {

  const data = getEligibleTests(startedTests, range, centreId, category)
    // extract route number
    .map((record: ExaminerRecordModel) => (get(record, 'routeNumber', null)))
    // filter for any nulls
    .filter((route) => route !== null);

  return uniqBy(data.map((item) => {
    const count = data.filter((val) => val === item).length;
    return {
      item: `R${item} - Route ${item}`,
      count,
      percentage: `${((count) / data.length * 100).toFixed(1)}%`,
    };
  }), 'item')
    .sort((item1, item2) =>
      getIndex(item1.item as string) - getIndex(item2.item as string));
};

export const getSafetyQuestions = (
  startedTests: ExaminerRecordModel[],
  range: ExaminerRecordsRange = null,
  centreId: number = null,
  category: TestCategory = null,
): ExaminerRecordData<string>[] => {
  const qp = new QuestionProvider();

  const questions = [
    ...qp.getSafetyQuestions(category)
      .map((q) => ({
        code: q.code,
        description: q.shortName,
      })),
  ];

  const data = getEligibleTests(startedTests, range, centreId, category)
    .map((record: ExaminerRecordModel) => [
      ...get(record, 'safetyQuestions', []) as QuestionResult[],
    ])
    .flat()
    // filter for any empty string/null values
    .filter((question: SafetyQuestionResult | QuestionResult) =>
      ('code' in question) ? !!question?.code : !!question?.description);

  return questions.map((q) => {
    const count = data.filter((val) => val.code === q.code).length;
    return {
      item: `${q.code} - ${q.description}`,
      count,
      percentage: `${((count / data.length) * 100).toFixed(1)}%`,
    };
  })
    .sort((item1, item2) =>
      getIndex(item1.item as string) - getIndex(item2.item as string));
};

export const getBalanceQuestions = (
  startedTests: ExaminerRecordModel[],
  range: ExaminerRecordsRange = null,
  centreId: number = null,
  category: TestCategory = null,
): ExaminerRecordData<string>[] => {
  const qp = new QuestionProvider();

  const questions = [
    ...qp.getBalanceQuestions(category)
      .map((q) => ({
        code: q.code,
        description: q.shortName,
      })),
  ];


  const data = getEligibleTests(startedTests, range, centreId, category)
    .map((record: ExaminerRecordModel) => get(record, 'balanceQuestions', []) as QuestionResult[])
    .flat()
    // filter for any empty string/null values
    .filter((question: QuestionResult) =>
      ('code' in question) ? !!question?.code : !!question?.description);

  return questions.map((q) => {
    const count = data.filter((val) => val.code === q.code).length;
    return {
      item: `${q.code} - ${q.description}`,
      count,
      percentage: `${((count / data.length) * 100).toFixed(1)}%`,
    };
  })
    .sort((item1, item2) =>
      getIndex(item1.item as string) - getIndex(item2.item as string));
};

export const getShowMeQuestions = (
  startedTests: ExaminerRecordModel[],
  range: ExaminerRecordsRange = null,
  centreId: number = null,
  category: TestCategory = null,
): ExaminerRecordData<string>[] => {
  const qp = new QuestionProvider();

  const questions = qp.getShowMeQuestions(category).filter((q) => q.code !== 'N/A');

  const data = getEligibleTests(startedTests, range, centreId, category)
    .map((record: ExaminerRecordModel) => get(record, 'showMeQuestions', []) as QuestionResult[])
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
  startedTests: ExaminerRecordModel[],
  range: ExaminerRecordsRange = null,
  centreId: number = null,
  category: TestCategory = null,
): ExaminerRecordData<string>[] => {
  const qp = new QuestionProvider();
  const questions = qp.getTellMeQuestions(category);
  const data = getEligibleTests(startedTests, range, centreId, category)
    .map((record: ExaminerRecordModel) => get(record, 'tellMeQuestions', []) as QuestionResult[])
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
  } else if ([TestCategory.B].includes(category)) {
    return type ? manoeuvreTypeLabelsCatB[type] : manoeuvreTypeLabelsCatB;
  } else if ([TestCategory.BE].includes(category)) {
    return type ? manoeuvreTypeLabelsCatBE[type] : manoeuvreTypeLabelsCatBE;
  } else if ([TestCategory.ADI2].includes(category)) {
    return type ? manoeuvreTypeLabelsCatADI2[type] : manoeuvreTypeLabelsCatADI2;
  } else {
    return {};
  }
};

export const getManoeuvresUsed = (
  startedTests: ExaminerRecordModel[],
  range: ExaminerRecordsRange = null,
  centreId: number = null,
  category: TestCategory = null,
): ExaminerRecordData<string>[] => {
  let faultsEncountered: string[] = [];
  let manoeuvreTypeLabels: string[] = [];
  if (category) {
    manoeuvreTypeLabels = Object.values(getManoeuvreTypeLabels(category));
  }
  if (manoeuvreTypeLabels.length == 0) {
    return [];
  }

  getEligibleTests(startedTests, range, centreId, category)
    .forEach((record: ExaminerRecordModel) => {
      const manoeuvres = get(record, 'manoeuvres');
      if (!manoeuvres) return;
      const testCategory = get(record, 'testCategory') as TestCategory;
      const mans = Array.isArray(manoeuvres) ? manoeuvres : [manoeuvres];
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
