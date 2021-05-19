import { SpeedCheckState } from '../test-report-validator.constants';

export class TestReportValidatorProviderMock {

  isTestReportValid =
    jasmine.createSpy('isTestReportValid').and.returnValue(true);

  getMissingLegalRequirements =
    jasmine.createSpy('getMissingLegalRequirements').and.returnValue([]);

  isETAValid =
    jasmine.createSpy('isETAValid').and.returnValue(true);

  validateSpeedChecksCatAMod1 =
    jasmine.createSpy('validateSpeedChecksCatAMod1').and.returnValue(SpeedCheckState.VALID);

}
