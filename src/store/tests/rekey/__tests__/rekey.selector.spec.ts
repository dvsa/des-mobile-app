import { isRekey, selectRekey } from '../rekey.selector';

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

  describe('selectRekey', () => {
    it('should return true when the current test is marked as rekey', () => {
      const state: any = {
        tests: {
          currentTest: { slotId: '123' },
          startedTests: {
            123: {
              rekey: true,
            },
          },
        },
      };

      expect(selectRekey(state)).toEqual(true);
    });

    it('should return false when the current test does not have a rekey value', () => {
      const state: any = {
        tests: {
          currentTest: { slotId: '123' },
          startedTests: {
            123: {},
          },
        },
      };

      expect(selectRekey(state)).toEqual(false);
    });
  });
});
