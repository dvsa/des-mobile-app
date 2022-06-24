import { LessonPlanning } from '@dvsa/mes-test-schema/categories/ADI3';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import { lessonPlanning } from '@shared/constants/adi3-questions/lesson-planning.constants';
import * as lessonPlanningActions from './lesson-planning.actions';

export const initialState: LessonPlanning = {
  q1: {
    title: lessonPlanning.q1,
    score: null,
  },
  q2: {
    title: lessonPlanning.q2,
    score: null,
  },
  q3: {
    title: lessonPlanning.q3,
    score: null,
  },
  q4: {
    title: lessonPlanning.q4,
    score: null,
  },
  score: 0,
};

export const lessonPlanningReducer = createReducer(
  initialState,
  on(lessonPlanningActions.LessonPlanningQuestionScoreChanged, (state, { question, score }): LessonPlanning => ({
    ...state,
    [`q${question}`]: {
      ...[`q${question}`],
      score,
    },
  })),
  on(lessonPlanningActions.LessonPlanningOverallScoreChanged, (state, { score }): LessonPlanning => ({
    ...state,
    score,
  })),
);

export const getLessonPlanning = createFeatureSelector<LessonPlanning>('lessonPlanning');
