import { DateRange, DateTime } from '@shared/helpers/date-time';

describe('Date Time helper functions', () => {
  describe('isDuringDateRange', () => {
    it('should return true if the date is today', () => {
      const dateTime = new DateTime();
      expect(dateTime.isDuringDateRange(DateRange.TODAY)).toBe(true);
    });

    it('should return true if the date is within the last week', () => {
      const dateTime = new DateTime().subtract(3, 'days');
      expect(dateTime.isDuringDateRange(DateRange.WEEK)).toBe(true);
    });

    it('should return false if the date is outside the last week', () => {
      const dateTime = new DateTime().subtract(8, 'days');
      expect(dateTime.isDuringDateRange(DateRange.WEEK)).toBe(false);
    });

    it('should return true if the date is within the last fortnight', () => {
      const dateTime = new DateTime().subtract(10, 'days');
      expect(dateTime.isDuringDateRange(DateRange.FORTNIGHT)).toBe(true);
    });

    it('should return false if the date is outside the last fortnight', () => {
      const dateTime = new DateTime().subtract(15, 'days');
      expect(dateTime.isDuringDateRange(DateRange.FORTNIGHT)).toBe(false);
    });

    it('should return true if the date is within the last ninety days', () => {
      const dateTime = new DateTime().subtract(45, 'days');
      expect(dateTime.isDuringDateRange(DateRange.NINETY_DAYS)).toBe(true);
    });

    it('should return false if the date is outside the last ninety days', () => {
      const dateTime = new DateTime().subtract(100, 'days');
      expect(dateTime.isDuringDateRange(DateRange.NINETY_DAYS)).toBe(false);
    });

    it('should return true if the date is within the last year', () => {
      const dateTime = new DateTime().subtract(6, 'months');
      expect(dateTime.isDuringDateRange(DateRange.ONE_YEAR)).toBe(true);
    });

    it('should return false if the date is outside the last year', () => {
      const dateTime = new DateTime().subtract(13, 'months');
      expect(dateTime.isDuringDateRange(DateRange.ONE_YEAR)).toBe(false);
    });

    it('should return true if the date is within the last eighteen months', () => {
      const dateTime = new DateTime().subtract(12, 'months');
      expect(dateTime.isDuringDateRange(DateRange.EIGHTEEN_MONTHS)).toBe(true);
    });

    it('should return false if the date is outside the last eighteen months', () => {
      const dateTime = new DateTime().subtract(19, 'months');
      expect(dateTime.isDuringDateRange(DateRange.EIGHTEEN_MONTHS)).toBe(false);
    });
  });
});
