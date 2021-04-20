import { VehicleDetails } from '@dvsa/mes-test-schema/categories/AM1';
import { getSchoolBike } from '../vehicle-details.cat-a-mod1.selector';

describe('vehicle details CAT A Mod 1 selector', () => {
  const state: VehicleDetails = {
    schoolBike: true,
  };

  describe('getSchoolBike', () => {
    it('should retrieve if the bike is a school one from the vehicle details', () => {
      expect(getSchoolBike(state)).toBe(true);
    });
  });
});
