import { PreTestDeclarations } from '@dvsa/mes-test-schema/categories/AM1';
import { createSelector } from '@ngrx/store';
import { selectPreTestDeclarations } from '@store/tests/pre-test-declarations/pre-test-declarations.reducer';

export const getCBTNumberStatus = (decs: PreTestDeclarations) => decs.DL196CBTCertNumber;

export const selectCBTNumberStatus = createSelector(
  selectPreTestDeclarations,
  (decs: PreTestDeclarations) => decs.DL196CBTCertNumber,
);
