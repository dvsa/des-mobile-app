import { isRekey } from '../rekey.selector';

describe('rekey selector', () => {
  describe('isRekey', () => {
    it('should return true if the test is a rekey', () => {
      const state: boolean = true;
      expect(isRekey(state)).toEqual(true);
    });
    it('should return false if the test is not a rekey', () => {
      const state: boolean = false;
      expect(isRekey(state)).toEqual(false);
    });
  });
});
