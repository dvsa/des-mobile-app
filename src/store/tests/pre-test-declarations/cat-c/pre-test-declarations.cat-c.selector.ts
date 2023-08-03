import { CatCUniqueTypes } from '@dvsa/mes-test-schema/categories/C';
import { createSelector } from '@ngrx/store';
import { selectPreTestDeclarations } from '@store/tests/pre-test-declarations/pre-test-declarations.reducer';

export const getManoeuvrePassCertificateNumber = (
  decs: CatCUniqueTypes.PreTestDeclarations,
): string => decs.manoeuvrePassCertificateNumber;

export const selectManoeuvrePassCertificateNumber = createSelector(
  selectPreTestDeclarations,
  (decs: CatCUniqueTypes.PreTestDeclarations) => decs.manoeuvrePassCertificateNumber,
);
