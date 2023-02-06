import { TestBed } from '@angular/core/testing';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';

import { of } from 'rxjs';
import { ActivityCodes } from '@shared/models/activity-codes';
import { FaultCountProvider } from '../../fault-count/fault-count';
import { TestResultProvider } from '../../test-result/test-result';
import { ActivityCodeFinalisationProvider } from '../activity-code-finalisation';

describe('ActivityCodeFinalisationProvider', () => {

  let testResultProvider: TestResultProvider;
  let activityCodeFinalisationProvider: ActivityCodeFinalisationProvider;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TestResultProvider,
        FaultCountProvider,
        ActivityCodeFinalisationProvider,
      ],
    });

    testResultProvider = TestBed.inject(TestResultProvider);
    activityCodeFinalisationProvider = TestBed.inject(ActivityCodeFinalisationProvider);
  });

  describe('Check if test data for different categories are invalid', () => {
    beforeEach(() => {
      spyOn(testResultProvider, 'calculateTestResult').and.returnValue(of(ActivityCodes.PASS));
    });

    it('should call testResultProvider with the correct category for B', () => {
      activityCodeFinalisationProvider.catBTestDataIsInvalid(ActivityCodes.FAIL_PUBLIC_SAFETY, {});
      expect(testResultProvider.calculateTestResult).toHaveBeenCalledWith(TestCategory.B, {});
    });

    it('should call testResultProvider with the correct category for C', () => {
      activityCodeFinalisationProvider.catCTestDataIsInvalid(
        ActivityCodes.FAIL_CANDIDATE_STOPS_TEST, {}, TestCategory.C,
      );
      expect(testResultProvider.calculateTestResult).toHaveBeenCalledWith(TestCategory.C, {});
    });

    it('should call testResultProvider with the correct category for CE', () => {
      activityCodeFinalisationProvider.catCTestDataIsInvalid(
        ActivityCodes.FAIL_CANDIDATE_STOPS_TEST, {}, TestCategory.CE,
      );
      expect(testResultProvider.calculateTestResult).toHaveBeenCalledWith(TestCategory.CE, {});
    });

    it('should call testResultProvider with the correct category for CM', () => {
      activityCodeFinalisationProvider.catManoeuvresTestDataIsInvalid(ActivityCodes.FAIL_CANDIDATE_STOPS_TEST, {});
      expect(testResultProvider.calculateTestResult).toHaveBeenCalledWith(TestCategory.CM, {});
    });

    it('should call testResultProvider with the correct category for AM1', () => {
      activityCodeFinalisationProvider.catAMod1TestDataIsInvalid(ActivityCodes.FAIL_PUBLIC_SAFETY, {});
      expect(testResultProvider.calculateTestResult).toHaveBeenCalledWith(TestCategory.EUAM1, {});
    });

    it('should call testResultProvider with the correct category for AM2', () => {
      activityCodeFinalisationProvider.catAMod2TestDataIsInvalid(ActivityCodes.FAIL_PUBLIC_SAFETY, {});
      expect(testResultProvider.calculateTestResult).toHaveBeenCalledWith(TestCategory.EUAM2, {});
    });

    it('should call testResultProvider with the correct category for ADI2', () => {
      activityCodeFinalisationProvider.catADIPart2TestDataIsInvalid(ActivityCodes.FAIL_CANDIDATE_STOPS_TEST, {});
      expect(testResultProvider.calculateTestResult).toHaveBeenCalledWith(TestCategory.ADI2, {});
    });

    it('should call testResultProvider with the correct category for Home', () => {
      activityCodeFinalisationProvider.catHomeTestDataIsInvalid(ActivityCodes.FAIL_PUBLIC_SAFETY, {});
      expect(testResultProvider.calculateTestResult).toHaveBeenCalledWith(TestCategory.F, {});
    });
  });

  describe('activityCodeIs4or5', () => {
    beforeEach(() => {
      spyOn(testResultProvider, 'calculateTestResult').and.returnValue(of(ActivityCodes.PASS));
    });
    it('should return false when activity code is not 4/5 for Home', async () => {
      const result = await activityCodeFinalisationProvider.catHomeTestDataIsInvalid(ActivityCodes.BAD_LIGHT, {});
      expect(result).toBe(false);
    });
    it('should return false when activity code is not 4/5 for B', async () => {
      const result = await activityCodeFinalisationProvider.catBTestDataIsInvalid(ActivityCodes.ACCIDENT, {});
      expect(result).toBe(false);
    });
    it('should return false when activity code is not 4/5 for C', async () => {
      const result = await activityCodeFinalisationProvider
        .catCTestDataIsInvalid(ActivityCodes.EXAMINER_ILL_PRE_TEST, {}, TestCategory.C);
      expect(result).toBe(false);
    });
    it('should return false when activity code is not 4/5 for D', async () => {
      const result = await activityCodeFinalisationProvider.catDTestDataIsInvalid(
        ActivityCodes.CANDIDATE_PREGNANT,
        {},
        TestCategory.D,
      );
      expect(result).toBe(false);
    });
    it('should return false when activity code is not 4/5 for AMod1', async () => {
      const result = await activityCodeFinalisationProvider
        .catAMod1TestDataIsInvalid(ActivityCodes.CANDIDATE_REFUSED_TO_SIGN_RESIDENCY_DECLARATION, {});
      expect(result).toBe(false);
    });
    it('should return false when activity code is not 4/5 for AMod2', async () => {
      const result = await activityCodeFinalisationProvider
        .catAMod2TestDataIsInvalid(ActivityCodes.ILLEGAL_ACTIVITY_FROM_CANDIDATE, {});
      expect(result).toBe(false);
    });
    it('should return false when activity code is not 4/5 for ADI2', async () => {
      const result = await activityCodeFinalisationProvider.catADIPart2TestDataIsInvalid(ActivityCodes.BAD_LIGHT, {});
      expect(result).toBe(false);
    });
  });

});
