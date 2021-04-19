import { CatDUniqueTypes } from '@dvsa/mes-test-schema/categories/D';
import { safetyQuestionsExist } from '../safety-questions.cat-d.selector';

describe('Safety Questions Selector Cat D', () => {

  describe('safetyQuestionsExist', () => {
    it('should return false if there are no safety questions entered', () => {
      const emptySafetyQuestions: CatDUniqueTypes.SafetyQuestions = { questions: [{}], faultComments: '' };
      const result = safetyQuestionsExist(emptySafetyQuestions);
      expect(result).toBeFalsy();
    });
    it('should return true if there are safety checks entered', () => {
      const populatedSafetyQuestions: CatDUniqueTypes.SafetyQuestions = {
        questions: [{ description: 'test s01', outcome: 'P' }],
        faultComments: '',
      };
      const result = safetyQuestionsExist(populatedSafetyQuestions);
      expect(result).toBeTruthy();
    });
    it('should return false if there are safety questions but no outcome selected', () => {
      const populatedSafetyQuestions: CatDUniqueTypes.SafetyQuestions = {
        questions: [{ description: 'test s01', outcome: null }],
        faultComments: '',
      };
      const result = safetyQuestionsExist(populatedSafetyQuestions);
      expect(result).toBeFalsy();
    });
  });
});
