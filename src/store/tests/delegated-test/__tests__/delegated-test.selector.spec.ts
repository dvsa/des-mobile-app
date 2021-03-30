import { isDelegatedTest } from '../delegated-test.selector';

describe('Delegated test selector', () => {
  describe('isDelegated', () => {
    it('should return true if the test is a delegated test', () => {
      const state: boolean = true;
      expect(isDelegatedTest(state)).toEqual(true);
    });
  });
});
