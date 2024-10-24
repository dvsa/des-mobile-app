import { PassCompletion } from '@dvsa/mes-test-schema/categories/AM1';
import { getPassCertificateNumber } from '../pass-completion.cat-a-mod1.selector';

describe('pass completion selector', () => {
  const state: PassCompletion = {
    passCertificateNumber: 'ABC123',
  };

  describe('getPassCertificateNumber', () => {
    it('should retrieve the pass certificate number', () => {
      expect(getPassCertificateNumber(state)).toBe('ABC123');
    });
  });
});
