import { CatDUniqueTypes } from '@dvsa/mes-test-schema/categories/D';
import { QuestionOutcome } from '@dvsa/mes-test-schema/categories/common';
import { createReducer, on } from '@ngrx/store';
import * as safetyQuestionsCatDActionTypes from './safety-questions.cat-d.action';

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
  on(safetyQuestionsCatDActionTypes.SafetyQuestionOutcomeChanged, (state, { safetyQuestionOutcome, index }) => ({
    ...state,
    questions: state.questions.map((item, itemIndex) => (index === itemIndex ? {
      ...item,
      outcome: safetyQuestionOutcome,
    } : item)),
  })),
  on(safetyQuestionsCatDActionTypes.AddSafetyQuestionComment, (state, { comment }) => ({
    ...state,
    faultComments: comment,
  })),
);
