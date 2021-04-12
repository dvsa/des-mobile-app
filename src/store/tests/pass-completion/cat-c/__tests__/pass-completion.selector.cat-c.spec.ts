import { CatCUniqueTypes } from '@dvsa/mes-test-schema/categories/C';
import { getCode78 } from '../pass-completion.cat-c.selector';

describe('pass completion cat C selector', () => {
  const state: CatCUniqueTypes.PassCompletion = {
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
