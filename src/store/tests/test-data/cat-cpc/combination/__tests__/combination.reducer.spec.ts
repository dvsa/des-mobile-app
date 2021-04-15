import { PopulateCombination } from '../combination.action';
import { combinationReducer } from '../combination.reducer';

describe('combinationReducer', () => {
  describe('PopulateCombination', () => {
    it('should set combination', () => {
      const result = combinationReducer(null, PopulateCombination('LGV1'));
      expect(result).toEqual('LGV1');
    });
  });
});
