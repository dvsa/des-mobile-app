import { createAction } from '@ngrx/store';

export const TeachingLearningStrategiesOverallScoreChanged = createAction(
  '[TeachingLearningStrategies] Score changed',
  (score: number) => ({ score }),
);

export const TeachingLearningStrategiesQuestionScoreChanged = createAction(
  '[TeachingLearningStrategies] Question score changed',
  (question: number, score: number) => ({ question, score }),
);
