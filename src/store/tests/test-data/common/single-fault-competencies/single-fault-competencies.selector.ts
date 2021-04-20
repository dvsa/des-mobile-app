import { SingleFaultCompetencies, TestData } from '@dvsa/mes-test-schema/categories/AM1';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { SingleFaultCompetencyNames } from '../../test-data.constants';

export const getSingleFaultCompetencies = (
  testData: TestData,
): SingleFaultCompetencies => testData.singleFaultCompetencies;

export const hasCompetencyDrivingFault = (
  singleFaultCompetencies: SingleFaultCompetencies,
  competencyName: SingleFaultCompetencyNames,
): boolean => singleFaultCompetencies[competencyName] === CompetencyOutcome.DF;

export const hasCompetencySeriousFault = (
  singleFaultCompetencies: SingleFaultCompetencies,
  competencyName: SingleFaultCompetencyNames,
): boolean => singleFaultCompetencies[competencyName] === CompetencyOutcome.S;

export const hasCompetencyDangerousFault = (
  singleFaultCompetencies: SingleFaultCompetencies,
  competencyName: SingleFaultCompetencyNames,
): boolean => singleFaultCompetencies[competencyName] === CompetencyOutcome.D;
