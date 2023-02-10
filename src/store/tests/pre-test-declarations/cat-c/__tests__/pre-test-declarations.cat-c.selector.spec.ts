import { CatCUniqueTypes } from '@dvsa/mes-test-schema/categories/C';
import {
  getManoeuvrePassCertificateNumber,
} from '../pre-test-declarations.cat-c.selector';

describe('PreTestDeclarations selector', () => {
  const state: CatCUniqueTypes.PreTestDeclarations = {
    manoeuvrePassCertificateNumber: 'testData',
  } as CatCUniqueTypes.PreTestDeclarations;

  describe('getInsuranceDeclarationStatus', () => {
    it('should set the PassCertificateNumber to the passed value', () => {
      expect(getManoeuvrePassCertificateNumber(state)).toBe('testData');
    });
  });
});
