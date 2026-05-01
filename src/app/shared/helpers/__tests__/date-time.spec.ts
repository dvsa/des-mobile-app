import { DateRange, DateTime, Duration } from '@shared/helpers/date-time';

describe('Date Time helper functions', () => {
  describe('isDuringDateRange', () => {
    it('should return true if the date is today', () => {
      const dateTime = new DateTime();
      expect(dateTime.isDuringDateRange(DateRange.TODAY)).toBe(true);
    });

    it('should return true if the date is within the last week', () => {
      const dateTime = new DateTime().subtract(3, Duration.DAY);
      expect(dateTime.isDuringDateRange(DateRange.WEEK)).toBe(true);
    });

    it('should return false if the date is outside the last week', () => {
      const dateTime = new DateTime().subtract(8, Duration.DAY);
      expect(dateTime.isDuringDateRange(DateRange.WEEK)).toBe(false);
    });

    it('should return true if the date is within the last fortnight', () => {
      const dateTime = new DateTime().subtract(10, Duration.DAY);
      expect(dateTime.isDuringDateRange(DateRange.FORTNIGHT)).toBe(true);
    });

    it('should return false if the date is outside the last fortnight', () => {
      const dateTime = new DateTime().subtract(15, Duration.DAY);
      expect(dateTime.isDuringDateRange(DateRange.FORTNIGHT)).toBe(false);
    });

    it('should return true if the date is within the last thirty days', () => {
      const dateTime = new DateTime().subtract(25, Duration.DAY);
      expect(dateTime.isDuringDateRange(DateRange.THIRTY_DAYS)).toBe(true);
    });

    it('should return false if the date is outside the last thirty days', () => {
      const dateTime = new DateTime().subtract(31, Duration.DAY);
      expect(dateTime.isDuringDateRange(DateRange.THIRTY_DAYS)).toBe(false);
    });

    it('should return true if the date is within the last ninety days', () => {
      const dateTime = new DateTime().subtract(45, Duration.DAY);
      expect(dateTime.isDuringDateRange(DateRange.NINETY_DAYS)).toBe(true);
    });

    it('should return false if the date is outside the last ninety days', () => {
      const dateTime = new DateTime().subtract(100, Duration.DAY);
      expect(dateTime.isDuringDateRange(DateRange.NINETY_DAYS)).toBe(false);
    });

    it('should return true if the date is within the last year', () => {
      const dateTime = new DateTime().subtract(6, Duration.MONTH);
      expect(dateTime.isDuringDateRange(DateRange.ONE_YEAR)).toBe(true);
    });

    it('should return false if the date is outside the last year', () => {
      const dateTime = new DateTime().subtract(13, Duration.MONTH);
      expect(dateTime.isDuringDateRange(DateRange.ONE_YEAR)).toBe(false);
    });

    it('should return true if the date is within the last eighteen months', () => {
      const dateTime = new DateTime().subtract(12, Duration.MONTH);
      expect(dateTime.isDuringDateRange(DateRange.EIGHTEEN_MONTHS)).toBe(true);
    });

    it('should return false if the date is outside the last eighteen months', () => {
      const dateTime = new DateTime().subtract(19, Duration.MONTH);
      expect(dateTime.isDuringDateRange(DateRange.EIGHTEEN_MONTHS)).toBe(false);
    });
  });
});
