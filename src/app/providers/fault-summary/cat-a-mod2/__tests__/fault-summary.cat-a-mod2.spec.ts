import { FaultSummaryCatAM2Helper } from '../fault-summary.cat-a-mod2';
import { catAM2TestDataStateObject } from './cat-AM2-test-data-mock';
import { CommentSource, CompetencyIdentifiers } from '../../../../shared/models/fault-marking.model';
import { CompetencyOutcome } from '../../../../shared/models/competency-outcome';
import { CompetencyDisplayName } from '../../../../shared/models/competency-display-name';

describe('FaultSummaryCatAM2Helper', () => {

  const expectedEyesightTestFault = [
    {
      competencyDisplayName: CompetencyDisplayName.EYESIGHT_TEST,
      competencyIdentifier: CompetencyIdentifiers.EYESIGHT_TEST,
      comment: '',
      source: CommentSource.EYESIGHT_TEST,
      faultCount: 1,
    },
  ];

  const expectedSafetyAndBalanceQuestionsFault = [
    {
      competencyIdentifier: 'safetyAndBalanceQuestions',
      competencyDisplayName: CompetencyDisplayName.SAFETY_AND_BALANCE_QUESTIONS,
      comment: 'Fell over. A lot!',
      source: CommentSource.SAFETY_AND_BALANCE_QUESTIONS,
      faultCount: 1,
    },
  ];

  describe('getEyesightTestSeriousFault', () => {
    it('should return a serious fault if eyesight test failed', () => {
      catAM2TestDataStateObject.eyesightTest.complete = true;
      catAM2TestDataStateObject.eyesightTest.seriousFault = true;

      expect(FaultSummaryCatAM2Helper.getEyesightTestSeriousFault(
        catAM2TestDataStateObject.eyesightTest,
      )).toEqual(expectedEyesightTestFault);
    });
    it('should return an empty array if eyesight test passed', () => {
      catAM2TestDataStateObject.eyesightTest.complete = true;
      catAM2TestDataStateObject.eyesightTest.seriousFault = false;

      expect(FaultSummaryCatAM2Helper.getEyesightTestSeriousFault(
        catAM2TestDataStateObject.eyesightTest,
      )).toEqual([]);
    });
  });

  describe('getSafetyAndBalanceFaults', () => {
    it('should return a single driving fault if any safety / balance questions are incorrect', () => {

      expect(FaultSummaryCatAM2Helper.getSafetyAndBalanceFaults(
        catAM2TestDataStateObject.safetyAndBalanceQuestions,
      )).toEqual(expectedSafetyAndBalanceQuestionsFault);
    });
    it('should return an empty array if all safety / balance questions are correct', () => {
      catAM2TestDataStateObject.safetyAndBalanceQuestions.safetyQuestions[0].outcome = CompetencyOutcome.P;
      catAM2TestDataStateObject.safetyAndBalanceQuestions.safetyQuestions[1].outcome = CompetencyOutcome.P;
      catAM2TestDataStateObject.safetyAndBalanceQuestions.balanceQuestions[0].outcome = CompetencyOutcome.P;

      expect(FaultSummaryCatAM2Helper.getSafetyAndBalanceFaults(
        catAM2TestDataStateObject.safetyAndBalanceQuestions,
      )).toEqual([]);
    });
  });
});
