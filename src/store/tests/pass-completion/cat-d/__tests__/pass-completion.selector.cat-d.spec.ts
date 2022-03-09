import { CatDUniqueTypes } from '@dvsa/mes-test-schema/categories/D';
import { getCode78 } from '../pass-completion.cat-d.selector';

describe('pass completion cat D selector', () => {
  const state: CatDUniqueTypes.PassCompletion = {
    provisionalLicenceProvided: true,
    passCertificateNumber: 'ABC123',
    code78Present: true,
  };

  describe('getCode78', () => {
    it('should retrieve if the code 78 is present', () => {
      expect(getCode78(state)).toBe(true);
    });
  });

});
