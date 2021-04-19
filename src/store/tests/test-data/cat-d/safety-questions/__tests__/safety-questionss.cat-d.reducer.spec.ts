import { CatDUniqueTypes } from '@dvsa/mes-test-schema/categories/D';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { safetyQuestionsCatDReducer } from '../safety-questions.cat-d.reducer';
import {
  SafetyQuestionOutcomeChanged,
  AddSafetyQuestionComment,
} from '../safety-questions.cat-d.action';

describe('Safety Questions Cat D Reducer', () => {

  const mockSafetyQuestions: CatDUniqueTypes.SafetyQuestions = {
    questions: [
      {
        description: 'Lebron',
        outcome: CompetencyOutcome.P,
      },
      {
        description: 'Kd',
        outcome: CompetencyOutcome.P,
      },
      {
        description: 'Dame',
        outcome: CompetencyOutcome.P,
      },
    ],
    faultComments: '',
  };

  describe('SAFETY_QUESTION_OUTCOME_CHANGED', () => {
    it('should update the outcome property for the object at the specified index', () => {
      const state = mockSafetyQuestions;
      const result = safetyQuestionsCatDReducer(state, SafetyQuestionOutcomeChanged('DF', 1));
      expect(result.questions[1].outcome).toEqual('DF');
    });
  });

  describe('ADD_SAFETY_QUESTION_COMMENT', () => {
    it('should update the outcome property for the object at the specified index', () => {
      const state = mockSafetyQuestions;
      const result = safetyQuestionsCatDReducer(state, AddSafetyQuestionComment('DVSA rocks!!!'));
      expect(result.faultComments).toEqual('DVSA rocks!!!');
    });
  });
});
