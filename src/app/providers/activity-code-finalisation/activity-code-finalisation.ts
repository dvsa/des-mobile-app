import { Injectable } from '@angular/core';
import { ActivityCode } from '@dvsa/mes-test-schema/categories/common';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { TestData as CatAMod1TestData } from '@dvsa/mes-test-schema/categories/AM1';
import { TestData as CatAMod2TestData } from '@dvsa/mes-test-schema/categories/AM2';
import { CatADI2UniqueTypes } from '@dvsa/mes-test-schema/categories/ADI2';
import { CatBUniqueTypes } from '@dvsa/mes-test-schema/categories/B';
import { CatBEUniqueTypes } from '@dvsa/mes-test-schema/categories/BE';
import { ActivityCodes } from '@shared/models/activity-codes';
import {
  CatCTestData,
  CatDTestData,
  CatHomeTestData,
  TestDataUnion,
} from '@shared/unions/test-schema-unions';
import { TestResultProvider } from '../test-result/test-result';

@Injectable()
export class ActivityCodeFinalisationProvider {

  constructor(private testResultProvider: TestResultProvider) {}

  async catAMod1TestDataIsInvalid(activityCode: ActivityCode, testData: CatAMod1TestData): Promise<boolean> {
    if (!this.activityCodeIs4or5(activityCode)) {
      return false;
    }

    const isPass = await (
      this.testResultProvider.calculateTestResult(TestCategory.EUAM1, testData).toPromise()
    ) === ActivityCodes.PASS;

    return isPass;
  }

  async catAMod2TestDataIsInvalid(activityCode: ActivityCode, testData: CatAMod2TestData): Promise<boolean> {
    if (!this.activityCodeIs4or5(activityCode)) return false;

    const isPass = await (
      this.testResultProvider.calculateTestResult(TestCategory.EUAM2, testData).toPromise()
    ) === ActivityCodes.PASS;

    return isPass;
  }

  async catADIPart2TestDataIsInvalid(
    activityCode: ActivityCode, testData: CatADI2UniqueTypes.TestData,
  ): Promise<boolean> {
    if (!this.activityCodeIs4or5(activityCode)) return false;

    const isPass = await (
      this.testResultProvider.calculateTestResult(TestCategory.ADI2, testData).toPromise()
    ) === ActivityCodes.PASS;

    return isPass;
  }

  async catBTestDataIsInvalid(activityCode: ActivityCode, testData: CatBUniqueTypes.TestData): Promise<boolean> {
    if (!this.activityCodeIs4or5(activityCode)) return false;

    const isPass = await (
      this.testResultProvider.calculateTestResult(TestCategory.B, testData).toPromise()
    ) === ActivityCodes.PASS;

    return isPass;
  }

  async catBETestDataIsInvalid(activityCode: ActivityCode, testData: CatBEUniqueTypes.TestData): Promise<boolean> {
    if (!this.activityCodeIs4or5(activityCode)) return false;

    const isPass = await (
      this.testResultProvider.calculateTestResult(TestCategory.BE, testData).toPromise()
    ) === ActivityCodes.PASS;

    return isPass;
  }

  async catCTestDataIsInvalid(activityCode: ActivityCode, testData: CatCTestData): Promise<boolean> {
    if (!this.activityCodeIs4or5(activityCode)) return false;

    const isPass = await (
      this.testResultProvider.calculateTestResult(TestCategory.C, testData).toPromise()
    ) === ActivityCodes.PASS;

    return isPass;
  }

  async catDTestDataIsInvalid(activityCode: ActivityCode, testData: CatDTestData): Promise<boolean> {
    if (!this.activityCodeIs4or5(activityCode)) return false;

    const isPass = await (
      this.testResultProvider.calculateTestResult(TestCategory.D, testData).toPromise()
    ) === ActivityCodes.PASS;

    return isPass;
  }

  async catHomeTestDataIsInvalid(activityCode: ActivityCode, testData: CatHomeTestData): Promise<boolean> {
    if (!this.activityCodeIs4or5(activityCode)) return false;

    const isPass = await (
      this.testResultProvider.calculateTestResult(TestCategory.F, testData).toPromise()
    ) === ActivityCodes.PASS;

    return isPass;
  }

  private activityCodeIs4or5(activityCode: ActivityCode): boolean {
    return activityCode === ActivityCodes.FAIL_PUBLIC_SAFETY
      || activityCode === ActivityCodes.FAIL_CANDIDATE_STOPS_TEST;
  }

  public async testDataIsInvalid(category, activityCode: ActivityCode, testData: TestDataUnion): Promise<boolean> {
    switch (category) {
      case TestCategory.ADI2: return this.catADIPart2TestDataIsInvalid(
        activityCode, testData as CatADI2UniqueTypes.TestData,
      );
      case TestCategory.B: return this.catBTestDataIsInvalid(activityCode, testData as CatBUniqueTypes.TestData);
      case TestCategory.BE: return this.catBETestDataIsInvalid(activityCode, testData as CatBEUniqueTypes.TestData);
      case TestCategory.C1:
      case TestCategory.C1E:
      case TestCategory.CE:
      case TestCategory.C: return this.catCTestDataIsInvalid(activityCode, testData as CatCTestData);
      case TestCategory.EUAM1:
      case TestCategory.EUA1M1:
      case TestCategory.EUA2M1:
      case TestCategory.EUAMM1: return this.catAMod1TestDataIsInvalid(activityCode, testData as CatAMod1TestData);
      case TestCategory.EUAM2:
      case TestCategory.EUA1M2:
      case TestCategory.EUA2M2:
      case TestCategory.EUAMM2: return this.catAMod2TestDataIsInvalid(activityCode, testData as CatAMod2TestData);
      case TestCategory.D1:
      case TestCategory.D1E:
      case TestCategory.DE:
      case TestCategory.D: return this.catDTestDataIsInvalid(activityCode, testData as CatDTestData);
      case TestCategory.F:
      case TestCategory.G:
      case TestCategory.H:
      case TestCategory.K: return this.catHomeTestDataIsInvalid(activityCode, testData as CatHomeTestData);
      default: return false;
    }
  }

}
