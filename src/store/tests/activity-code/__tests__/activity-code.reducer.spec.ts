import { activityCodeReducer } from '../activity-code.reducer';
import { SetActivityCode } from '../activity-code.actions';
import { ActivityCode } from '@dvsa/mes-test-schema/categories/common';

describe('activityCodeReducer', () => {
  describe('SetActivityCode', () => {
    it('should set the correct activity code', () => {
      const result = activityCodeReducer(null, SetActivityCode({ payload: '1' }));
      expect(result).toEqual('1');
    });
  });
});
