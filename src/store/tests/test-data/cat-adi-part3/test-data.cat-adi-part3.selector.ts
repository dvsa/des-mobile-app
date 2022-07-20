import { TestData } from '@dvsa/mes-test-schema/categories/ADI3';

export const getTeachingLearningScore = (data: TestData): number => data.teachingLearningStrategies.score;
export const getRiskManagementScore = (data: TestData): number => data.riskManagement.score;
export const getLessonPlanningScore = (data: TestData): number => data.lessonPlanning.score;
export const getTotalScore = (data: TestData): number => (data.teachingLearningStrategies.score + data.riskManagement.score + data.lessonPlanning.score);
