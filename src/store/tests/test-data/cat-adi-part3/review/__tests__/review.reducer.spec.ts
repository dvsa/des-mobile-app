import { reviewReducer } from '@store/tests/test-data/cat-adi-part3/review/review.reducer';
import * as reviewActions from '../review.actions';

describe('reviewReducer', () => {
  describe('ImmediateDangerChanged', () => {
    it('should set immediateDanger to the value passed when called', () => {
      const result = reviewReducer(
        { immediateDanger: false }, reviewActions.ImmediateDangerChanged(true),
      );
      expect(result).toEqual({ immediateDanger: true });
    });
  });
  describe('SeekFurtherDevelopmentChanged', () => {
    it('should set seekFurtherDevelopment to the value passed when called', () => {
      const result = reviewReducer(
        { seekFurtherDevelopment: false }, reviewActions.SeekFurtherDevelopmentChanged(true),
      );
      expect(result).toEqual({ seekFurtherDevelopment: true });
    });
  });
  describe('FeedbackChanged', () => {
    it('should set feedback to the value passed when called', () => {
      const result = reviewReducer(
        { feedback: null }, reviewActions.FeedbackChanged('test'),
      );
      expect(result).toEqual({ feedback: 'test' });
    });
  });
  describe('ReasonForNoAdviceGivenChanged', () => {
    it('should set reasonForNoAdviceGiven to the value passed when called', () => {
      const result = reviewReducer(
        { reasonForNoAdviceGiven: null }, reviewActions.ReasonForNoAdviceGivenChanged('test'),
      );
      expect(result).toEqual({ reasonForNoAdviceGiven: 'test' });
    });
  });
  describe('GradeChanged', () => {
    it('should set grade to the value passed when called', () => {
      const result = reviewReducer(
        { grade: null }, reviewActions.GradeChanged('test'),
      );
      expect(result).toEqual({ grade: 'test' });
    });
  });
});
