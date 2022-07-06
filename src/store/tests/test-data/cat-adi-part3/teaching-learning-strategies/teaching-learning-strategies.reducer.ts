import { TeachingLearningStrategies } from '@dvsa/mes-test-schema/categories/ADI3';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import { teachingLearningStrategies } from '@shared/constants/adi3-questions/teaching-learning-strategies.constants';
import * as teachingLearningStrategiesActions from './teaching-learning-strategies.actions';

export const initialState: TeachingLearningStrategies = {
  q1: { title: teachingLearningStrategies.q1, score: null },
  q2: { title: teachingLearningStrategies.q2, score: null },
  q3: { title: teachingLearningStrategies.q3, score: null },
  q4: { title: teachingLearningStrategies.q4, score: null },
  q5: { title: teachingLearningStrategies.q5, score: null },
  q6: { title: teachingLearningStrategies.q6, score: null },
  q7: { title: teachingLearningStrategies.q7, score: null },
  q8: { title: teachingLearningStrategies.q8, score: null },
  score: 0,
};

export const teachingLearningStrategiesReducer = createReducer(
  initialState,
  on(teachingLearningStrategiesActions.TeachingLearningStrategiesQuestionScoreChanged, (state, {
    question,
    score,
  }): TeachingLearningStrategies => ({
    ...state,
    [`q${question}`]: {
      ...state[`q${question}`],
      score,
    },
  })),
  on(teachingLearningStrategiesActions.TeachingLearningStrategiesOverallScoreChanged, (state, {
    score,
  }): TeachingLearningStrategies => ({
    ...state,
    score,
  })),
);

export const getTeachingLearningStrategies = createFeatureSelector<TeachingLearningStrategies>(
  'teachingLearningStrategies',
);
