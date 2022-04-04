import { CatDUniqueTypes } from '@dvsa/mes-test-schema/categories/D';
import { QuestionOutcome } from '@dvsa/mes-test-schema/categories/common';
import { createReducer, on } from '@ngrx/store';
import * as safetyQuestionsCatAMod2ActionTypes from './safety-questions.cat-a-mod2.action';

const initialState: CatDUniqueTypes.SafetyQuestions = {
  questions: [
    {
      description: 'Fire Extinguisher',
      outcome: undefined as QuestionOutcome,
    },
    {
      description: 'Emergency exit',
      outcome: undefined as QuestionOutcome,
    },
    {
      description: 'Fuel cutoff',
      outcome: undefined as QuestionOutcome,
    },
  ],
  faultComments: '',
};

export const safetyQuestionsCatDReducer = createReducer(
  initialState,
  on(safetyQuestionsCatAMod2ActionTypes.SafetyQuestionOutcomeChanged, (state, { safetyQuestionOutcome, index }) => ({
    ...state,
    questions: state.questions.map((item, itemIndex) => (index === itemIndex ? {
      ...item,
      outcome: safetyQuestionOutcome,
    } : item)),
  })),
  on(safetyQuestionsCatAMod2ActionTypes.AddSafetyQuestionComment, (state, { comment }) => ({
    ...state,
    faultComments: comment,
  })),
);
