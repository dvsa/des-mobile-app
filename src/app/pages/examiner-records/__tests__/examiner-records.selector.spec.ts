import {
  dateFilter,
  getBalanceQuestions,
  getCategories,
  getCircuits,
  getEligibleTests,
  getEmergencyStopCount,
  getIndependentDrivingStats,
  getIndex,
  getLocations, getManoeuvresUsed,
  getManoeuvreTypeLabels,
  getRouteNumbers,
  getSafetyQuestions,
  getShowMeQuestions,
  getStartedTestCount,
  getTellMeQuestions,
} from '@pages/examiner-records/examiner-records.selector';
import { ExaminerRecordModel } from '@dvsa/mes-microservice-common/domain/examiner-records';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import moment from 'moment';
import { ManoeuvreTypes } from '@store/tests/test-data/test-data.constants';
import { DateRange } from '@shared/helpers/date-time';

describe('examiner records selector', () => {
  const startedTests: ExaminerRecordModel[] = [
    {
      appRef: 1234567,
      testCategory: TestCategory.ADI2,
      testCentre: {
        centreId: 3,
        centreName: 'B',
        costCode: '000090909',
      },
      independentDriving: 'Sat nav',
      routeNumber: 3,
      startDate: moment(new Date(Date.now())).subtract(5, 'days').format('YYYY-MM-DD'),
    },
    {
      appRef: 1234567,
      testCategory: TestCategory.ADI2,
      testCentre: {
        centreId: 3,
        centreName: 'B',
        costCode: '000090909',
      },
      independentDriving: 'Sat nav',
      routeNumber: 2,
      startDate: moment(new Date(Date.now())).subtract(5, 'days').format('YYYY-MM-DD'),
    },
    {
      appRef: 1234567,
      testCategory: TestCategory.B,
      testCentre: {
        centreId: 3,
        centreName: 'B',
        costCode: '000090909',
      },
      showMeQuestions: [
        {
          outcome: 'P',
          description: 'Dipped headlights',
          code: 'S3'
        }
      ],
      tellMeQuestions: [
        {
          outcome: 'P',
          description: 'Headlights & tail lights',
          code: 'T5'
        }
      ],
      manoeuvres: [
        {'forwardPark': {'selected': true}}
      ],
      independentDriving: 'Sat nav',
      startDate: moment(new Date(Date.now())).subtract(5, 'days').format('YYYY-MM-DD'),
    },
    {
      appRef: 1234567,
      testCategory: TestCategory.B,
      testCentre: {
        centreId: 1,
        centreName: 'B',
        costCode: '000090909',
      },
      independentDriving: 'Sat nav',
      startDate: moment(new Date(Date.now())).subtract(5, 'days').format('YYYY-MM-DD'),
    },
    {
      appRef: 2345678,
      testCategory: TestCategory.B,
      testCentre: {
        centreId: 2,
        centreName: 'A',
        costCode: '000090909',
      },
      controlledStop: true,
      independentDriving: 'Sat nav',
      startDate: moment(new Date(Date.now())).subtract(10, 'days').format('YYYY-MM-DD'),
    },
    {
      appRef: 3456789,
      testCategory: TestCategory.B,
      testCentre: {
        centreName: 'B',
        centreId: 1,
        costCode: '000090909',
      },
      independentDriving: 'Traffic signs',
      startDate: moment(new Date(Date.now())).subtract(15, 'days').format('YYYY-MM-DD'),
    },
    {
      appRef: 1234567,
      testCategory: TestCategory.C,
      testCentre: {
        centreName: 'B',
        centreId: 1,
        costCode: '000090909',
      },
      independentDriving: 'Traffic signs',
      controlledStop: true,
      startDate: moment(new Date(Date.now())).subtract(5, 'days').format('YYYY-MM-DD'),
    },
    {
      appRef: 1234567,
      testCategory: TestCategory.C,
      testCentre: {
        centreName: 'B',
        centreId: 1,
        costCode: '000090909',
      },
      independentDriving: 'Traffic signs',
      startDate: moment(new Date(Date.now())).subtract(10, 'days').format('YYYY-MM-DD'),
    },
    {
      appRef: 1234567,
      testCategory: TestCategory.C,
      testCentre: {
        centreName: 'B',
        centreId: 1,
        costCode: '000090909',
      },
      independentDriving: 'Traffic signs',
      startDate: moment(new Date(Date.now())).subtract(15, 'days').format('YYYY-MM-DD'),
    },
    {
      appRef: 1234567,
      testCategory: TestCategory.EUAM2,
      testCentre: {
        centreName: 'B',
        centreId: 1,
        costCode: '000090909',
      },
      independentDriving: 'Diagram',
      safetyQuestions: [{
        code: 'M1',
        description: 'Oil level',
        outcome: 'P' }],
      balanceQuestions: [
        {
          code: 'B2',
          description: 'Carrying a passenger',
          outcome: 'P',
        }
      ],
      startDate: moment(new Date(Date.now())).subtract(15, 'days').format('YYYY-MM-DD'),
    },
    {
      appRef: 1234567,
      testCategory: TestCategory.EUAM1,
      testCentre: {
        centreName: 'B',
        centreId: 1,
        costCode: '000090909',
      },
      circuit: 'Left',
      startDate: moment(new Date(Date.now())).subtract(15, 'days').format('YYYY-MM-DD'),
    },
  ] as ExaminerRecordModel[];

  describe('dateFilter', () => {
    it('return true if provided examinerRecord is within specified date range', () => {
      expect(dateFilter(
        startedTests.filter((value) =>
          moment(new Date(value.startDate)) > moment(new Date(Date.now())).subtract(7, 'days')
        )[0], DateRange.WEEK)
      ).toEqual(true);
    });

    it('return false if provided examinerRecord is not within specified date range', () => {
      expect(
        dateFilter(
          startedTests.filter((value) =>
            moment(new Date(value.startDate)) < moment(new Date(Date.now())).subtract(7, 'days')
          )[0], DateRange.WEEK)
      ).toEqual(false);
    });
  });

  describe('getIndex', () => {
    it('should return string without letter prefix', () => {
      expect(getIndex('R10 - Route 10')).toEqual(10);
    });

    it('should return string without letter prefix', () => {
      expect(getIndex('R - Route')).toEqual(null);
    });
  });

  describe('getEligibleTests', () => {
    it('should retrieve 1 eligible test that is cat b within the last 2 weeks', () => {
      expect(getEligibleTests(startedTests, TestCategory.B, DateRange.WEEK, 1).length).toBe(1);
      expect(getEligibleTests(startedTests, TestCategory.B, DateRange.WEEK, 1)).toEqual([
        {
          appRef: 1234567,
          testCategory: TestCategory.B,
          testCentre: {
            centreName: 'B',
            centreId: 1,
            costCode: '000090909',
          },
          independentDriving: 'Sat nav',
          startDate: moment(new Date(Date.now())).subtract(5, 'days').format('YYYY-MM-DD'),
        },
      ]);
    });

    it('should retrieve 2 eligible tests that is cat c within the last month', () => {
      expect(getEligibleTests(startedTests, TestCategory.C, DateRange.FORTNIGHT, 1).length).toBe(2);
      expect(getEligibleTests(startedTests, TestCategory.C, DateRange.FORTNIGHT, 1)).toEqual([
        {
          appRef: 1234567,
          testCategory: TestCategory.C,
          testCentre: {
            centreName: 'B',
            centreId: 1,
            costCode: '000090909',
          },
          independentDriving: 'Traffic signs',
          controlledStop: true,
          startDate: moment(new Date(Date.now())).subtract(5, 'days').format('YYYY-MM-DD'),
        },
        {
          appRef: 1234567,
          testCategory: TestCategory.C,
          testCentre: {
            centreName: 'B',
            centreId: 1,
            costCode: '000090909',
          },
          independentDriving: 'Traffic signs',
          startDate: moment(new Date(Date.now())).subtract(10, 'days').format('YYYY-MM-DD'),
        },
      ]);
    });

    it('should retrieve 7 eligible tests that are within test centre 1', () => {
      expect(getEligibleTests(startedTests, TestCategory.C, DateRange.EIGHTEEN_MONTHS, 1, true, false).length).toBe(7);
      expect(getEligibleTests(startedTests, TestCategory.C, DateRange.EIGHTEEN_MONTHS, 1, true, false)).toEqual([
        {
          appRef: 1234567,
          testCategory: TestCategory.B,
          testCentre: {
            centreName: 'B',
            centreId: 1,
            costCode: '000090909',
          },
          independentDriving: 'Sat nav',
          startDate: moment(new Date(Date.now())).subtract(5, 'days').format('YYYY-MM-DD'),
        },
        {
          appRef: 3456789,
          testCategory: TestCategory.B,
          testCentre: {
            centreName: 'B',
            centreId: 1,
            costCode: '000090909',
          },
          independentDriving: 'Traffic signs',
          startDate: moment(new Date(Date.now())).subtract(15, 'days').format('YYYY-MM-DD'),
        },
        {
          appRef: 1234567,
          testCategory: TestCategory.C,
          testCentre: {
            centreName: 'B',
            centreId: 1,
            costCode: '000090909',
          },
          independentDriving: 'Traffic signs',
          controlledStop: true,
          startDate: moment(new Date(Date.now())).subtract(5, 'days').format('YYYY-MM-DD'),
        },
        {
          appRef: 1234567,
          testCategory: TestCategory.C,
          testCentre: {
            centreName: 'B',
            centreId: 1,
            costCode: '000090909',
          },
          independentDriving: 'Traffic signs',
          startDate: moment(new Date(Date.now())).subtract(10, 'days').format('YYYY-MM-DD'),
        },
        {
          appRef: 1234567,
          testCategory: TestCategory.C,
          testCentre: {
            centreName: 'B',
            centreId: 1,
            costCode: '000090909',
          },
          independentDriving: 'Traffic signs',
          startDate: moment(new Date(Date.now())).subtract(15, 'days').format('YYYY-MM-DD'),
        },
        {
          appRef: 1234567,
          testCategory: TestCategory.EUAM2,
          testCentre: {
            centreName: 'B',
            centreId: 1,
            costCode: '000090909',
          },
          safetyQuestions: [
            {
              code: 'M1',
              description: 'Oil level',
              outcome: 'P'
            }
          ],
          balanceQuestions: [
            {
              code: 'B2',
              description: 'Carrying a passenger',
              outcome: 'P',
            }
          ],
          independentDriving: 'Diagram',
          startDate: moment(new Date(Date.now())).subtract(15, 'days').format('YYYY-MM-DD'),
        },
        {
          appRef: 1234567,
          testCategory: TestCategory.EUAM1,
          testCentre: { centreName: 'B', centreId: 1, costCode: '000090909' },
          circuit: 'Left',
          startDate: moment(new Date(Date.now())).subtract(15, 'days').format('YYYY-MM-DD'),
        },
      ]);
    });
  });

  describe('getEmergencyStopCount', () => {
    it('should return the amount of tests that contain an emergency stop', () => {
      expect(getEmergencyStopCount(startedTests)).toEqual(2);
    });
  });

  describe('getLocations', () => {
    it('should return an array of all the locations in the passed tests with the amount of times they appear,' +
      'ordered alphabetically', () => {
      expect(getLocations(startedTests)).toEqual([
        { item: { centreName: 'A', centreId: 2, costCode: '000090909' }, count: 1 },
        { item: { centreName: 'B', centreId: 1, costCode: '000090909' }, count: 7 },
        { item: { centreId: 3, centreName: 'B', costCode: '000090909' }, count: 3 }
      ]);
    });
  });

  describe('getIndependentDrivingStats', () => {
    it('should return an array of all the all instances of Traffic Signs and Sat Nav in the passed tests ' +
      'with the amount of times they appear, ordered by Index number if the category is B', () => {
      expect(
        getIndependentDrivingStats(
          startedTests.filter(value => value.testCategory == TestCategory.B), TestCategory.B),
      ).toEqual([
        { item: 'I1 - Traffic signs', count: 1, percentage: '25.0%' },
        { item: 'I2 - Sat nav', count: 3, percentage: '75.0%' },
      ]);
    });
    it('should return an array of all the all instances of Traffic Signs and Diagram in the passed tests ' +
      'with the amount of times they appear, ordered by Index number if the test is a bike test', () => {
      expect(
        getIndependentDrivingStats(
          startedTests.filter(value => value.testCategory == TestCategory.EUAM2), TestCategory.EUAM2),
      ).toEqual([
        { item: 'I1 - Traffic signs', count: 0, percentage: '0.0%' },
        { item: 'I2 - Diagram', count: 1, percentage: '100.0%' },
      ]);
    });
    it('should return an empty array if the passed category is F, regardless of the content of startedTests', () => {
      expect(
        getIndependentDrivingStats(
          startedTests.filter(value => value.testCategory == TestCategory.EUAM2), TestCategory.F),
      ).toEqual([]);
    });
  });

  describe('getCircuits', () => {
    it('should return an array of all the instances of Left and Right in the passed tests ' +
      'with the amount of times they appear, ordered by Index number if the category is Mod 1', () => {
      expect(
        getCircuits(
          startedTests.filter(value => value.testCategory == TestCategory.EUAM1), TestCategory.EUAM1),
      ).toEqual([
        { item: 'C1 - Left', count: 1, percentage: '100.0%' },
        { item: 'C2 - Right', count: 0, percentage: '0.0%' },
      ]);
    });
    it('should return an empty array if the passed category is not mod 1, ' +
      'regardless of the content of startedTests', () => {
      expect(
        getCircuits(
          startedTests.filter(value => value.testCategory == TestCategory.B), TestCategory.B),
      ).toEqual([]);
    });
  });

  describe('getCategories', () => {
    it('should return an array of all the categories in the passed tests with the amount of times they appear,' +
      'ordered alphabetically', () => {
      expect(getCategories(startedTests, null, null, 1)).toEqual([
        { item: TestCategory.B, count: 2 },
        { item: TestCategory.C, count: 3 },
        { item: TestCategory.EUAM1, count: 1 },
        { item: TestCategory.EUAM2, count: 1 }
      ]);
    });
  });

  describe('getStartedTestCount', () => {
    it('should return the number of entries in the startedTests array', () => {
      expect(getStartedTestCount(startedTests)).toEqual(11);
    });
  });

  describe('getRouteNumbers', () => {
    it('should return a list of all route numbers within started tests and the number of times they appear,' +
      'ordered by index', () => {
      expect(
        getRouteNumbers(
          startedTests.filter(value => value.testCategory == TestCategory.ADI2)),
      ).toEqual([
        { item: 'R2 - Route 2', count:   1, percentage: '50.0%' },
        { item: 'R3 - Route 3', count: 1, percentage: '50.0%' }
      ]);
    });
  });

  describe('getSafetyQuestions', () => {
    it('should return a list of all possible safety questions and the amount of times they appear, ' +
      'ordered by index', () => {
      expect(
        getSafetyQuestions(
          startedTests.filter(value => value.testCategory == TestCategory.EUAM2), TestCategory.EUAM2),
      ).toEqual([
        { item: 'M1 - Oil level', count: 1, percentage: '100.0%' },
        { item: 'M2 - Horn working', count: 0, percentage: '0.0%' },
        { item: 'M3 - Brake fluid', count: 0, percentage: '0.0%' },
        { item: 'M4 - Lights', count: 0, percentage: '0.0%' },
        { item: 'M5 - Brake lights', count: 0, percentage: '0.0%' },
        { item: 'M6 - Chain', count: 0, percentage: '0.0%' },
        { item: 'M7 - Steering', count: 0, percentage: '0.0%' },
        { item: 'M8 - Tyres', count: 0, percentage: '0.0%' },
        { item: 'M9 - Front brake', count: 0, percentage: '0.0%' },
        { item: 'M10 - Brakes', count: 0, percentage: '0.0%' },
        { item: 'M11 - Engine cut out switch', count: 0, percentage: '0.0%' },
        { item: 'M12 - Fog light', count: 0, percentage: '0.0%' },
        { item: 'M13 - Dipped / main beam', count: 0, percentage: '0.0%' }
      ]);
    });
  });

  describe('getBalanceQuestions', () => {
    it('should return a list of all possible balance questions and the amount of times they appear, ' +
      'ordered by index', () => {
      expect(
        getBalanceQuestions(
          startedTests.filter(value => value.testCategory == TestCategory.EUAM2), TestCategory.EUAM2),
      ).toEqual([
        { item: 'B1 - Pillion passenger problems', count: 0, percentage: '0.0%' },
        { item: 'B2 - Carrying a passenger', count: 1, percentage: '100.0%' },
        { item: 'B3 - Balance with passenger', count: 0, percentage: '0.0%' },
      ]);
    });
  });

  describe('getShowMeQuestions', () => {
    it('should return a list of all possible show me questions and the amount of times they appear, ' +
      'ordered by index', () => {
      expect(
        getShowMeQuestions(
          startedTests.filter(value => value.testCategory == TestCategory.B), TestCategory.B),
      ).toEqual([
        { item: 'S1 - Rear windscreen', count: 0, percentage: '0.0%' },
        { item: 'S2 - Front windscreen', count: 0, percentage: '0.0%' },
        { item: 'S3 - Dipped headlights', count: 1, percentage: '100.0%' },
        { item: 'S4 - Rear demister', count: 0, percentage: '0.0%' },
        { item: 'S5 - Horn', count: 0, percentage: '0.0%' },
        { item: 'S6 - Demist front windscreen', count: 0, percentage: '0.0%' },
        { item: 'S7 - Side window', count: 0, percentage: '0.0%' }
      ]);
    });
  });

  describe('getTellMeQuestions', () => {
    it('should return a list of all possible tell me questions and the amount of times they appear, ' +
      'ordered by index', () => {
      expect(
        getTellMeQuestions(
          startedTests.filter(value => value.testCategory == TestCategory.B), TestCategory.B),
      ).toEqual([
        { item: 'T1 - Brakes', count: 0, percentage: '0.0%' },
        { item: 'T2 - Tyre pressures', count: 0, percentage: '0.0%' },
        { item: 'T3 - Head restraint', count: 0, percentage: '0.0%' },
        { item: 'T4 - Sufficient tread', count: 0, percentage: '0.0%' },
        { item: 'T5 - Headlights & tail lights', count: 1, percentage: '100.0%' },
        { item: 'T6 - Antilock braking system', count: 0, percentage: '0.0%' },
        { item: 'T7 - Direction indicators', count: 0, percentage: '0.0%' },
        { item: 'T8 - Brake lights', count: 0, percentage: '0.0%' },
        { item: 'T9 - Power assisted steering', count: 0, percentage: '0.0%' },
        { item: 'T10 - Rear fog light(s)', count: 0, percentage: '0.0%' },
        { item: 'T11 - Dipped to main beam', count: 0, percentage: '0.0%' },
        { item: 'T12 - Engine has sufficient oil', count: 0, percentage: '0.0%' },
        { item: 'T13 - Engine coolant', count: 0, percentage: '0.0%' },
        { item: 'T14 - Brake fluid', count: 0, percentage: '0.0%' }
      ]);
    });
  });

  describe('getManoeuvreTypeLabels', () => {
    it('should return a list of relevant manoeuvre labels for cat B if type is not included', () => {
      expect(
        getManoeuvreTypeLabels(
          TestCategory.B),
      ).toEqual({
        reverseRight: 'Reverse right',
        reverseParkRoad: 'Reverse park (road)',
        reverseParkCarpark: 'Reverse park (car park)',
        forwardPark: 'Forward park'
      });
    });
    it('should return the string value for the manoeuvre from the list of relevant manoeuvres for the category', () => {
      expect(
        getManoeuvreTypeLabels(
          TestCategory.B, ManoeuvreTypes.reverseRight),
      ).toEqual('Reverse right');
    });
    it('should return a list of relevant manoeuvre labels for cat BE if type is not included', () => {
      expect(
        getManoeuvreTypeLabels(
          TestCategory.BE),
      ).toEqual({
        reverseLeft: 'Reverse'
      });
    });
    it('should return the string value for the manoeuvre from the list of relevant manoeuvres for the category', () => {
      expect(
        getManoeuvreTypeLabels(
          TestCategory.BE, ManoeuvreTypes.reverseLeft),
      ).toEqual('Reverse');
    });
    it('should return a list of relevant manoeuvre labels for cat ADI2 if type is not included', () => {
      expect(
        getManoeuvreTypeLabels(
          TestCategory.ADI2),
      ).toEqual({
        reverseRight: 'Reverse right',
        reverseParkRoad: 'Reverse park (road)',
        reverseParkCarpark: 'Reverse park (car park)',
        forwardPark: 'Forward park'
      });
    });
    it('should return the string value for the manoeuvre from the list of relevant manoeuvres for the category', () => {
      expect(
        getManoeuvreTypeLabels(
          TestCategory.ADI2, ManoeuvreTypes.reverseRight),
      ).toEqual('Reverse right');
    });
    it('should return an empty object if an invalid category is passed', () => {
      expect(
        getManoeuvreTypeLabels(
          TestCategory.ADI3),
      ).toEqual({});
    });
  });

  describe('getManoeuvresUsed', () => {
    it('should return a list all manoeuvres available for that category and the amount of times they appear, ' +
      'ordered by index', () => {
      expect(
        getManoeuvresUsed(
          startedTests.filter(value => value.testCategory == TestCategory.B), TestCategory.B)
      ).toEqual([
        { item: 'E1 - Reverse right', count: 0, percentage: '0.0%' },
        { item: 'E2 - Reverse park (road)', count: 0, percentage: '0.0%' },
        { item: 'E3 - Reverse park (car park)', count: 0, percentage: '0.0%' },
        { item: 'E4 - Forward park', count: 1, percentage: '100.0%' }
      ]);
    });
    it('should return an empty array if passed a category with no manoeuvres', () => {
      expect(
        getManoeuvresUsed(
          startedTests.filter(value => value.testCategory == TestCategory.ADI3), TestCategory.ADI3)
      ).toEqual([
      ]);
    });
  });
});
