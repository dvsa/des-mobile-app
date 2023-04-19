import {
  teachingLearningStrategiesReducer,
} from '@store/tests/test-data/cat-adi-part3/teaching-learning-strategies/teaching-learning-strategies.reducer';
import * as teachingLearningStrategiesActions from '../teaching-learning-strategies.actions';

describe('vehicleDetailsCatDReducer', () => {

  describe('teachingLearningStrategiesReducer', () => {
    it('should set the question number equal to the first '
        + 'parameters score to the value of the second parameter ', () => {
      const result = teachingLearningStrategiesReducer(
        { }, teachingLearningStrategiesActions.TeachingLearningStrategiesQuestionScoreChanged(1, 1),
      );
      expect(result).toEqual({ q1: { score: 1 } });
    });
  });
  describe('TeachingLearningStrategiesOverallScoreChanged', () => {
    it('should set score to the value given', () => {
      const result = teachingLearningStrategiesReducer(
        { score: null }, teachingLearningStrategiesActions.TeachingLearningStrategiesOverallScoreChanged(1),
      );
      expect(result).toEqual({ score: 1 });
    });
  });

});
