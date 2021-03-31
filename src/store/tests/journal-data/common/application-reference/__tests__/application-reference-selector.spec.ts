import { ApplicationReference } from '@dvsa/mes-test-schema/categories/common';
import {
  getApplicationNumber,
} from '../application-reference.selector';

describe('application reference selector', () => {
  const applicationReference: ApplicationReference = {
    applicationId: 1234567,
    bookingSequence: 8,
    checkDigit: 9,
  };
  describe('getApplicationNumber', () => {
    it('should combine the application reference fields to produce a formatted application number ', () => {
      expect(getApplicationNumber(applicationReference)).toBe('1234567089');
    });
  });
});
