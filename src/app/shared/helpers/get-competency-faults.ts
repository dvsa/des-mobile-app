import { SingleFaultCompetencies } from '@dvsa/mes-test-schema/categories/AM1';
import { DangerousFaults, DrivingFaults, SeriousFaults } from '@dvsa/mes-test-schema/categories/common';
import { forOwn, isBoolean, isNumber } from 'lodash-es';
import { fullCompetencyLabels } from '../constants/competencies/competencies';
import { CompetencyOutcome } from '../models/competency-outcome';
import { CommentSource, CompetencyIdentifiers, FaultSummary } from '../models/fault-marking.model';

const competencyOutcomes = [CompetencyOutcome.DF, CompetencyOutcome.S, CompetencyOutcome.D];

export const calculateFaultCount = (value: number | boolean | CompetencyOutcome): number => {
  if (isBoolean(value)) {
    return value ? 1 : 0;
  }
  if (isNumber(value)) {
    return value;
  }
  if (competencyOutcomes.includes(value)) {
    return 1;
  }
  return 0;
};

export const getCompetencyFaults = (
  faults: DrivingFaults | SeriousFaults | DangerousFaults | SingleFaultCompetencies
): FaultSummary[] => {
  const faultsEncountered: FaultSummary[] = [];

  forOwn(
    faults,
    (
      value: number | boolean | CompetencyOutcome,
      key: string,
      obj: DrivingFaults | SeriousFaults | DangerousFaults
    ) => {
      const faultCount = calculateFaultCount(value);
      const isSingleFaultCompetency: boolean = competencyOutcomes.includes(value as CompetencyOutcome);

      if (faultCount > 0 && !key.endsWith(CompetencyIdentifiers.COMMENTS_SUFFIX)) {
        const label = key as keyof typeof fullCompetencyLabels;
        const comment = obj[`${key}${CompetencyIdentifiers.COMMENTS_SUFFIX}`] || null;
        const faultSummary: FaultSummary = {
          comment,
          faultCount,
          competencyIdentifier: key,
          competencyDisplayName: fullCompetencyLabels[label],
          source: isSingleFaultCompetency ? CommentSource.SINGLE_FAULT_COMPETENCY : CommentSource.SIMPLE,
        };
        faultsEncountered.push(faultSummary);
      }
    }
  );

  return faultsEncountered.sort((a, b) => b.faultCount - a.faultCount);
};

export const getCompetencyComment = (
  key: string,
  controlFaultComments: string,
  observationFaultComments: string
): string => {
  if (key === CompetencyIdentifiers.CONTROL_FAULT) {
    return controlFaultComments || '';
  }
  return observationFaultComments || '';
};
