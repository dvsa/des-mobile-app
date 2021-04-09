import { activityCodeReducer } from '../activity-code.reducer';
import { SetActivityCode } from '../activity-code.actions';

describe('activityCodeReducer', () => {
  describe('SetActivityCode', () => {
    it('should set the correct activity code', () => {
      const result = activityCodeReducer(null, SetActivityCode('1'));
      expect(result).toEqual('1');
    });
  });
});
