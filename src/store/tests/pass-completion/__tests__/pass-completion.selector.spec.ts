import { PassCompletion } from '@dvsa/mes-test-schema/categories/common';
import {
  getPassCertificateNumber,
  isProvisionalLicenseProvided,
  isProvisionalLicenseNotProvided,
} from '../pass-completion.selector';

describe('pass completion selector', () => {
  const state: PassCompletion = {
    provisionalLicenceProvided: true,
    passCertificateNumber: 'ABC123',
  };

  describe('getPassCertificateNumber', () => {
    it('should retrieve the pass certificate number', () => {
      expect(getPassCertificateNumber(state)).toBe('ABC123');
    });
  });

  describe('provisionalLicenseProvided', () => {
    it('should retrieve whether the provisional license was provided', () => {
      expect(isProvisionalLicenseProvided(state)).toBe(true);
    });
  });

  describe('provisionalLicenseNotProvided', () => {
    it('should retrieve whether the provisional license was provided', () => {
      expect(isProvisionalLicenseNotProvided(state)).toBe(false);
    });
  });
});
