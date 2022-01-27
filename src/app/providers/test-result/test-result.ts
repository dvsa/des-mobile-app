import { Injectable } from '@angular/core';
import { ActivityCode } from '@dvsa/mes-test-schema/categories/common';
import { CatBUniqueTypes } from '@dvsa/mes-test-schema/categories/B';
import { Observable, of } from 'rxjs';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { CatADI2UniqueTypes } from '@dvsa/mes-test-schema/categories/ADI2';
import { CatBEUniqueTypes } from '@dvsa/mes-test-schema/categories/BE';
import { CatCUniqueTypes } from '@dvsa/mes-test-schema/categories/C';
import { CatCEUniqueTypes } from '@dvsa/mes-test-schema/categories/CE';
import { CatC1EUniqueTypes } from '@dvsa/mes-test-schema/categories/C1E';
import { CatC1UniqueTypes } from '@dvsa/mes-test-schema/categories/C1';
import { TestData as TestDataAM1 } from '@dvsa/mes-test-schema/categories/AM1';
import { TestData as TestDataAM2 } from '@dvsa/mes-test-schema/categories/AM2';
import { CatDUniqueTypes } from '@dvsa/mes-test-schema/categories/D';
import { CatD1UniqueTypes } from '@dvsa/mes-test-schema/categories/D1';
import { CatDEUniqueTypes } from '@dvsa/mes-test-schema/categories/DE';
import { CatD1EUniqueTypes } from '@dvsa/mes-test-schema/categories/D1E';
import { TestData } from '@dvsa/mes-test-schema/categories/CPC';
// TODO: MES-7147 reinstate pages & selector when they have been implemented
// import { HomeTestData } from '@pages/office/cat-home-test/office.cat-home-test.page';
// import { getSpeedRequirementNotMet } from '../../modules/tests/test-data/cat-a-mod1/test-data.cat-a-mod1.selector';
import { ActivityCodes } from '@shared/models/activity-codes';
import { FaultCountProvider } from '../fault-count/fault-count';

@Injectable()
export class TestResultProvider {

  constructor(private faultCountProvider: FaultCountProvider) { }

  public calculateTestResult(category: string, testData: object): Observable<ActivityCode> {
    switch (category) {
      case TestCategory.ADI2:
        return this.calculateCatAdiPart2TestResult(testData as CatADI2UniqueTypes.TestData);
      case TestCategory.B:
        return this.calculateCatBTestResult(testData as CatBUniqueTypes.TestData);
      case TestCategory.BE:
        return this.calculateCatBETestResult(testData as CatBEUniqueTypes.TestData);
      case TestCategory.C:
      case TestCategory.C1:
      case TestCategory.CE:
      case TestCategory.C1E:
        return this.calculateCatCAndSubCategoryTestResult(category, testData);
      case TestCategory.CCPC:
      case TestCategory.DCPC:
        return this.calculateCatCPCTestResult(testData as TestData);
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
      case TestCategory.D:
      case TestCategory.D1:
      case TestCategory.DE:
      case TestCategory.D1E:
        return this.calculateCatDandSubCategoryTestResult(category, testData);
      /*
      case TestCategory.F:
      case TestCategory.G:
      case TestCategory.H:
      case TestCategory.K:
        return this.calculateCatHomeTestResult(category, testData);
      */
      default:
        throw new Error(`Invalid Test Category when trying to calculate test result - ${category}`);
    }
  }

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

  private calculateCatBTestResult = (testData: CatBUniqueTypes.TestData |
  CatBEUniqueTypes.TestData): Observable<ActivityCode> => {

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

  private calculateCatBETestResult = (testData: CatBEUniqueTypes.TestData): Observable<ActivityCode> => {
    if (this.faultCountProvider.getDangerousFaultSumCount(TestCategory.BE, testData) > 0) {
      return of(ActivityCodes.FAIL);
    }

    if (this.faultCountProvider.getSeriousFaultSumCount(TestCategory.BE, testData) > 0) {
      return of(ActivityCodes.FAIL);
    }

    if (this.faultCountProvider.getDrivingFaultSumCount(TestCategory.BE, testData) > 15) {
      return of(ActivityCodes.FAIL);
    }

    return of(ActivityCodes.PASS);
  };

  private calculateCatCAndSubCategoryTestResult = (
    category: TestCategory,
    testData: CatCUniqueTypes.TestData |
    CatCEUniqueTypes.TestData |
    CatC1EUniqueTypes.TestData |
    CatC1UniqueTypes.TestData,
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
    testData: TestDataAM1,
  ): Observable<ActivityCode> => {
    /* if (getSpeedRequirementNotMet(testData)) {
      return of(ActivityCodes.FAIL_PUBLIC_SAFETY);
    } */
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
    testData: TestDataAM2,
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
    testData: CatDUniqueTypes.TestData |
    CatDEUniqueTypes.TestData |
    CatD1EUniqueTypes.TestData |
    CatD1UniqueTypes.TestData,
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

  /*
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
  */

  private calculateCatCPCTestResult = (testData: TestData): Observable<ActivityCode> => {
    const {
      question1, question2, question3, question4, question5,
    } = testData;

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
}
