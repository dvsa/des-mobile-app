import { get, pickBy } from 'lodash';
import { TestData, SafetyAndBalanceQuestions, QuestionResult } from '@dvsa/mes-test-schema/categories/AM2';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { SafetyQuestionsScore } from '@shared/models/safety-questions-score.model';
import { getCompetencyFaults } from '@shared/helpers/get-competency-faults';

export class FaultCountAM2Helper {
  public static getSafetyAndBalanceFaultCountCatAM2 = (
    safetyAndBalanceQuestions: SafetyAndBalanceQuestions,
  ): SafetyQuestionsScore => {

    if (!safetyAndBalanceQuestions) {
      return { drivingFaults: 0 };
    }

    const safetyQuestions: QuestionResult[] = get(safetyAndBalanceQuestions, 'safetyQuestions', []);
    const balanceQuestions: QuestionResult[] = get(safetyAndBalanceQuestions, 'balanceQuestions', []);

    const numberOfIncorrectSafetyAnswers: number = safetyQuestions.filter((safetyQuestion) => {
      return safetyQuestion.outcome === CompetencyOutcome.DF;
    }).length;
    const numberOfIncorrectBalanceAnswers: number = balanceQuestions.filter((balanceQuestion) => {
      return balanceQuestion.outcome === CompetencyOutcome.DF;
    }).length;

    const totalIncorrectAnswerCount: number = numberOfIncorrectSafetyAnswers + numberOfIncorrectBalanceAnswers;

    return {
      drivingFaults: (totalIncorrectAnswerCount >= 1) ? 1 : 0,
    };
  };

  public static getRidingFaultSumCountCatAM2 = (data: TestData): number => {

    // The way how we store the driving faults differs for certain competencies
    // Because of this we need to pay extra attention on summing up all of them
    const { drivingFaults, safetyAndBalanceQuestions } = data;
    let faultTotal: number = 0;
    getCompetencyFaults(drivingFaults).forEach((fault) => { faultTotal += fault.faultCount; });
    faultTotal += FaultCountAM2Helper.getSafetyAndBalanceFaultCountCatAM2(safetyAndBalanceQuestions).drivingFaults;

    return faultTotal;
  };

  public static getSeriousFaultSumCountCatAM2 = (data: TestData): number => {

    const { seriousFaults, eyesightTest } = data;

    const seriousFaultSumOfSimpleCompetencies = Object.keys(pickBy(seriousFaults)).length;

    const eyesightTestSeriousFaults = (eyesightTest && eyesightTest.seriousFault) ? 1 : 0;

    const result = seriousFaultSumOfSimpleCompetencies
      + eyesightTestSeriousFaults;

    return result;
  };

  public static getDangerousFaultSumCountCatAM2 = (data: TestData): number => {

    const { dangerousFaults } = data;

    return Object.keys(pickBy(dangerousFaults)).length;
  };
}
