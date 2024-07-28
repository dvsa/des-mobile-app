import { PreTestDeclarations } from '@dvsa/mes-test-schema/categories/common';
import {
  getInsuranceDeclarationStatus,
  getResidencyDeclarationStatus,
  getSignatureStatus,
} from '../pre-test-declarations.selector';

describe('PreTestDeclarations selector', () => {
  const state: PreTestDeclarations = {
    insuranceDeclarationAccepted: true,
    residencyDeclarationAccepted: false,
    preTestSignature: 'sig',
  };

  describe('getInsuranceDeclarationStatus', () => {
    it('should return the insurance declaration status', () => {
      expect(getInsuranceDeclarationStatus(state)).toBe(true);
    });
  });

  describe('getResidencyDeclarationStatus', () => {
    it('should return the residency declaration status', () => {
      expect(getResidencyDeclarationStatus(state)).toBe(false);
    });
  });

  describe('getSignatureStatus', () => {
    it('should return the signature status', () => {
      expect(getSignatureStatus(state)).toEqual('sig');
    });
  });
});
