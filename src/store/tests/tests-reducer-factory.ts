import { Action } from '@ngrx/store';
import { CatADI2UniqueTypes } from '@dvsa/mes-test-schema/categories/ADI2';
import { CatCUniqueTypes } from '@dvsa/mes-test-schema/categories/C';
import { CatCEUniqueTypes } from '@dvsa/mes-test-schema/categories/CE';
import { CatC1UniqueTypes } from '@dvsa/mes-test-schema/categories/C1';
import { CatC1EUniqueTypes } from '@dvsa/mes-test-schema/categories/C1E';
import { TestResultCatCPCSchema } from '@dvsa/mes-test-schema/categories/CPC';
import { TestResultSchemasUnion } from '@dvsa/mes-test-schema/categories';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { CatBUniqueTypes } from '@dvsa/mes-test-schema/categories/B';

import { testsCatBReducer } from './tests.cat-b.reducer';
import { testsCatDReducer } from '@store/tests/tests.cat-d.reducer';
import { CatDUniqueTypes } from '@dvsa/mes-test-schema/categories/D';
import { testsCatADIPart2Reducer } from './tests.cat-adi-part2.reducer';
import { testsCatCReducer } from './tests.cat-c.reducer';
import { testsCatCEReducer } from './tests.cat-ce.reducer';
import { testsCatC1Reducer } from './tests.cat-c1.reducer';
import { testsCatC1EReducer } from './tests.cat-c1e.reducer';
import { testsCatCPCReducer } from './tests.cat-cpc.reducer';

export function testsReducerFactory(
  category: TestCategory | null,
  action: Action,
  state: TestResultSchemasUnion,
): TestResultSchemasUnion {
  switch (category) {
    case TestCategory.ADI2:
      return testsCatADIPart2Reducer(action, state as Required<CatADI2UniqueTypes.TestResult>);
    case TestCategory.B:
      return testsCatBReducer(action, state as Required<CatBUniqueTypes.TestResult>);
    case TestCategory.C:
      return testsCatCReducer(action, state as Required<CatCUniqueTypes.TestResult>);
    case TestCategory.CE:
      return testsCatCEReducer(action, state as Required<CatCEUniqueTypes.TestResult>);
    case TestCategory.C1:
      return testsCatC1Reducer(action, state as Required<CatC1UniqueTypes.TestResult>);
    case TestCategory.C1E:
      return testsCatC1EReducer(action, state as Required<CatC1EUniqueTypes.TestResult>);
    case TestCategory.CCPC:
    case TestCategory.DCPC:
      return testsCatCPCReducer(action, state as Required<TestResultCatCPCSchema>);
    case TestCategory.D:
    case TestCategory.DE:
    case TestCategory.D1E:
      return testsCatDReducer(action, state as Required<CatDUniqueTypes.TestResult>);
    default:
      return testsCatBReducer(action, state as Required<CatBUniqueTypes.TestResult>);
  }
}
