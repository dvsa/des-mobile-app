import { of } from 'rxjs';
import { ActivityCodes } from '@shared/models/activity-codes';

export class TestResultProviderMock {
  calculateCatBTestResult = jasmine.createSpy('calculateCatBTestResult').and.returnValue(ActivityCodes.PASS);
  calculateCatCPCTestResult = jasmine.createSpy('calculateCatCPCTestResult').and.returnValue(of(ActivityCodes.PASS));
  calculateTestResult = jasmine.createSpy('calculateCatCPCTestResult').and.returnValue(of(ActivityCodes.PASS));
}
