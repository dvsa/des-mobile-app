import { createAction } from '@ngrx/store';

export const LessonPlanningOverallScoreChanged = createAction(
  '[LessonPlanning] Score changed',
  (score: number) => ({ score }),
);

export const LessonPlanningQuestionScoreChanged = createAction(
  '[LessonPlanning] Question score changed',
  (question: number, score: number) => ({ question, score }),
);
