import { totalScoreReducer } from '@store/tests/test-data/cat-adi-part3/total-score/total-score.reducer';
import * as testRequirementsActions from '../total-score.actions';

describe('totalScoreReducer', () => {
  describe('TotalScoreChanged', () => {
    it('should change score to the value passed when called', () => {
      const result = totalScoreReducer(0, testRequirementsActions.TotalScoreChanged(1));
      expect(result).toEqual(1);
    });
  });
});
