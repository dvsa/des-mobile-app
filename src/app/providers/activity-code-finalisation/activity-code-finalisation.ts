import { Injectable } from '@angular/core';
import { ActivityCode } from '@dvsa/mes-test-schema/categories/common';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { TestData as CatAMod1TestData } from '@dvsa/mes-test-schema/categories/AM1';
import { TestData as CatAMod2TestData } from '@dvsa/mes-test-schema/categories/AM2';
import { TestData as CatADI3TestData } from '@dvsa/mes-test-schema/categories/ADI3';
import { CatADI2UniqueTypes } from '@dvsa/mes-test-schema/categories/ADI2';
import { CatBUniqueTypes } from '@dvsa/mes-test-schema/categories/B';
import { ActivityCodes } from '@shared/models/activity-codes';
import {
  CatCTestData,
  CatDTestData,
  CatHomeTestData,
  CatManoeuvreTestData,
  TestDataUnion,
} from '@shared/unions/test-schema-unions';
import { lastValueFrom } from 'rxjs';
import { TestResultProvider } from '../test-result/test-result';

@Injectable()
export class ActivityCodeFinalisationProvider {

  constructor(private testResultProvider: TestResultProvider) {
  }

  async catAMod1TestDataIsInvalid(
    activityCode: ActivityCode,
    testData: CatAMod1TestData,
    category: TestCategory,
  ): Promise<boolean> {
    if (!this.activityCodeIs4or5(activityCode)) {
      return false;
    }

    const isPass = await lastValueFrom(
      this.testResultProvider.calculateTestResult(category, testData),
    ) === ActivityCodes.PASS;

    return isPass;
  }

  async catAMod2TestDataIsInvalid(
    activityCode: ActivityCode,
    testData: CatAMod2TestData,
    category: TestCategory,
  ): Promise<boolean> {
    if (!this.activityCodeIs4or5(activityCode)) return false;

    const isPass = await lastValueFrom(
      this.testResultProvider.calculateTestResult(category, testData),
    ) === ActivityCodes.PASS;

    return isPass;
  }

  async catADIPart2TestDataIsInvalid(
    activityCode: ActivityCode,
    testData: CatADI2UniqueTypes.TestData,
    category: TestCategory,
  ): Promise<boolean> {
    if (!this.activityCodeIs4or5(activityCode)) return false;

    const isPass = await lastValueFrom(
      this.testResultProvider.calculateTestResult(category, testData),
    ) === ActivityCodes.PASS;

    return isPass;
  }

  async catADIPart3TestDataIsInvalid(
    activityCode: ActivityCode,
    testData: CatADI3TestData,
    category: TestCategory,
  ): Promise<boolean> {
    if (activityCode !== ActivityCodes.FAIL_PUBLIC_SAFETY && testData.riskManagement.score >= 8) return false;

    const isPass = await lastValueFrom(
      this.testResultProvider.calculateTestResult(category, testData),
    ) === ActivityCodes.PASS;

    return isPass;
  }

  async catBTestDataIsInvalid(
    activityCode: ActivityCode,
    testData: CatBUniqueTypes.TestData,
    category: TestCategory,
  ): Promise<boolean> {
    if (!this.activityCodeIs4or5(activityCode)) return false;

    const isPass = await lastValueFrom(
      this.testResultProvider.calculateTestResult(category, testData),
    ) === ActivityCodes.PASS;

    return isPass;
  }

  async catCTestDataIsInvalid(
    activityCode: ActivityCode,
    testData: CatCTestData,
    category: TestCategory,
  ): Promise<boolean> {
    if (!this.activityCodeIs4or5(activityCode)) return false;

    const isPass = await lastValueFrom(
      this.testResultProvider.calculateTestResult(category, testData),
    ) === ActivityCodes.PASS;

    return isPass;
  }

  async catManoeuvresTestDataIsInvalid(
    activityCode: ActivityCode,
    testData: CatManoeuvreTestData,
    category: TestCategory,
  ): Promise<boolean> {
    if (!this.activityCodeIs4or5(activityCode)) return false;

    const isPass = await lastValueFrom(
      this.testResultProvider.calculateTestResult(category, testData),
    ) === ActivityCodes.PASS;

    return isPass;
  }

  async catDTestDataIsInvalid(
    activityCode: ActivityCode,
    testData: CatDTestData,
    category: TestCategory,
  ): Promise<boolean> {
    if (!this.activityCodeIs4or5(activityCode)) return false;

    const isPass = await lastValueFrom(
      this.testResultProvider.calculateTestResult(category, testData),
    ) === ActivityCodes.PASS;

    return isPass;
  }

  async catHomeTestDataIsInvalid(
    activityCode: ActivityCode,
    testData: CatHomeTestData,
    category: TestCategory,
  ): Promise<boolean> {
    if (!this.activityCodeIs4or5(activityCode)) return false;

    const isPass = await lastValueFrom(
      this.testResultProvider.calculateTestResult(category, testData),
    ) === ActivityCodes.PASS;

    return isPass;
  }

  private activityCodeIs4or5(activityCode: ActivityCode): boolean {
    return activityCode === ActivityCodes.FAIL_PUBLIC_SAFETY
      || activityCode === ActivityCodes.FAIL_CANDIDATE_STOPS_TEST;
  }

  public async testDataIsInvalid(category, activityCode: ActivityCode, testData: TestDataUnion): Promise<boolean> {
    switch (category) {
      case TestCategory.ADI2:
        return this.catADIPart2TestDataIsInvalid(
          activityCode, testData as CatADI2UniqueTypes.TestData, category,
        );
      case TestCategory.ADI3:
      case TestCategory.SC:
        return this.catADIPart3TestDataIsInvalid(activityCode, testData as CatADI3TestData, category);
      case TestCategory.B:
        return this.catBTestDataIsInvalid(activityCode, testData as CatBUniqueTypes.TestData, category);
      case TestCategory.C1:
      case TestCategory.C1E:
      case TestCategory.CE:
      case TestCategory.C:
        return this.catCTestDataIsInvalid(activityCode, testData as CatCTestData, category);
      case TestCategory.C1M:
      case TestCategory.CEM:
      case TestCategory.C1EM:
      case TestCategory.CM:
      case TestCategory.D1M:
      case TestCategory.DEM:
      case TestCategory.D1EM:
      case TestCategory.DM:
        return this.catManoeuvresTestDataIsInvalid(activityCode, testData as CatManoeuvreTestData, category);
      case TestCategory.D1:
      case TestCategory.D1E:
      case TestCategory.DE:
      case TestCategory.D:
        return this.catDTestDataIsInvalid(activityCode, testData as CatDTestData, category);
      case TestCategory.EUAM1:
      case TestCategory.EUA1M1:
      case TestCategory.EUA2M1:
      case TestCategory.EUAMM1:
        return this.catAMod1TestDataIsInvalid(activityCode, testData as CatAMod1TestData, category);
      case TestCategory.EUAM2:
      case TestCategory.EUA1M2:
      case TestCategory.EUA2M2:
      case TestCategory.EUAMM2:
        return this.catAMod2TestDataIsInvalid(activityCode, testData as CatAMod2TestData, category);
      case TestCategory.F:
      case TestCategory.G:
      case TestCategory.H:
      case TestCategory.K:
        return this.catHomeTestDataIsInvalid(activityCode, testData as CatHomeTestData, category);
      default:
        return false;
    }
  }

}
