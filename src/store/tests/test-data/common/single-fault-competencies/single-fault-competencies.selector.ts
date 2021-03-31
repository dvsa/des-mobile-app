import { SingleFaultCompetencies, TestData } from '@dvsa/mes-test-schema/categories/AM1';
import { SingleFaultCompetencyNames } from '../../test-data.constants';
import { CompetencyOutcome } from '../../../../../shared/models/competency-outcome';

export const getSingleFaultCompetencies = (testData: TestData): SingleFaultCompetencies => {
  return testData.singleFaultCompetencies;
};

export const hasCompetencyDrivingFault = (
  singleFaultCompetencies: SingleFaultCompetencies,
  competencyName: SingleFaultCompetencyNames,
): boolean => {
  return singleFaultCompetencies[competencyName] === CompetencyOutcome.DF;
};

export const hasCompetencySeriousFault = (
  singleFaultCompetencies: SingleFaultCompetencies,
  competencyName: SingleFaultCompetencyNames,
): boolean => {
  return singleFaultCompetencies[competencyName] === CompetencyOutcome.S;
};

export const hasCompetencyDangerousFault = (
  singleFaultCompetencies: SingleFaultCompetencies,
  competencyName: SingleFaultCompetencyNames,
): boolean => {
  return singleFaultCompetencies[competencyName] === CompetencyOutcome.D;
};
