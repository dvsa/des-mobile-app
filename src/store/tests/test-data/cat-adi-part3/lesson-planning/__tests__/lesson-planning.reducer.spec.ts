import { lessonPlanningReducer } from '@store/tests/test-data/cat-adi-part3/lesson-planning/lesson-planning.reducer';
import * as lessonPlanningActions from '../lesson-planning.actions';

describe('lessonPlanningReducer', () => {

  describe('TeachingLearningStrategiesQuestionScoreChanged', () => {
    it('should set the question number equal to the first '
        + 'parameters score to the value of the second parameter ', () => {
      const result = lessonPlanningReducer(
        { }, lessonPlanningActions.LessonPlanningQuestionScoreChanged(1, 1),
      );
      expect(result).toEqual({ q1: { score: 1 } });
    });
  });
  describe('TeachingLearningStrategiesOverallScoreChanged', () => {
    it('should set score to the value given', () => {
      const result = lessonPlanningReducer(
        { score: null }, lessonPlanningActions.LessonPlanningOverallScoreChanged(1),
      );
      expect(result).toEqual({ score: 1 });
    });
  });

});
