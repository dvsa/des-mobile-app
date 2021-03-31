import { SingleFaultCompetencies, TestData } from '@dvsa/mes-test-schema/categories/AM1';
import { CompetencyOutcome } from '../../../../../../shared/models/competency-outcome';
import {
  getSingleFaultCompetencies, hasCompetencyDrivingFault, hasCompetencySeriousFault, hasCompetencyDangerousFault,
} from '../single-fault-competencies.selector';
import { SingleFaultCompetencyNames } from '../../../test-data.constants';

describe('single fault competencies selector', () => {
  describe('getSingleFaultCompetencies', () => {
    it('should return singleFaultCompetencies from test data', () => {
      const testData: TestData = {
        singleFaultCompetencies: {
          slalom: CompetencyOutcome.DF,
        } as SingleFaultCompetencies,
      };
      const result = getSingleFaultCompetencies(testData);
      expect(result).toEqual(testData.singleFaultCompetencies);
    });
  });

  describe('hasCompetencyDrivingFault', () => {
    it('should return false when competency does not have driving fault', () => {
      const competencyName = SingleFaultCompetencyNames.slalom;
      const singleFaultCompetencies: SingleFaultCompetencies = {
        [competencyName]: CompetencyOutcome.S,
      };
      const result = hasCompetencyDrivingFault(singleFaultCompetencies, competencyName);
      expect(result).toBe(false);
    });

    it('should return true when competency has driving fault', () => {
      const competencyName = SingleFaultCompetencyNames.slalom;
      const singleFaultCompetencies: SingleFaultCompetencies = {
        [competencyName]: CompetencyOutcome.DF,
      };
      const result = hasCompetencyDrivingFault(singleFaultCompetencies, competencyName);
      expect(result).toBe(true);
    });
  });

  describe('hasCompetencySeriousFault', () => {
    it('should return false when competency does not have serious fault', () => {
      const competencyName = SingleFaultCompetencyNames.slalom;
      const singleFaultCompetencies: SingleFaultCompetencies = {
        [competencyName]: CompetencyOutcome.DF,
      };
      const result = hasCompetencySeriousFault(singleFaultCompetencies, competencyName);
      expect(result).toBe(false);
    });

    it('should return true when competency has serious fault', () => {
      const competencyName = SingleFaultCompetencyNames.slalom;
      const singleFaultCompetencies: SingleFaultCompetencies = {
        [competencyName]: CompetencyOutcome.S,
      };
      const result = hasCompetencySeriousFault(singleFaultCompetencies, competencyName);
      expect(result).toBe(true);
    });
  });

  describe('hasCompetencyDangerousFault', () => {
    it('should return false when competency does not have dangerous fault', () => {
      const competencyName = SingleFaultCompetencyNames.slalom;
      const singleFaultCompetencies: SingleFaultCompetencies = {
        [competencyName]: CompetencyOutcome.DF,
      };
      const result = hasCompetencyDangerousFault(singleFaultCompetencies, competencyName);
      expect(result).toBe(false);
    });

    it('should return true when competency has dangerous fault', () => {
      const competencyName = SingleFaultCompetencyNames.slalom;
      const singleFaultCompetencies: SingleFaultCompetencies = {
        [competencyName]: CompetencyOutcome.D,
      };
      const result = hasCompetencyDangerousFault(singleFaultCompetencies, competencyName);
      expect(result).toBe(true);
    });
  });
});
