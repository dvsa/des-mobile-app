import { Action } from '@ngrx/store';
import { TestResultSchemasUnion } from '@dvsa/mes-test-schema/categories';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { CatADI2UniqueTypes } from '@dvsa/mes-test-schema/categories/ADI2';
import { CatBUniqueTypes } from '@dvsa/mes-test-schema/categories/B';
import { CatBEUniqueTypes } from '@dvsa/mes-test-schema/categories/BE';
import { CatCUniqueTypes } from '@dvsa/mes-test-schema/categories/C';
import { CatCEUniqueTypes } from '@dvsa/mes-test-schema/categories/CE';
import { CatC1UniqueTypes } from '@dvsa/mes-test-schema/categories/C1';
import { CatC1EUniqueTypes } from '@dvsa/mes-test-schema/categories/C1E';
import { TestResultCatCPCSchema } from '@dvsa/mes-test-schema/categories/CPC';
import { TestResultCatAM2Schema } from '@dvsa/mes-test-schema/categories/AM2';
import { CatDUniqueTypes } from '@dvsa/mes-test-schema/categories/D';
import { testsCatBReducer } from './tests.cat-b.reducer';
import { testsCatBEReducer } from './tests.cat-be.reducer';
import { testsCatADIPart2Reducer } from './tests.cat-adi-part2.reducer';
import { testsCatCReducer } from './tests.cat-c.reducer';
import { testsCatCEReducer } from './tests.cat-ce.reducer';
import { testsCatC1Reducer } from './tests.cat-c1.reducer';
import { testsCatC1EReducer } from './tests.cat-c1e.reducer';
import { testsCatCPCReducer } from './tests.cat-cpc.reducer';
import { testsCatDReducer } from './tests.cat-d.reducer';
import { testsCatAMod2Reducer } from './tests.cat-a-mod2.reducer';

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
    case TestCategory.BE:
      return testsCatBEReducer(action, state as Required<CatBEUniqueTypes.TestResult>);
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
    case TestCategory.D1:
      return testsCatDReducer(action, state as Required<CatDUniqueTypes.TestResult>);
    case TestCategory.EUAMM2:
    case TestCategory.EUA1M2:
    case TestCategory.EUA2M2:
    case TestCategory.EUAM2:
      return testsCatAMod2Reducer(action, state as Required<TestResultCatAM2Schema>);
    default:
      return testsCatBReducer(action, state as Required<CatBUniqueTypes.TestResult>);
  }
}
