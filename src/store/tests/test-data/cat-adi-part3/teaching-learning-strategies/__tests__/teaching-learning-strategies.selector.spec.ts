import {
  getTeachingLearningScore,
} from '@store/tests/test-data/cat-adi-part3/teaching-learning-strategies/teaching-learning-strategies.selector';

describe('teaching learning strategies selector', () => {
  describe('getTeachingLearningScore', () => {
    it('should return the score for teachingLearning', () => {
      const result = getTeachingLearningScore({ score: 1 });

      expect(result).toBe(1);
    });
  });
});
