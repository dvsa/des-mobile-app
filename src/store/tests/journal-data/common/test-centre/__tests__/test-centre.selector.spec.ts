import { getCostCentre } from '../test-centre.selector';
import { TestCentre } from '@dvsa/mes-test-schema/categories/common';

describe('testCentre selector', () => {
  const testCentre: TestCentre = {
    centreId: 1,
    costCode: '1234',
  };

  describe('getCostCentre', () => {
    it('should return the cost centre', () => {
      expect(getCostCentre(testCentre)).toBe('1234');
    });
  });
});
