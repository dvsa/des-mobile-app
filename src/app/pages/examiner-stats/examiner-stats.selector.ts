import { forOwn, get, transform, uniqBy } from 'lodash';
import { TestResultSchemasUnion } from '@dvsa/mes-test-schema/categories';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { Manoeuvre } from '@dvsa/mes-test-schema/categories/common';
import { ManoeuvreTypes } from '@store/tests/test-data/test-data.constants';
import { AlternativeManoeuvreTypeLabels, BaseManoeuvreTypeLabels } from '@pages/examiner-stats/examiner-stats.page';

type StartedTests = { [slotId: string]: TestResultSchemasUnion };

export const getRouteNumbers = (startedTests: StartedTests): { item: string, count: number }[] => {
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
export const getShowMeQuestions = (startedTests: StartedTests): { item: string, count: number }[] => {
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
export const getTellMeQuestions = (startedTests: StartedTests): { item: string, count: number }[] => {
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
export const getManoeuvresUsed = (startedTests: StartedTests): { item: string, count: number }[] => {
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
