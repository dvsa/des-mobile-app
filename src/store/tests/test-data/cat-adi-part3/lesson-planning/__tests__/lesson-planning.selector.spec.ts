import {
  getLessonPlanningQ1, getLessonPlanningQ2, getLessonPlanningQ3, getLessonPlanningQ4,
  getLessonPlanningScore,
} from '@store/tests/test-data/cat-adi-part3/lesson-planning/lesson-planning.selector';

describe('teaching learning strategies selector', () => {
  describe('getLessonPlanningQ1', () => {
    it('should return q1 for lessonPlanning', () => {
      const result = getLessonPlanningQ1({ q1: { title: 'test', score: 1 } });
      expect(result).toEqual({ title: 'test', score: 1 });
    });
  });
  describe('getLessonPlanningQ2', () => {
    it('should return q2 for lessonPlanning', () => {
      const result = getLessonPlanningQ2({ q2: { title: 'test', score: 1 } });
      expect(result).toEqual({ title: 'test', score: 1 });
    });
  });
  describe('getLessonPlanningQ3', () => {
    it('should return q3 for lessonPlanning', () => {
      const result = getLessonPlanningQ3({ q3: { title: 'test', score: 1 } });
      expect(result).toEqual({ title: 'test', score: 1 });
    });
  });
  describe('getLessonPlanningQ4', () => {
    it('should return q4 for lessonPlanning', () => {
      const result = getLessonPlanningQ4({ q4: { title: 'test', score: 1 } });
      expect(result).toEqual({ title: 'test', score: 1 });
    });
  });
  describe('getLessonPlanningScore', () => {
    it('should return score for lessonPlanning', () => {
      const result = getLessonPlanningScore({ score: 1 });
      expect(result).toEqual(1);
    });
  });
});
