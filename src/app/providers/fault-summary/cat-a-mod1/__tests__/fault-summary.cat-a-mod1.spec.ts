import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { Competencies } from '@store/tests/test-data/test-data.constants';
import { SingleFaultCompetencies } from '@dvsa/mes-test-schema/categories/AM1';
import { FaultSummaryCatAM1Helper } from '../fault-summary.cat-a-mod1';
import { catAM1TestDataStateObject } from './cat-AM1-test-data.mock';

xdescribe('FaultSummaryCatAM1Helper', () => {

  xdescribe('createEmergencyStopFaultSummary', () => {
    it('should return a fault summary for emergency stop', () => {
      const resultSummary = FaultSummaryCatAM1Helper.getSpeedCheckEmergencyStop({ outcome: CompetencyOutcome.S })[0];
      expect(resultSummary.competencyIdentifier)
        .toBe(Competencies.speedCheckEmergency);
      expect(resultSummary.faultCount)
        .toBe(1);
    });
    it('should return a fault summary for avoidance', () => {
      const resultSummary = FaultSummaryCatAM1Helper.getSpeedCheckAvoidance({ outcome: CompetencyOutcome.S })[0];
      expect(resultSummary.competencyIdentifier)
        .toBe(Competencies.speedCheckAvoidance);
      expect(resultSummary.faultCount)
        .toBe(1);
    });
  });

  xdescribe('matchCompetenciesIncludingComments', () => {
    it('should match competencies with its corresponding comments', () => {
      const { singleFaultCompetencies } = catAM1TestDataStateObject;
      const expected = {
        slowControl: CompetencyOutcome.S,
        slowControlComments: 'slowControlComments',
        controlledStop: CompetencyOutcome.S,
        controlledStopComments: 'controlledStopComments',
        emergencyStop: CompetencyOutcome.S,
        emergencyStopComments: 'emergencyStopComments',
        avoidance: CompetencyOutcome.S,
        avoidanceComments: 'avoidanceComments',
      } as Partial<SingleFaultCompetencies>;
      const result = FaultSummaryCatAM1Helper.matchCompetenciesIncludingComments(
        singleFaultCompetencies,
        CompetencyOutcome.S,
      );
      expect(result)
        .toEqual(expected);
    });
    it('should get called whenever the helper\'s main methods are used', () => {
      spyOn(FaultSummaryCatAM1Helper, 'matchCompetenciesIncludingComments')
        .and
        .callThrough();
      FaultSummaryCatAM1Helper.getDrivingFaultsCatAM1(catAM1TestDataStateObject);
      FaultSummaryCatAM1Helper.getSeriousFaultsCatAM1(catAM1TestDataStateObject);
      FaultSummaryCatAM1Helper.getDangerousFaultsCatAM1(catAM1TestDataStateObject);
      expect(FaultSummaryCatAM1Helper.matchCompetenciesIncludingComments)
        .toHaveBeenCalledTimes(3);
    });
  });
});
