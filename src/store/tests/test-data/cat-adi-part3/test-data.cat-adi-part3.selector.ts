import { TestData } from '@dvsa/mes-test-schema/categories/ADI3';

export const getTotalScore = (data: TestData): number =>
  (data.teachingLearningStrategies.score + data.riskManagement.score + data.lessonPlanning.score);
