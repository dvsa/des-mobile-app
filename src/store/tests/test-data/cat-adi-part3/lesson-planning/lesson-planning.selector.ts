import { TestData as CatADI3TestData, LessonPlanning } from '@dvsa/mes-test-schema/categories/ADI3';
import { createSelector } from '@ngrx/store';
import { selectTestData } from '@store/tests/test-data/common/test-data.selector';

export const getLessonPlanningQ1 = (lessonPlanning: LessonPlanning) => lessonPlanning.q1;
export const getLessonPlanningQ2 = (lessonPlanning: LessonPlanning) => lessonPlanning.q2;
export const getLessonPlanningQ3 = (lessonPlanning: LessonPlanning) => lessonPlanning.q3;
export const getLessonPlanningQ4 = (lessonPlanning: LessonPlanning) => lessonPlanning.q4;
export const getLessonPlanningScore = (lessonPlanning: LessonPlanning) => lessonPlanning.score;

export const selectLessonPlanning = createSelector(
  selectTestData,
  (test): LessonPlanning => (test as CatADI3TestData).lessonPlanning
);
