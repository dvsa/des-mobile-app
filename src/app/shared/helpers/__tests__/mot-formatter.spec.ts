import { getMakeAndModel, hasMakeOrModel } from '../mot-formatter';

describe('MotFormatter', () => {
  describe('hasMakeOrModel', () => {
    it('returns true when both vehicle make and model are present', () => {
      expect(hasMakeOrModel('Ford', 'Focus')).toBe(true);
    });

    it('returns true when only the vehicle make is present', () => {
      expect(hasMakeOrModel('Ford', undefined)).toBe(true);
    });

    it('returns true when only the vehicle model is present', () => {
      expect(hasMakeOrModel(undefined, 'Focus')).toBe(true);
    });

    it('returns false when both values are undefined', () => {
      expect(hasMakeOrModel(undefined, undefined)).toBe(false);
    });

    it('returns false when both values are empty or whitespace only', () => {
      expect(hasMakeOrModel('', '   ')).toBe(false);
      expect(hasMakeOrModel('  ', '')).toBe(false);
    });
  });

  describe('getMakeAndModel', () => {
    it('returns the make and model together when both values are present', () => {
      expect(getMakeAndModel('Ford', 'Focus')).toBe('Ford Focus');
    });

    it('returns the make with a fallback model label when the model is missing', () => {
      expect(getMakeAndModel('Ford', undefined)).toBe('Ford Not found');
    });

    it('returns the model with a fallback make label when the make is missing', () => {
      expect(getMakeAndModel(undefined, 'Focus')).toBe('Not found Focus');
    });

    it('returns not found when both values are missing', () => {
      expect(getMakeAndModel(undefined, undefined)).toBe('Not found');
    });

    it('trims surrounding whitespace before building the value', () => {
      expect(getMakeAndModel('  Ford  ', '  Focus  ')).toBe('Ford Focus');
      expect(getMakeAndModel('   ', ' Focus ')).toBe('Not found Focus');
    });

    it('returns not found when both values are empty or whitespace only', () => {
      expect(getMakeAndModel('', '   ')).toBe('Not found');
      expect(getMakeAndModel('  ', '')).toBe('Not found');
    });
  });
});
