import {
  dateFilter,
  getEligibleTests,
  getEmergencyStopCount,
  getIndex,
} from '@pages/examiner-records/examiner-records.selector';
import { ExaminerRecordModel } from '@dvsa/mes-microservice-common/domain/examiner-records';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import moment from 'moment';

describe('examiner records selector', () => {
  const startedTests: ExaminerRecordModel[] = [
    {
      appRef: 1234567,
      testCategory: TestCategory.B,
      testCentre: {
        centreId: 1,
        costCode: '000090909'
      },
      startDate: moment(new Date(Date.now())).subtract(5, 'days').format('YYYY-MM-DD')
    },
    {
      appRef: 2345678,
      testCategory: TestCategory.B,
      testCentre: {
        centreId: 2,
        costCode: '000090909'
      },
      controlledStop: true,
      startDate: moment(new Date(Date.now())).subtract(10, 'days').format('YYYY-MM-DD')
    },
    {
      appRef: 3456789,
      testCategory: TestCategory.B,
      testCentre: {
        centreId: 1,
        costCode: '000090909'
      },
      startDate: moment(new Date(Date.now())).subtract(15, 'days').format('YYYY-MM-DD')
    },
    {
      appRef: 1234567,
      testCategory: TestCategory.C,
      testCentre: {
        centreId: 1,
        costCode: '000090909'
      },
      controlledStop: true,
      startDate: moment(new Date(Date.now())).subtract(5, 'days').format('YYYY-MM-DD')
    },
    {
      appRef: 1234567,
      testCategory: TestCategory.C,
      testCentre: {
        centreId: 1,
        costCode: '000090909'
      },
      startDate: moment(new Date(Date.now())).subtract(10, 'days').format('YYYY-MM-DD')
    },
    {
      appRef: 1234567,
      testCategory: TestCategory.C,
      testCentre: {
        centreId: 1,
        costCode: '000090909'
      },
      startDate: moment(new Date(Date.now())).subtract(15, 'days').format('YYYY-MM-DD')
    },
  ] as ExaminerRecordModel[];

  describe('dateFilter', () => {
    it('return true if provided examinerRecord is within specified date range', () => {
      expect(dateFilter(startedTests[0], 'week')).toEqual(true);
    });

    it('return false if provided examinerRecord is not within specified date range', () => {
      expect(dateFilter(startedTests[1], 'week')).toEqual(false);
    });
  });

  describe('getIndex', () => {
    it('should return string without letterprefix', () => {
      expect(getIndex('R10 - Route 10')).toEqual(10);
    });

    it('should return string without letterprefix', () => {
      expect(getIndex('R - Route')).toEqual(null);
    });
  });

  describe('getEligibleTests', () => {
    it('should retrieve 1 eligible test that is cat b within the last 2 weeks', () => {
      expect(getEligibleTests(startedTests, TestCategory.B, 'week', 1).length).toBe(1);
      expect(getEligibleTests(startedTests, TestCategory.B, 'week', 1)).toEqual([
        {
          appRef: 1234567,
          testCategory: TestCategory.B,
          testCentre: {
            centreId: 1,
            costCode: '000090909'
          },
          startDate: moment(new Date(Date.now())).subtract(5, 'days').format('YYYY-MM-DD')
        }
      ]);
    });

    it('should retrieve 2 eligible tests that is cat c within the last month', () => {
      expect(getEligibleTests(startedTests, TestCategory.C, 'fortnight', 1).length).toBe(2);
      expect(getEligibleTests(startedTests, TestCategory.C, 'fortnight', 1)).toEqual([
        {
          appRef: 1234567,
          testCategory: TestCategory.C,
          testCentre: {
            centreId: 1,
            costCode: '000090909'
          },
          controlledStop: true,
          startDate: moment(new Date(Date.now())).subtract(5, 'days').format('YYYY-MM-DD')
        },
        {
          appRef: 1234567,
          testCategory: TestCategory.C,
          testCentre: {
            centreId: 1,
            costCode: '000090909'
          },
          startDate: moment(new Date(Date.now())).subtract(10, 'days').format('YYYY-MM-DD')
        },
      ]);
    });

    it('should retrieve 4 eligible tests that are within test centre 1', () => {
      expect(getEligibleTests(startedTests, TestCategory.C, '2 years', 1, true, false).length).toBe(5);
      expect(getEligibleTests(startedTests, TestCategory.C, '2 years', 1, true, false)).toEqual([
        {
          appRef: 1234567,
          testCategory: TestCategory.B,
          testCentre: {
            centreId: 1,
            costCode: '000090909'
          },
          startDate: moment(new Date(Date.now())).subtract(5, 'days').format('YYYY-MM-DD')
        },
        {
          appRef: 3456789,
          testCategory: TestCategory.B,
          testCentre: {
            centreId: 1,
            costCode: '000090909'
          },
          startDate: moment(new Date(Date.now())).subtract(15, 'days').format('YYYY-MM-DD')
        },
        {
          appRef: 1234567,
          testCategory: TestCategory.C,
          testCentre: {
            centreId: 1,
            costCode: '000090909'
          },
          controlledStop: true,
          startDate: moment(new Date(Date.now())).subtract(5, 'days').format('YYYY-MM-DD')
        },
        {
          appRef: 1234567,
          testCategory: TestCategory.C,
          testCentre: {
            centreId: 1,
            costCode: '000090909'
          },
          startDate: moment(new Date(Date.now())).subtract(10, 'days').format('YYYY-MM-DD')
        },
        {
          appRef: 1234567,
          testCategory: TestCategory.C,
          testCentre: {
            centreId: 1,
            costCode: '000090909'
          },
          startDate: moment(new Date(Date.now())).subtract(15, 'days').format('YYYY-MM-DD')
        }
      ]);
    });
  });

  fdescribe('getEmergencyStopCount', () => {
    it('should return the amount of tests that contain an emergency stop', () => {
      expect(getEmergencyStopCount(startedTests)).toEqual(2);
    });
  });
});
