import {
  TestData, SingleFaultCompetencies, Avoidance, EmergencyStop,
} from '@dvsa/mes-test-schema/categories/AM1';
import { get, pickBy, startsWith } from 'lodash';
import { FaultSummary, CommentSource } from '@shared/models/fault-marking.model';
import { getCompetencyFaults } from '@shared/helpers/get-competency-faults';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { fullCompetencyLabels } from '@shared/constants/competencies/competencies';
import { Competencies } from '../../../../store/tests/test-data/test-data.constants';

export class FaultSummaryCatAM1Helper {

  public static getDrivingFaultsCatAM1(data: TestData): FaultSummary[] {

    const singleFaultCompetenciesWithDrivingFaults: SingleFaultCompetencies = FaultSummaryCatAM1Helper
      .matchCompetenciesIncludingComments(
        data.singleFaultCompetencies, CompetencyOutcome.DF,
      );

    return [
      ...getCompetencyFaults(data.drivingFaults),
      ...getCompetencyFaults(singleFaultCompetenciesWithDrivingFaults),
    ];
  }

  public static getSeriousFaultsCatAM1(data: TestData): FaultSummary[] {

    const singleFaultCompetenciesWithSeriousFaults: SingleFaultCompetencies = FaultSummaryCatAM1Helper
      .matchCompetenciesIncludingComments(
        data.singleFaultCompetencies, CompetencyOutcome.S,
      );

    return [
      ...getCompetencyFaults(data.seriousFaults),
      ...getCompetencyFaults(singleFaultCompetenciesWithSeriousFaults),
      ...FaultSummaryCatAM1Helper.getSpeedCheckAvoidance(data.avoidance),
      ...FaultSummaryCatAM1Helper.getSpeedCheckEmergencyStop(data.emergencyStop),
    ];
  }

  public static getDangerousFaultsCatAM1(data: TestData): FaultSummary[] {
    const singleFaultCompetenciesWithDangerousFaults: SingleFaultCompetencies = FaultSummaryCatAM1Helper
      .matchCompetenciesIncludingComments(
        data.singleFaultCompetencies, CompetencyOutcome.D,
      );

    return [
      ...getCompetencyFaults(data.dangerousFaults),
      ...getCompetencyFaults(singleFaultCompetenciesWithDangerousFaults),
    ];
  }

  public static getSpeedCheckAvoidance(avoidance: Avoidance): FaultSummary[] {
    const result = [];
    if (get(avoidance, 'outcome') === CompetencyOutcome.S) {
      const source = `${CommentSource.SPEED_REQUIREMENTS}-${Competencies.speedCheckAvoidance}`;

      result.push(FaultSummaryCatAM1Helper.createFaultSummary(
        Competencies.speedCheckAvoidance, fullCompetencyLabels.speedCheckAvoidance, avoidance.comments, source,
      ));
    }

    return result;
  }

  public static getSpeedCheckEmergencyStop(emergencyStop: EmergencyStop): FaultSummary[] {
    const result = [];
    if (get(emergencyStop, 'outcome') === CompetencyOutcome.S) {
      const source = `${CommentSource.SPEED_REQUIREMENTS}-${Competencies.speedCheckEmergency}`;

      result.push(FaultSummaryCatAM1Helper.createFaultSummary(
        Competencies.speedCheckEmergency, fullCompetencyLabels.speedCheckEmergency, emergencyStop.comments, source,
      ));
    }

    return result;
  }

  public static matchCompetenciesIncludingComments(
    singleFaultCompetencies: SingleFaultCompetencies,
    outcome: CompetencyOutcome,
  ): Partial<SingleFaultCompetencies> {

    const matchedCompetencies = pickBy(singleFaultCompetencies, (val) => val === outcome);
    const matchedComments = pickBy(
      singleFaultCompetencies,
      (val, key) => Object.keys(matchedCompetencies).filter((value) => startsWith(key, value)).length > 0,
    );

    return {
      ...matchedCompetencies,
      ...matchedComments,
    };

  }

  public static createFaultSummary(competencyIdentifier: string,
    competencyName: string,
    competencyComments: string,
    source: string = CommentSource.SIMPLE): FaultSummary {
    return {
      competencyIdentifier,
      source,
      competencyDisplayName: competencyName,
      comment: competencyComments || '',
      faultCount: 1,
    };
  }
}
