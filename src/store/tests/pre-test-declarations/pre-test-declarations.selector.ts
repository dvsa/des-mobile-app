import { PreTestDeclarations } from '@dvsa/mes-test-schema/categories/common';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { createSelector } from '@ngrx/store';
import { isAnyOf } from '@shared/helpers/simplifiers';
import { selectTestCategory } from '@store/tests/category/category.reducer';
import { selectPreTestDeclarations } from '@store/tests/pre-test-declarations/pre-test-declarations.reducer';

export const getInsuranceDeclarationStatus = (decs: PreTestDeclarations) => decs.insuranceDeclarationAccepted;

export const selectInsuranceDeclarationStatus = createSelector(
  selectPreTestDeclarations,
  (decs: PreTestDeclarations) => decs.insuranceDeclarationAccepted
);

export const getResidencyDeclarationStatus = (decs: PreTestDeclarations) => decs.residencyDeclarationAccepted;

export const selectResidencyDeclarationStatus = createSelector(
  selectPreTestDeclarations,
  (decs: PreTestDeclarations) => decs.residencyDeclarationAccepted
);

export const selectShowResidencyDec = createSelector(
  selectTestCategory,
  (category) => !isAnyOf(category, [TestCategory.ADI2, TestCategory.ADI3, TestCategory.SC])
);

export const getSignatureStatus = (decs: PreTestDeclarations) => decs.preTestSignature;

export const selectSignatureStatus = createSelector(
  selectPreTestDeclarations,
  (decs: PreTestDeclarations) => decs.preTestSignature
);
export const getCandidateDeclarationSignedStatus = (decs: PreTestDeclarations) => decs.candidateDeclarationSigned;

export const selectCandidateDeclarationSignedStatus = createSelector(
  selectPreTestDeclarations,
  (decs: PreTestDeclarations) => decs.candidateDeclarationSigned
);
