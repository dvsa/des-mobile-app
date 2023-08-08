import { CatCUniqueTypes } from '@dvsa/mes-test-schema/categories/C';
import { createSelector } from '@ngrx/store';
import { selectPreTestDeclarations } from '@store/tests/pre-test-declarations/pre-test-declarations.reducer';
import { selectTestCategory } from '@store/tests/category/category.reducer';
import { isAnyOf } from '@shared/helpers/simplifiers';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';

export const getManoeuvrePassCertificateNumber = (
  decs: CatCUniqueTypes.PreTestDeclarations,
): string => decs.manoeuvrePassCertificateNumber;

export const selectManoeuvrePassCertificateNumber = createSelector(
  selectPreTestDeclarations,
  (decs: CatCUniqueTypes.PreTestDeclarations) => decs.manoeuvrePassCertificateNumber,
);

export const selectShowManoeuvresPassCertNumber = createSelector(
  selectTestCategory,
  (category) => isAnyOf(category, [
    TestCategory.C, TestCategory.C1, TestCategory.CE, TestCategory.C1E,
    TestCategory.D, TestCategory.D1, TestCategory.DE, TestCategory.D1E,
  ]),
);
