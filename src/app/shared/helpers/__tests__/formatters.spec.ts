import { Application } from '@dvsa/mes-journal-schema';
import { JournalData, TestSlotAttributes } from '@dvsa/mes-test-schema/categories/common';
import {
  formatApplicationReference,
  formatBookingReferenceForBackend,
  formatVisualBookingReference,
  getApplicationId,
  getFormattedApplicationReference,
  getResultTableApplicationReference,
  removeLeadingZeros,
  removeNonAlphaNumeric,
  stripNullishValues,
} from '@shared/helpers/formatters';

describe('Formatters', () => {
  describe('formatApplicationReference', () => {
    it('should format application reference with padded booking sequence', () => {
      const appRef: Application = {
        applicationId: 123,
        bookingSequence: 4,
        checkDigit: 7,
      };

      const result = formatApplicationReference(appRef);
      expect(result).toBe('123047');
    });

    it('should not pad booking sequence if already two digits', () => {
      const appRef: Application = {
        applicationId: 55,
        bookingSequence: 12,
        checkDigit: 9,
      };

      const result = formatApplicationReference(appRef);
      expect(result).toBe('55129');
    });
  });

  describe('removeLeadingZeros', () => {
    it('should remove leading zeros', () => {
      expect(removeLeadingZeros('000123')).toBe('123');
    });

    it('should return "0" when the entire string is zeros', () => {
      expect(removeLeadingZeros('0000')).toBe('0');
    });

    it('should return the same string if no leading zeros', () => {
      expect(removeLeadingZeros('123')).toBe('123');
    });
  });

  describe('removeNonAlphaNumeric', () => {
    it('should remove non-alphanumeric characters except plus', () => {
      expect(removeNonAlphaNumeric('A!B@C#1$2%3+')).toBe('ABC123+');
    });

    it('should handle empty strings', () => {
      expect(removeNonAlphaNumeric('')).toBe('');
    });
  });

  describe('stripNullishValues', () => {
    it('should remove null, undefined, empty string, and NaN values', () => {
      const input = {
        a: 1,
        b: null,
        c: '',
        d: undefined,
        e: Number.NaN,
        f: 'valid',
        g: { 1: 'A' },
      };

      const result = stripNullishValues(input);
      expect(result).toEqual({
        a: 1,
        f: 'valid',
        g: { 1: 'A' },
      });
    });

    it('should return an empty object if all values are nullish', () => {
      const input = { a: null, b: '', c: undefined, d: Number.NaN };
      const result = stripNullishValues(input);
      expect(result).toEqual({});
    });
  });

  describe('getResultTableApplicationReference', () => {
    it('should return slotId when bookingReference is present', () => {
      const journalData: JournalData = {
        applicationReference: {
          bookingReference: 'BR123',
        },
        testSlotAttributes: {
          slotId: 987654,
        } as TestSlotAttributes,
      } as JournalData;

      const result = getResultTableApplicationReference(journalData);

      expect(result).toBe(journalData.testSlotAttributes.slotId);
    });

    it('should return formatted application reference when bookingReference is not present', () => {
      const journalData: JournalData = {
        applicationReference: {
          applicationId: 12345678,
          bookingSequence: 1,
          checkDigit: 9,
        },
        testSlotAttributes: {
          slotId: 987654,
        } as TestSlotAttributes,
      } as JournalData;

      const result = getResultTableApplicationReference(journalData);
      expect(result).toBe(12345678019);
    });
  });

  describe('getApplicationId', () => {
    it('should return bookingReference if present', () => {
      const appRef: Application = {
        applicationId: 123,
        bookingReference: 'BR123',
      } as any;

      expect(getApplicationId(appRef)).toBe('BR123');
    });

    it('should return applicationId as string if bookingReference is absent', () => {
      const appRef: Application = {
        applicationId: 456,
      } as any;

      expect(getApplicationId(appRef)).toBe('456');
    });
  });

  describe('getFormattedApplicationReference', () => {
    it('should return bookingReference if present', () => {
      const appRef: Application = {
        applicationId: 123,
        bookingSequence: 4,
        checkDigit: 7,
        bookingReference: 'BR999',
      };

      expect(getFormattedApplicationReference(appRef)).toBe('BR999');
    });

    it('should format reference when bookingReference is absent', () => {
      const appRef: Application = {
        applicationId: 123,
        bookingSequence: 4,
        checkDigit: 7,
      };

      expect(getFormattedApplicationReference(appRef)).toBe('123047');
    });
  });

  describe('formatVisualBookingReference', () => {
    it('should format a full 10‑character string correctly', () => {
      const result = formatVisualBookingReference('abcdefghij');
      expect(result).toBe('A BCD EFG HIJ');
    });

    it('should remove spaces before formatting', () => {
      const result = formatVisualBookingReference('ab c d e f g h i j');
      expect(result).toBe('A BCD EFG HIJ');
    });

    it('should uppercase the value automatically', () => {
      const result = formatVisualBookingReference('abcDefGhij');
      expect(result).toBe('A BCD EFG HIJ');
    });

    it('should handle partial input (less than 10 chars)', () => {
      const result = formatVisualBookingReference('abcde');
      expect(result).toBe('A BCD E');
    });

    it('should return an empty string when given empty input', () => {
      const result = formatVisualBookingReference('');
      expect(result).toBe('');
    });

    it('should ignore non‑alphanumeric characters before formatting', () => {
      const result = formatVisualBookingReference('ab!c@d#e$f%g^h&i*j');
      expect(result).toBe('A BCD EFG HIJ');
    });
  });

  describe('formatBookingReferenceForBackend', () => {
    it('should remove all non‑alphanumeric characters', () => {
      const result = formatBookingReferenceForBackend('ab!c@d#123');
      expect(result).toBe('ABCD123');
    });

    it('should uppercase the result', () => {
      const result = formatBookingReferenceForBackend('abc123xyz');
      expect(result).toBe('ABC123XYZ');
    });

    it('should remove spaces', () => {
      const result = formatBookingReferenceForBackend('a b c 1 2 3');
      expect(result).toBe('ABC123');
    });

    it('should return an empty string when given empty input', () => {
      const result = formatBookingReferenceForBackend('');
      expect(result).toBe('');
    });

    it('should handle strings with only symbols', () => {
      const result = formatBookingReferenceForBackend('!@#$%^&*()');
      expect(result).toBe('');
    });
  });
});
