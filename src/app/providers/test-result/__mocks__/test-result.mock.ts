import { ActivityCodes } from '@shared/models/activity-codes';
import { of } from 'rxjs';
import { vi } from 'vitest';

export class TestResultProviderMock {
  calculateCatBTestResult = vi.fn().mockReturnValue(ActivityCodes.PASS);

  calculateCatCPCTestResult = vi.fn().mockReturnValue(of(ActivityCodes.PASS));

  calculateTestResultADI3 = vi.fn().mockReturnValue(of(ActivityCodes.PASS));

  calculateTestResult = vi.fn().mockReturnValue(of(ActivityCodes.PASS));

  calculateCatAdiPart2TestResult = vi.fn().mockReturnValue(ActivityCodes.PASS);

  calculateCatCAndSubCategoryTestResult = vi.fn().mockReturnValue(ActivityCodes.PASS);

  calculateCatDandSubCategoryTestResult = vi.fn().mockReturnValue(ActivityCodes.PASS);

  calculateCatEUAM1AndSubCategoryTestResult = vi.fn().mockReturnValue(ActivityCodes.PASS);

  calculateCatEUAM2AndSubCategoryTestResult = vi.fn().mockReturnValue(ActivityCodes.PASS);

  calculateCatHomeTestResult = vi.fn().mockReturnValue(ActivityCodes.PASS);

  calculateCatManoeuvreTestResult = vi.fn().mockReturnValue(ActivityCodes.PASS);
}
