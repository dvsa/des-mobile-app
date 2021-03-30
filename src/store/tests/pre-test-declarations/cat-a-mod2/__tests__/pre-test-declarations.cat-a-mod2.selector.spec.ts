import { getCBTNumberStatus } from '../pre-test-declarations.cat-a-mod2.selector';
import { PreTestDeclarations } from '@dvsa/mes-test-schema/categories/AM2';

describe('PreTestDeclarations selector', () => {
  const state: PreTestDeclarations = {
    DL196CBTCertNumber: '1234567',
    insuranceDeclarationAccepted: true,
    residencyDeclarationAccepted: false,
    preTestSignature: 'sig',
  };

  describe('getCBTNumberStatus', () => {
    it('should retrieve the cbt number', () => {
      expect(getCBTNumberStatus(state)).toBe('1234567');
    });
  });
});
