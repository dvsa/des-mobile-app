import {
  getHealthDeclarationStatus,
  getReceiptDeclarationStatus,
  getSignatureStatus,
} from '../post-test-declarations.selector';
import { PostTestDeclarations } from '@dvsa/mes-test-schema/categories/common';

describe('PostTestDeclarations selector', () => {
  const state: PostTestDeclarations = {
    healthDeclarationAccepted: true,
    passCertificateNumberReceived: false,
    postTestSignature: 'sig',
  };

  describe('getHealthDeclarationStatus', () => {
    it('should return the health declaration status', () => {
      expect(getHealthDeclarationStatus(state)).toBe(true);
    });
  });

  describe('getReceiptDeclarationStatus', () => {
    it('should return the pass receipt declaration status', () => {
      expect(getReceiptDeclarationStatus(state)).toBe(false);
    });
  });

  describe('getSignatureStatus', () => {
    it('should return the signature status', () => {
      expect(getSignatureStatus(state)).toEqual('sig');
    });
  });
});
