import { vi } from 'vitest';
import { SpeedCheckState } from '../test-report-validator.constants';

export class TestReportValidatorProviderMock {
  isTestReportValid = vi.fn().mockReturnValue(true);

  getMissingLegalRequirements = vi.fn().mockReturnValue([]);

  isETAValid = vi.fn().mockReturnValue(true);

  validateSpeedChecksCatAMod1 = vi.fn().mockReturnValue(SpeedCheckState.VALID);
}
