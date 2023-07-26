import { of } from 'rxjs';
import { ActivityCodes } from '@shared/models/activity-codes';

export class TestResultProviderMock {
  calculateCatBTestResult = jasmine
    .createSpy('calculateCatBTestResult')
    .and
    .returnValue(ActivityCodes.PASS);

  calculateCatCPCTestResult = jasmine
    .createSpy('calculateCatCPCTestResult')
    .and
    .returnValue(of(ActivityCodes.PASS));

  calculateTestResultADI3 = jasmine
    .createSpy('calculateTestResultADI3')
    .and
    .returnValue(of(ActivityCodes.PASS));

  calculateTestResult = jasmine
    .createSpy('calculateCatCPCTestResult')
    .and
    .returnValue(of(ActivityCodes.PASS));

  calculateCatAdiPart2TestResult = jasmine
    .createSpy('calculateCatAdiPart2TestResult')
    .and
    .returnValue(ActivityCodes.PASS);

  calculateCatCAndSubCategoryTestResult = jasmine
    .createSpy('calculateCatCAndSubCategoryTestResult')
    .and
    .returnValue(ActivityCodes.PASS);

  calculateCatDandSubCategoryTestResult = jasmine
    .createSpy('calculateCatDandSubCategoryTestResult')
    .and
    .returnValue(ActivityCodes.PASS);

  calculateCatEUAM1AndSubCategoryTestResult = jasmine
    .createSpy('calculateCatEUAM1AndSubCategoryTestResult')
    .and
    .returnValue(ActivityCodes.PASS);

  calculateCatEUAM2AndSubCategoryTestResult = jasmine
    .createSpy('calculateCatEUAM2AndSubCategoryTestResult')
    .and
    .returnValue(ActivityCodes.PASS);

  calculateCatHomeTestResult = jasmine
    .createSpy('calculateCatHomeTestResult')
    .and
    .returnValue(ActivityCodes.PASS);

  calculateCatManoeuvreTestResult = jasmine
    .createSpy('calculateCatManoeuvreTestResult')
    .and
    .returnValue(ActivityCodes.PASS);
}
