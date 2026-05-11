import { Application } from '@dvsa/mes-journal-schema';
import { JournalData, TestSlotAttributes } from '@dvsa/mes-test-schema/categories/common';
import { MaskitoOptions } from '@maskito/core';
import {
  bookingReferenceMask,
  formatApplicationReference,
  formatBookingReferenceForBackend,
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
      const input = {
        a: null,
        b: '',
        c: undefined,
        d: Number.NaN,
      };
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

  describe('bookingReferenceMask', () => {
    let maskFn: (context: { value: string }) => (RegExp | string)[];

    beforeEach(() => {
      maskFn = (bookingReferenceMask as { mask: (context: { value: string }) => (RegExp | string)[] }).mask;
    });

    describe('when value starts with a digit', () => {
      it('should return a numeric-only mask of 11 digits', () => {
        const mask = maskFn({ value: '1' });
        expect(mask.length).toBe(11);
        mask.forEach((element) => {
          expect(element).toBeInstanceOf(RegExp);
          expect((element as RegExp).toString()).toBe('/\\d/');
        });
      });

      it('should match any digit (0-9) in every position', () => {
        const mask = maskFn({ value: '5' }) as RegExp[];
        mask.forEach((regex) => {
          for (let d = 0; d <= 9; d++) {
            expect(regex.test(String(d))).toBe(true);
          }
        });
      });

      it('should not match a letter in a numeric mask position', () => {
        const mask = maskFn({ value: '0' }) as RegExp[];
        mask.forEach((regex) => {
          expect(regex.test('A')).toBe(false);
        });
      });
    });

    describe('when value starts with a non-digit (D/d prefix expected)', () => {
      it('should return a mask with 13 elements for a D-prefixed format', () => {
        const mask = maskFn({ value: 'D' });
        expect(mask.length).toBe(13);
      });

      it('should return a mask with 13 elements for an empty value', () => {
        const mask = maskFn({ value: '' });
        expect(mask.length).toBe(13);
      });

      it('should have a space string at positions 1, 5, and 9', () => {
        const mask = maskFn({ value: 'D' });
        expect(mask[1]).toBe(' ');
        expect(mask[5]).toBe(' ');
        expect(mask[9]).toBe(' ');
      });

      it('should match D or d at position 0', () => {
        const mask = maskFn({ value: 'D' }) as (RegExp | string)[];
        const firstElement = mask[0] as RegExp;
        expect(firstElement).toBeInstanceOf(RegExp);
        expect(firstElement.test('D')).toBe(true);
        expect(firstElement.test('d')).toBe(true);
        expect(firstElement.test('A')).toBe(false);
        expect(firstElement.test('1')).toBe(false);
      });

      it('should match digits at positions 2, 3, 4', () => {
        const mask = maskFn({ value: 'D' }) as (RegExp | string)[];
        [2, 3, 4].forEach((pos) => {
          const regex = mask[pos] as RegExp;
          expect(regex).toBeInstanceOf(RegExp);
          for (let d = 0; d <= 9; d++) {
            expect(regex.test(String(d))).toBe(true);
          }
          expect(regex.test('A')).toBe(false);
        });
      });

      it('should match digits at positions 6, 7, 8', () => {
        const mask = maskFn({ value: 'D' }) as (RegExp | string)[];
        [6, 7, 8].forEach((pos) => {
          const regex = mask[pos] as RegExp;
          expect(regex).toBeInstanceOf(RegExp);
          for (let d = 0; d <= 9; d++) {
            expect(regex.test(String(d))).toBe(true);
          }
          expect(regex.test('A')).toBe(false);
        });
      });

      it('should match digits at positions 10 and 11', () => {
        const mask = maskFn({ value: 'D' }) as (RegExp | string)[];
        [10, 11].forEach((pos) => {
          const regex = mask[pos] as RegExp;
          expect(regex).toBeInstanceOf(RegExp);
          for (let d = 0; d <= 9; d++) {
            expect(regex.test(String(d))).toBe(true);
          }
          expect(regex.test('A')).toBe(false);
        });
      });

      it('should match allowed alphanumeric characters at position 12', () => {
        const mask = maskFn({ value: 'D' }) as (RegExp | string)[];
        const lastElement = mask[12] as RegExp;
        expect(lastElement).toBeInstanceOf(RegExp);

        const allowedLetters = 'ABCDEFGHJKLMNPQRTUVWXYZabcdefghjklmnpqrtuvwxyz';
        const allowedDigits = '0123456789';

        for (const char of allowedLetters + allowedDigits) {
          expect(lastElement.test(char)).toBe(true);
        }
      });

      it('should NOT match excluded letters at position 12 (I, O, S)', () => {
        const mask = maskFn({ value: 'D' }) as (RegExp | string)[];
        const lastElement = mask[12] as RegExp;

        // Letters excluded from the last position
        const excludedLetters = ['I', 'i'];
        for (const char of excludedLetters) {
          expect(lastElement.test(char)).toBe(false);
        }
      });
    });

    describe('mask structure', () => {
      it('should be a MaskitoOptions object with a mask function', () => {
        expect(bookingReferenceMask).toBeDefined();
        expect(typeof (bookingReferenceMask as MaskitoOptions).mask).toBe('function');
      });
    });
  });
});
