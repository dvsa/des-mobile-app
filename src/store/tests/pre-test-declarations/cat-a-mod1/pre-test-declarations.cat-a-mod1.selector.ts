import { PreTestDeclarations } from '@dvsa/mes-test-schema/categories/AM1';
import { createSelector } from '@ngrx/store';
import { selectPreTestDeclarations } from '@store/tests/pre-test-declarations/pre-test-declarations.reducer';
import { selectTestCategory } from '@store/tests/category/category.reducer';
import { isAnyOf } from '@shared/helpers/simplifiers';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';

export const getCBTNumberStatus = (decs: PreTestDeclarations) => decs.DL196CBTCertNumber;

export const selectCBTNumberStatus = createSelector(
  selectPreTestDeclarations,
  (decs: PreTestDeclarations) => decs.DL196CBTCertNumber,
);

export const selectShowCbtNumber = createSelector(
  selectTestCategory,
  (category) => isAnyOf(category, [
    TestCategory.EUAMM1, TestCategory.EUA1M1, TestCategory.EUA2M1, TestCategory.EUAM1, // Mod 1
    TestCategory.EUAMM2, TestCategory.EUA1M2, TestCategory.EUA2M2, TestCategory.EUAM2, // Mod 2
  ]),
);
