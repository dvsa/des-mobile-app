import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { getDrivingOrRidingLabel } from '../driver-type';

describe('getDrivingOrRidingLabel()', () => {
  it('should return riding when a category equals EUAM1,', () => {
    const driverType = getDrivingOrRidingLabel(TestCategory.EUAM1);
    expect(driverType).toEqual('riding');
  });

  it('should return riding when a category equals EUA1M2,', () => {
    const driverType = getDrivingOrRidingLabel(TestCategory.EUA1M2);
    expect(driverType).toEqual('riding');
  });

  it('should return driving when a category equals B', () => {
    const driverType = getDrivingOrRidingLabel(TestCategory.B);
    expect(driverType).toEqual('driving');
  });

  it('should return driving when a category equals BE', () => {
    const driverType = getDrivingOrRidingLabel(TestCategory.BE);
    expect(driverType).toEqual('driving');
  });
});
