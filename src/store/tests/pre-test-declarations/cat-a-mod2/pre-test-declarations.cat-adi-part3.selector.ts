import { PreTestDeclarations } from '@dvsa/mes-test-schema/categories/ADI3';
import { createSelector } from '@ngrx/store';
import { selectPreTestDeclarations } from '@store/tests/pre-test-declarations/pre-test-declarations.reducer';

export const getValidCertificateStatus = (dec: PreTestDeclarations) => dec.validCertificate;

export const selectValidCertificateStatus = createSelector(
  selectPreTestDeclarations,
  (dec: PreTestDeclarations) => dec.validCertificate,
);
