import { Action } from '@ngrx/store';
import { CatADI2UniqueTypes } from '@dvsa/mes-test-schema/categories/ADI2';
import { TestResultSchemasUnion } from '@dvsa/mes-test-schema/categories';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';

import { testsCatADIPart2Reducer } from './tests.cat-adi-part2.reducer';

export function testsReducerFactory(
  category: TestCategory | null,
  action: Action,
  state: TestResultSchemasUnion,
): TestResultSchemasUnion {
  switch (category) {
    case TestCategory.ADI2:
      return testsCatADIPart2Reducer(action, state as Required<CatADI2UniqueTypes.TestResult>);
    default:
      // IN DES3 CATB is default
      return testsCatADIPart2Reducer(action, state as Required<CatADI2UniqueTypes.TestResult>);
  }
}
