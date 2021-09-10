import { getNewTestStartTime, isValidStartDate } from '../test-start-time';

describe('Test Start Time helper functions', () => {

  describe('getNewTestStartTime', () => {
    it('should return the correct date', () => {
      const inputDate = '2021-01-19';
      const startDateTime = '2020-12-25T08:10:00';
      expect(getNewTestStartTime(inputDate, startDateTime)).toBe('2021-01-19T08:10:00');
    });
  });

  describe('isValidStartDate', () => {
    const currentDate = '2021-01-22';

    it('should return true when date is between current date and one year in the past', () => {
      const inputDate = '2020-11-19';
      expect(isValidStartDate(inputDate, currentDate)).toBe(true);
    });

    it('should return false when date is after current date', () => {
      const inputDate = '2021-10-22';
      expect(isValidStartDate(inputDate, currentDate)).toBe(false);
    });

    it('should return false when date is more than one year before current date', () => {
      const inputDate = '2020-01-21';
      expect(isValidStartDate(inputDate, currentDate)).toBe(false);
    });
  });
});
