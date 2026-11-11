import { describe, expect, it } from 'vitest';
import { SetActivityCode } from '../activity-code.actions';
import { activityCodeReducer } from '../activity-code.reducer';

describe('activityCodeReducer', () => {
  describe('SetActivityCode', () => {
    it('should set the correct activity code', () => {
      const result = activityCodeReducer(null, SetActivityCode('1'));
      expect(result).toEqual('1');
    });
  });
});
