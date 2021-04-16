import { Competencies } from '../test-data.constants';
import { TestData } from '@dvsa/mes-test-schema/categories/AM1';
import { CompetencyOutcome } from '@shared/models/competency-outcome';

export const getDrivingFaultCount = (
  data: TestData, competency: Competencies) => data.drivingFaults[competency];

export const getSpeedRequirementNotMet = (testData: TestData) =>
  testData.emergencyStop.outcome ===  CompetencyOutcome.S;
