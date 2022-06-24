import { LessonPlanning } from '@dvsa/mes-test-schema/categories/ADI3';

export const getLessonPlanningQ1 = (lessonPlanning: LessonPlanning) => lessonPlanning.q1;
export const getLessonPlanningQ2 = (lessonPlanning: LessonPlanning) => lessonPlanning.q2;
export const getLessonPlanningQ3 = (lessonPlanning: LessonPlanning) => lessonPlanning.q3;
export const getLessonPlanningQ4 = (lessonPlanning: LessonPlanning) => lessonPlanning.q4;
export const getLessonPlanningScore = (lessonPlanning: LessonPlanning) => lessonPlanning.score;
