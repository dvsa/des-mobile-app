import { Injectable } from '@angular/core';
import { CatADI2UniqueTypes } from '@dvsa/mes-test-schema/categories/ADI2';
import { TestData as TestDataADI3 } from '@dvsa/mes-test-schema/categories/ADI3';
import { TestData as TestDataAM1 } from '@dvsa/mes-test-schema/categories/AM1';
import { TestData as TestDataAM2 } from '@dvsa/mes-test-schema/categories/AM2';
import { CatBUniqueTypes } from '@dvsa/mes-test-schema/categories/B';
import { CatCUniqueTypes } from '@dvsa/mes-test-schema/categories/C';
import { CatC1UniqueTypes } from '@dvsa/mes-test-schema/categories/C1';
import { CatC1EUniqueTypes } from '@dvsa/mes-test-schema/categories/C1E';
import { CatCEUniqueTypes } from '@dvsa/mes-test-schema/categories/CE';
import { TestData } from '@dvsa/mes-test-schema/categories/CPC';
import { CatDUniqueTypes } from '@dvsa/mes-test-schema/categories/D';
import { CatD1UniqueTypes } from '@dvsa/mes-test-schema/categories/D1';
import { CatD1EUniqueTypes } from '@dvsa/mes-test-schema/categories/D1E';
import { CatDEUniqueTypes } from '@dvsa/mes-test-schema/categories/DE';
import { ActivityCode } from '@dvsa/mes-test-schema/categories/common';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { HomeTestData } from '@pages/office/cat-home-test/office.cat-home-test.page';
import { ActivityCodes } from '@shared/models/activity-codes';
import { CatManoeuvreTestData } from '@shared/unions/test-schema-unions';
import { getSpeedRequirementNotMet } from '@store/tests/test-data/cat-a-mod1/test-data.cat-a-mod1.selector';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { FaultCountProvider } from '../fault-count/fault-count';

@Injectable()
export class TestResultProvider {
  constructor(private faultCountProvider: FaultCountProvider) {}

  public calculateTestResult(category: string, testData: object): Observable<ActivityCode> {
    switch (category) {
      case TestCategory.ADI2:
        return this.calculateCatAdiPart2TestResult(testData as CatADI2UniqueTypes.TestData);
      case TestCategory.ADI3:
      case TestCategory.SC:
        return this.calculateTestResultADI3(testData as TestDataADI3).pipe(map((result) => result.activityCode));
      case TestCategory.B:
        return this.calculateCatBTestResult(testData as CatBUniqueTypes.TestData);
      case TestCategory.CCPC:
      case TestCategory.DCPC:
        return this.calculateCatCPCTestResult(testData as TestData);
      case TestCategory.C:
      case TestCategory.C1:
      case TestCategory.CE:
      case TestCategory.C1E:
        return this.calculateCatCAndSubCategoryTestResult(category, testData);
      case TestCategory.CM:
      case TestCategory.C1M:
      case TestCategory.CEM:
      case TestCategory.C1EM:
      case TestCategory.DM:
      case TestCategory.D1M:
      case TestCategory.DEM:
      case TestCategory.D1EM:
        return this.calculateCatManoeuvreTestResult(category, testData);
      case TestCategory.D:
      case TestCategory.D1:
      case TestCategory.DE:
      case TestCategory.D1E:
        return this.calculateCatDandSubCategoryTestResult(category, testData);
      case TestCategory.EUAM1:
      case TestCategory.EUA1M1:
      case TestCategory.EUA2M1:
      case TestCategory.EUAMM1:
        return this.calculateCatEUAM1AndSubCategoryTestResult(TestCategory.EUAM1, testData as TestDataAM1);
      case TestCategory.EUAM2:
      case TestCategory.EUA1M2:
      case TestCategory.EUA2M2:
      case TestCategory.EUAMM2:
        return this.calculateCatEUAM2AndSubCategoryTestResult(TestCategory.EUAM2, testData as TestDataAM2);
      case TestCategory.F:
      case TestCategory.G:
      case TestCategory.H:
      case TestCategory.K:
        return this.calculateCatHomeTestResult(category, testData);
      default:
        throw new Error(`Invalid Test Category when trying to calculate test result - ${category}`);
    }
  }

  public calculateTestResultADI3 = (
    testData: TestDataADI3
  ): Observable<{ activityCode: ActivityCode; grade?: string }> => {
    const { score: scoreLP = 0 } = testData.lessonPlanning;
    const { score: scoreRM = 0 } = testData.riskManagement;
    const { score: scoreTLS = 0 } = testData.teachingLearningStrategies;

    const totalScore: number = scoreLP + scoreRM + scoreTLS;

    // fail if any score is less than 31 or if the RM score is less than 8;
    if (scoreRM < 8 || totalScore < 31) {
      return of({ activityCode: ActivityCodes.FAIL });
    }
    // Pass - Grade B
    if (totalScore >= 31 && totalScore <= 42) {
      return of({ activityCode: ActivityCodes.PASS, grade: 'B' });
    }
    // Pass - Grade A
    return of({ activityCode: ActivityCodes.PASS, grade: 'A' });
  };

  private calculateCatAdiPart2TestResult = (testData: CatADI2UniqueTypes.TestData): Observable<ActivityCode> => {
    if (this.faultCountProvider.getDangerousFaultSumCount(TestCategory.ADI2, testData) > 0) {
      return of(ActivityCodes.FAIL);
    }

    if (this.faultCountProvider.getSeriousFaultSumCount(TestCategory.ADI2, testData) > 0) {
      return of(ActivityCodes.FAIL);
    }

    if (this.faultCountProvider.getDrivingFaultSumCount(TestCategory.ADI2, testData) > 6) {
      return of(ActivityCodes.FAIL);
    }

    return of(ActivityCodes.PASS);
  };

