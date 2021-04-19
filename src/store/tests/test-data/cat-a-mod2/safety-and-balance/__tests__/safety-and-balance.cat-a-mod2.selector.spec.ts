import { TestData } from '@dvsa/mes-test-schema/categories/AM2';
import { safetyAndBalanceQuestionsExist } from '../safety-and-balance.cat-a-mod2.selector';

describe('Vehicle Checks Selector Cat A Mod 2', () => {

  describe('vehicleChecksExist', () => {
    it('should return false if there are no vehicle checks entered', () => {
      const emptySafetyAndBalanceQuestions: TestData['safetyAndBalanceQuestions'] = {
        safetyQuestions: [{}, {}],
        balanceQuestions: [{}],
      };
      const result = safetyAndBalanceQuestionsExist(emptySafetyAndBalanceQuestions);
      expect(result).toBe(false);
    });

    it('should return true if there are safety questions entered', () => {
      const populatedSafetyAndBalanceQuestions: TestData['safetyAndBalanceQuestions'] = {
        safetyQuestions: [{
          code: 'SQ1',
          description: 'test SQ1',
          outcome: 'P',
        }],
        balanceQuestions: [{}],
      };
      const result = safetyAndBalanceQuestionsExist(populatedSafetyAndBalanceQuestions);
      expect(result).toBe(true);
    });

    it('should return true if there are balance questions entered', () => {
      const populatedSafetyAndBalanceQuestions: TestData['safetyAndBalanceQuestions'] = {
        safetyQuestions: [{}],
        balanceQuestions: [{
          code: 'BQ1',
          description: 'test BQ1',
          outcome: 'DF',
        }],
      };
      const result = safetyAndBalanceQuestionsExist(populatedSafetyAndBalanceQuestions);
      expect(result).toBe(true);
    });

    it('should return false if there are safety and balance questions but no outcome selected', () => {
      const populatedSafetyAndBalanceQuestions: TestData['safetyAndBalanceQuestions'] = {
        safetyQuestions: [{
          code: 'SQ1',
          description: 'test SQ1',
          outcome: null,
        }, {
          code: 'SQ2',
          description: 'test SQ2',
          outcome: null,
        }],
        balanceQuestions: [{
          code: 'BQ1',
          description: 'test BQ1',
          outcome: null,
        }],
      };
      const result = safetyAndBalanceQuestionsExist(populatedSafetyAndBalanceQuestions);
      expect(result).toBe(false);
    });
  });
});
