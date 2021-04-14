import {
  TestData,
  EyesightTest,
  SafetyAndBalanceQuestions,
} from '@dvsa/mes-test-schema/categories/AM2';
import { CommentSource, CompetencyIdentifiers, FaultSummary } from '@shared/models/fault-marking.model';
import { CompetencyDisplayName } from '@shared/models/competency-display-name';
import { getCompetencyFaults } from '@shared/helpers/get-competency-faults';
import { CompetencyOutcome } from '@shared/models/competency-outcome';

export class FaultSummaryCatAM2Helper {

  public static getDrivingFaultsCatAM2(data: TestData): FaultSummary[] {
    return [
      ...getCompetencyFaults(data.drivingFaults),
      ...this.getSafetyAndBalanceFaults(data.safetyAndBalanceQuestions),
    ];
  }

  public static getSeriousFaultsCatAM2(data: TestData): FaultSummary[] {
    return [
      ...getCompetencyFaults(data.seriousFaults),
      ...this.getEyesightTestSeriousFault(data.eyesightTest),
    ];
  }

  public static getDangerousFaultsCatAM2(data: TestData): FaultSummary[] {
    return [
      ...getCompetencyFaults(data.dangerousFaults),
    ];
  }

  public static getEyesightTestSeriousFault(eyesightTest: EyesightTest): FaultSummary[] {
    if (!eyesightTest || !eyesightTest.seriousFault) {
      return [];
    }
    return [{
      competencyDisplayName: CompetencyDisplayName.EYESIGHT_TEST,
      competencyIdentifier: CompetencyIdentifiers.EYESIGHT_TEST,
      comment: eyesightTest.faultComments || '',
      source: CommentSource.EYESIGHT_TEST,
      faultCount: 1,
    }];
  }

  public static getSafetyAndBalanceFaults(safetyAndBalance: SafetyAndBalanceQuestions): FaultSummary[] {
    if (!safetyAndBalance) {
      return [];
    }

    const allSafetyQuestions = safetyAndBalance.safetyQuestions;
    const allBalanceQuestions = safetyAndBalance.balanceQuestions;
    const someSafetyQuestionsFailed = allSafetyQuestions.some((v) => v.outcome === CompetencyOutcome.DF);
    const someBalanceQuestionsFailed = allBalanceQuestions.some((v) => v.outcome === CompetencyOutcome.DF);

    if (someSafetyQuestionsFailed || someBalanceQuestionsFailed) {
      return [{
        competencyDisplayName: CompetencyDisplayName.SAFETY_AND_BALANCE_QUESTIONS,
        competencyIdentifier: 'safetyAndBalanceQuestions',
        source: CommentSource.SAFETY_AND_BALANCE_QUESTIONS,
        comment: safetyAndBalance.safetyAndBalanceComments || '',
        faultCount: 1,
      }];
    }

    return [];
  }
}