  private calculateCatBTestResult = (testData: CatBUniqueTypes.TestData): Observable<ActivityCode> => {
    if (this.faultCountProvider.getDangerousFaultSumCount(TestCategory.B, testData) > 0) {
      return of(ActivityCodes.FAIL);
    }

    if (this.faultCountProvider.getSeriousFaultSumCount(TestCategory.B, testData) > 0) {
      return of(ActivityCodes.FAIL);
    }

    if (this.faultCountProvider.getDrivingFaultSumCount(TestCategory.B, testData) > 15) {
      return of(ActivityCodes.FAIL);
    }

    return of(ActivityCodes.PASS);
  };

  private calculateCatCAndSubCategoryTestResult = (
    category: TestCategory,
    testData:
      | CatCUniqueTypes.TestData
      | CatCEUniqueTypes.TestData
      | CatC1EUniqueTypes.TestData
      | CatC1UniqueTypes.TestData
  ): Observable<ActivityCode> => {
    if (this.faultCountProvider.getDangerousFaultSumCount(category, testData) > 0) {
      return of(ActivityCodes.FAIL);
    }

    if (this.faultCountProvider.getSeriousFaultSumCount(category, testData) > 0) {
      return of(ActivityCodes.FAIL);
    }

    if (this.faultCountProvider.getDrivingFaultSumCount(category, testData) > 12) {
      return of(ActivityCodes.FAIL);
    }

    return of(ActivityCodes.PASS);
  };

  private calculateCatEUAM1AndSubCategoryTestResult = (
    category: TestCategory,
    testData: TestDataAM1
  ): Observable<ActivityCode> => {
    if (getSpeedRequirementNotMet(testData)) {
      return of(ActivityCodes.FAIL_PUBLIC_SAFETY);
    }
    if (this.faultCountProvider.getDangerousFaultSumCount(category, testData) > 0) {
      return of(ActivityCodes.FAIL);
    }
    if (this.faultCountProvider.getSeriousFaultSumCount(category, testData) > 0) {
      return of(ActivityCodes.FAIL);
    }
    if (this.faultCountProvider.getDrivingFaultSumCount(category, testData) >= 6) {
      return of(ActivityCodes.FAIL);
    }

    return of(ActivityCodes.PASS);
  };

  private calculateCatEUAM2AndSubCategoryTestResult = (
    category: TestCategory,
    testData: TestDataAM2
  ): Observable<ActivityCode> => {
    if (this.faultCountProvider.getDangerousFaultSumCount(category, testData) > 0) {
      return of(ActivityCodes.FAIL);
    }
    if (this.faultCountProvider.getSeriousFaultSumCount(category, testData) > 0) {
      return of(ActivityCodes.FAIL);
    }
    if (this.faultCountProvider.getDrivingFaultSumCount(category, testData) > 10) {
      return of(ActivityCodes.FAIL);
    }

    return of(ActivityCodes.PASS);
  };

  private calculateCatDandSubCategoryTestResult = (
    category: TestCategory,
    testData:
      | CatDUniqueTypes.TestData
      | CatDEUniqueTypes.TestData
      | CatD1EUniqueTypes.TestData
      | CatD1UniqueTypes.TestData
  ): Observable<ActivityCode> => {
    if (this.faultCountProvider.getDangerousFaultSumCount(category, testData) > 0) {
      return of(ActivityCodes.FAIL);
    }

    if (this.faultCountProvider.getSeriousFaultSumCount(category, testData) > 0) {
      return of(ActivityCodes.FAIL);
    }

    if (this.faultCountProvider.getDrivingFaultSumCount(category, testData) > 12) {
      return of(ActivityCodes.FAIL);
    }

    return of(ActivityCodes.PASS);
  };

  private calculateCatHomeTestResult = (category: TestCategory, testData: HomeTestData): Observable<ActivityCode> => {
    if (this.faultCountProvider.getDangerousFaultSumCount(category, testData) > 0) {
      return of(ActivityCodes.FAIL);
    }

    if (this.faultCountProvider.getSeriousFaultSumCount(category, testData) > 0) {
      return of(ActivityCodes.FAIL);
    }

    if (this.faultCountProvider.getDrivingFaultSumCount(category, testData) > 15) {
      return of(ActivityCodes.FAIL);
    }

    return of(ActivityCodes.PASS);
  };

  private calculateCatCPCTestResult = (testData: TestData): Observable<ActivityCode> => {
    const { question1, question2, question3, question4, question5 } = testData;

    const scores: number[] = [question1.score, question2.score, question3.score, question4.score, question5.score];

    // fail if any score is less than 15
    if (scores.some((score: number) => score < 15)) {
      return of(ActivityCodes.FAIL);
    }
    // fail if at least one score is not 20
    if (scores.indexOf(20) === -1) {
      return of(ActivityCodes.FAIL);
    }
    return of(ActivityCodes.PASS);
  };

  private calculateCatManoeuvreTestResult = (
    category: TestCategory,
    testData: CatManoeuvreTestData
  ): Observable<ActivityCode> => {
    if (this.faultCountProvider.getDangerousFaultSumCount(category, testData) > 0) {
      return of(ActivityCodes.FAIL);
    }

    if (this.faultCountProvider.getSeriousFaultSumCount(category, testData) > 0) {
      return of(ActivityCodes.FAIL);
    }

    return of(ActivityCodes.PASS);
  };
}
