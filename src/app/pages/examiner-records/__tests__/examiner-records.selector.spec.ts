import { getEligibleTests } from '@pages/examiner-records/examiner-records.selector';
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
      startDate: moment(new Date(Date.now())).subtract(5, 'days').toString(),
    },
    {
      appRef: 2345678,
      testCategory: TestCategory.B,
      testCentre: {
        centreId: 2,
        costCode: '000090909'
      },
      startDate: moment(new Date(Date.now())).subtract(10, 'days').toString()
    },
    {
      appRef: 3456789,
      testCategory: TestCategory.B,
      testCentre: {
        centreId: 1,
        costCode: '000090909'
      },
      startDate: moment(new Date(Date.now())).subtract(15, 'days').toString()
    },
    {
      appRef: 1234567,
      testCategory: TestCategory.C,
      testCentre: {
        centreId: 1,
        costCode: '000090909'
      },
      startDate: moment(new Date(Date.now())).subtract(5, 'days').toString()
    },
    {
      appRef: 1234567,
      testCategory: TestCategory.C,
      testCentre: {
        centreId: 1,
        costCode: '000090909'
      },
      startDate: moment(new Date(Date.now())).subtract(10, 'days').toString()
    },
    {
      appRef: 1234567,
      testCategory: TestCategory.C,
      testCentre: {
        centreId: 1,
        costCode: '000090909'
      },
      startDate: moment(new Date(Date.now())).subtract(15, 'days').toString()
    },
  ] as ExaminerRecordModel[];

  describe('getEligibleTests', () => {
    it('should retrieve 1 eligible test that is cat b within the last 2 weeks', () => {
      expect(getEligibleTests(startedTests, TestCategory.B, 'week', 1).length).toBe(1);
    });

    it('should retrieve 2 eligible tests that is cat c within the last month', () => {
      expect(getEligibleTests(startedTests, TestCategory.C, 'fortnight', 1).length).toBe(2);
    });
  });
});
