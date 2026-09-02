import { CategoryCode } from '@dvsa/mes-test-schema/categories/common';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';

export const isAnyOf = <T>(dataValue: T, valuesToCheck: Array<T>): boolean =>
  valuesToCheck.some((value: T) => dataValue === value);

export const isBikeTest = (category: TestCategory | CategoryCode | string | undefined | null): boolean => {
  if (!category) {
    return false;
  }
  return isAnyOf(category, [
    // Cat Mod1
    TestCategory.EUA1M1,
    TestCategory.EUA2M1,
    TestCategory.EUAM1,
    TestCategory.EUAMM1,
    // Cat Mod2
    TestCategory.EUA1M2,
    TestCategory.EUA2M2,
    TestCategory.EUAM2,
    TestCategory.EUAMM2,
  ]);
};
