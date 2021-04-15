import { PopulateTestScore } from '../total-percentage.action';
import { totalPercentageReducer } from '../total-percentage.reducer';

describe('totalPercentageReducer', () => {
  describe('PopulateCombination', () => {
    it('should set total percentage', () => {
      const result = totalPercentageReducer(null, PopulateTestScore(50));
      expect(result).toEqual(50);
    });
  });
});
