import { TestBed } from '@angular/core/testing';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';

import { of } from 'rxjs';
import { ActivityCodes } from '@shared/models/activity-codes';
import { TestResultProviderMock } from '@providers/test-result/__mocks__/test-result.mock';
import { TestResultProvider } from '../../test-result/test-result';
import { ActivityCodeFinalisationProvider } from '../activity-code-finalisation';

describe('ActivityCodeFinalisationProvider', () => {
  let testResultProvider: TestResultProvider;
  let activityCodeFinalisationProvider: ActivityCodeFinalisationProvider;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ActivityCodeFinalisationProvider,
        {
          provide: TestResultProvider,
          useClass: TestResultProviderMock,
        },
      ],
    });

    testResultProvider = TestBed.inject(TestResultProvider);
    activityCodeFinalisationProvider = TestBed.inject(ActivityCodeFinalisationProvider);
  });

  describe('Check if test data for different categories are invalid', () => {
    beforeEach(() => {
      spyOn(testResultProvider, 'calculateTestResult')
        .and
        .returnValue(of(ActivityCodes.PASS));
    });

    it('should call testResultProvider with the correct category for B', async () => {
      await activityCodeFinalisationProvider.catBTestDataIsInvalid(
        ActivityCodes.FAIL_PUBLIC_SAFETY, {}, TestCategory.B,
      );
      expect(testResultProvider.calculateTestResult)
        .toHaveBeenCalledWith(TestCategory.B, {});
    });

    it('should call testResultProvider with the correct category for C', async () => {
      await activityCodeFinalisationProvider.catCTestDataIsInvalid(
        ActivityCodes.FAIL_CANDIDATE_STOPS_TEST, {}, TestCategory.C,
      );
      expect(testResultProvider.calculateTestResult)
        .toHaveBeenCalledWith(TestCategory.C, {});
    });

    it('should call testResultProvider with the correct category for CE', async () => {
      await activityCodeFinalisationProvider.catCTestDataIsInvalid(
        ActivityCodes.FAIL_CANDIDATE_STOPS_TEST, {}, TestCategory.CE,
      );
      expect(testResultProvider.calculateTestResult)
        .toHaveBeenCalledWith(TestCategory.CE, {});
    });

    it('should call testResultProvider with the correct category for CM', async () => {
      await activityCodeFinalisationProvider.catManoeuvresTestDataIsInvalid(
        ActivityCodes.FAIL_CANDIDATE_STOPS_TEST, {}, TestCategory.CM,
      );
      expect(testResultProvider.calculateTestResult)
        .toHaveBeenCalledWith(TestCategory.CM, {});
    });

    it('should call testResultProvider with the correct category for AM1', async () => {
      await activityCodeFinalisationProvider.catAMod1TestDataIsInvalid(
        ActivityCodes.FAIL_PUBLIC_SAFETY,
        {},
        TestCategory.EUAM1,
      );
      expect(testResultProvider.calculateTestResult)
        .toHaveBeenCalledWith(TestCategory.EUAM1, {});
    });

    it('should call testResultProvider with the correct category for AM2', async () => {
      await activityCodeFinalisationProvider.catAMod2TestDataIsInvalid(
        ActivityCodes.FAIL_PUBLIC_SAFETY,
        {},
        TestCategory.EUAM2,
      );
      expect(testResultProvider.calculateTestResult)
        .toHaveBeenCalledWith(TestCategory.EUAM2, {});
    });

    it('should call testResultProvider with the correct category for ADI2', async () => {
      await activityCodeFinalisationProvider.catADIPart2TestDataIsInvalid(
        ActivityCodes.FAIL_CANDIDATE_STOPS_TEST,
        {},
        TestCategory.ADI2,
      );
      expect(testResultProvider.calculateTestResult)
        .toHaveBeenCalledWith(TestCategory.ADI2, {});
    });

    it('should call testResultProvider with the correct category for Home', async () => {
      await activityCodeFinalisationProvider.catHomeTestDataIsInvalid(
        ActivityCodes.FAIL_PUBLIC_SAFETY,
        {},
        TestCategory.F,
      );
      expect(testResultProvider.calculateTestResult)
        .toHaveBeenCalledWith(TestCategory.F, {});
    });
  });

  describe('activityCodeIs4or5', () => {
    beforeEach(() => {
      spyOn(testResultProvider, 'calculateTestResult')
        .and
        .returnValue(of(ActivityCodes.PASS));
    });
    it('should return false when activity code is not 4/5 for Home', async () => {
      const result = await activityCodeFinalisationProvider.catHomeTestDataIsInvalid(
        ActivityCodes.BAD_LIGHT,
        {},
        TestCategory.K,
      );
      expect(result)
        .toBe(false);
    });
    it('should return false when activity code is not 4/5 for B', async () => {
      const result = await activityCodeFinalisationProvider.catBTestDataIsInvalid(ActivityCodes.ACCIDENT,
        {},
        TestCategory.B);
      expect(result)
        .toBe(false);
    });
    it('should return false when activity code is not 4/5 for C', async () => {
      const result = await activityCodeFinalisationProvider
        .catCTestDataIsInvalid(ActivityCodes.EXAMINER_ILL_PRE_TEST, {}, TestCategory.C);
      expect(result)
        .toBe(false);
    });
    it('should return false when activity code is not 4/5 for D', async () => {
      const result = await activityCodeFinalisationProvider.catDTestDataIsInvalid(
        ActivityCodes.CANDIDATE_PREGNANT,
        {},
        TestCategory.D,
      );
      expect(result)
        .toBe(false);
    });
    it('should return false when activity code is not 4/5 for AMod1', async () => {
      const result = await activityCodeFinalisationProvider
        .catAMod1TestDataIsInvalid(
          ActivityCodes.CANDIDATE_REFUSED_TO_SIGN_RESIDENCY_DECLARATION,
          {},
          TestCategory.EUA1M1,
        );
      expect(result)
        .toBe(false);
    });
    it('should return false when activity code is not 4/5 for AMod2', async () => {
      const result = await activityCodeFinalisationProvider
        .catAMod2TestDataIsInvalid(
          ActivityCodes.ILLEGAL_ACTIVITY_FROM_CANDIDATE,
          {},
          TestCategory.EUA1M2,
        );
      expect(result)
        .toBe(false);
    });
    it('should return false when activity code is not 4/5 for ADI2', async () => {
      const result = await activityCodeFinalisationProvider.catADIPart2TestDataIsInvalid(ActivityCodes.BAD_LIGHT,
        {},
        TestCategory.ADI2);
      expect(result)
        .toBe(false);
    });
  });

  describe('testDataIsInvalid', () => {
    it('should return catADIPart2TestDataIsInvalid if category is ADI2', async () => {
      spyOn(activityCodeFinalisationProvider, 'catADIPart2TestDataIsInvalid')
        .and
        .returnValue(Promise.resolve(true));
      expect(await activityCodeFinalisationProvider.testDataIsInvalid(TestCategory.ADI2, null, null))
        .toEqual(true);
    });
    [
      TestCategory.ADI3,
      TestCategory.SC,
    ].forEach((value) => {
      it(`should return catADIPart3TestDataIsInvalid if category is ${value}`, async () => {
        spyOn(activityCodeFinalisationProvider, 'catADIPart3TestDataIsInvalid')
          .and
          .returnValue(Promise.resolve(true));
        expect(await activityCodeFinalisationProvider.testDataIsInvalid(value, null, null))
          .toEqual(true);
      });
    });
    it('should return catBTestDataIsInvalid if category is B', async () => {
      spyOn(activityCodeFinalisationProvider, 'catBTestDataIsInvalid')
        .and
        .returnValue(Promise.resolve(true));
      expect(await activityCodeFinalisationProvider.testDataIsInvalid(TestCategory.B, null, null))
        .toEqual(true);
    });
    [
      TestCategory.C1,
      TestCategory.C1E,
      TestCategory.CE,
      TestCategory.C,
    ].forEach((value) => {
      it(`should return catCTestDataIsInvalid if category is ${value}`, async () => {
        spyOn(activityCodeFinalisationProvider, 'catCTestDataIsInvalid')
          .and
          .returnValue(Promise.resolve(true));
        expect(await activityCodeFinalisationProvider.testDataIsInvalid(value, null, null))
          .toEqual(true);
      });
    });
    [
      TestCategory.C1M,
      TestCategory.C1EM,
      TestCategory.CEM,
      TestCategory.CM,
      TestCategory.D1M,
      TestCategory.D1EM,
      TestCategory.DEM,
      TestCategory.DM,
    ].forEach((value) => {
      it(`should return catManoeuvresTestDataIsInvalid if category is ${value}`, async () => {
        spyOn(activityCodeFinalisationProvider, 'catManoeuvresTestDataIsInvalid')
          .and
          .returnValue(Promise.resolve(true));
        expect(await activityCodeFinalisationProvider.testDataIsInvalid(value, null, null))
          .toEqual(true);
      });
    });
    [
      TestCategory.D1,
      TestCategory.D1E,
      TestCategory.DE,
      TestCategory.D,
    ].forEach((value) => {
      it(`should return catDTestDataIsInvalid if category is ${value}`, async () => {
        spyOn(activityCodeFinalisationProvider, 'catDTestDataIsInvalid')
          .and
          .returnValue(Promise.resolve(true));
        expect(await activityCodeFinalisationProvider.testDataIsInvalid(value, null, null))
          .toEqual(true);
      });
    });
    [
      TestCategory.EUAM1,
      TestCategory.EUA1M1,
      TestCategory.EUA2M1,
      TestCategory.EUAMM1,
    ].forEach((value) => {
      it(`should return catAMod1TestDataIsInvalid if category is ${value}`, async () => {
        spyOn(activityCodeFinalisationProvider, 'catAMod1TestDataIsInvalid')
          .and
          .returnValue(Promise.resolve(true));
        expect(await activityCodeFinalisationProvider.testDataIsInvalid(value, null, null))
          .toEqual(true);
      });
    });
    [
      TestCategory.EUAM2,
      TestCategory.EUA1M2,
      TestCategory.EUA2M2,
      TestCategory.EUAMM2,
    ].forEach((value) => {
      it(`should return catAMod2TestDataIsInvalid if category is ${value}`, async () => {
        spyOn(activityCodeFinalisationProvider, 'catAMod2TestDataIsInvalid')
          .and
          .returnValue(Promise.resolve(true));
        expect(await activityCodeFinalisationProvider.testDataIsInvalid(value, null, null))
          .toEqual(true);
      });
    });
    [
      TestCategory.F,
      TestCategory.G,
      TestCategory.H,
      TestCategory.K,
    ].forEach((value) => {
      it(`should return catHomeTestDataIsInvalid if category is ${value}`, async () => {
        spyOn(activityCodeFinalisationProvider, 'catHomeTestDataIsInvalid')
          .and
          .returnValue(Promise.resolve(true));
        expect(await activityCodeFinalisationProvider.testDataIsInvalid(value, null, null))
          .toEqual(true);
      });
    });
    it('should return false if switch defaults', async () => {
      expect(await activityCodeFinalisationProvider.testDataIsInvalid(null, null, null))
        .toEqual(false);
    });
  });
});
