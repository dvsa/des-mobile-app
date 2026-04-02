import {
  TestData as CatADI3TestData,
  LessonPlanning,
  TeachingLearningStrategies,
} from '@dvsa/mes-test-schema/categories/ADI3';
import { createSelector } from '@ngrx/store';
import { selectTestData } from '@store/tests/test-data/common/test-data.selector';

export const getTeachingLearningScore = (teachingLearning: TeachingLearningStrategies) => teachingLearning.score;

export const selectTeachingLearningScore = createSelector(
  selectTestData,
  (test): LessonPlanning => (test as CatADI3TestData).teachingLearningStrategies
);
