import { BikeCategoryDetailProvider } from '../bike-category-detail';
import { BikeCategoryDetail, BikeTestType } from '../bike-category-detail.model';

describe('BikeCategoryDetailProvider', () => {

  let provider: BikeCategoryDetailProvider;

  beforeEach(() => {
    provider = new BikeCategoryDetailProvider();
  });

  describe('getDetailByCategoryCode()', () => {
    it('should return a single category detail object for the provided category code', () => {
      const bikeDetail: BikeCategoryDetail = provider.getDetailByCategoryCode('EUAMM1');
      expect(bikeDetail.imageUrl).toEqual('assets/imgs/bike-category-icons/AM.png');
      expect(bikeDetail.displayId).toEqual('AM');
      expect(bikeDetail.displayName).toEqual('Moped');
    });
  });

  describe('getAllDetailsByTestType()', () => {
    it('should return all matching bike details for a specified test type ', () => {
      const bikeDetails: BikeCategoryDetail[] = provider.getAllDetailsByTestType(BikeTestType.MOD1);
      expect(bikeDetails.length).toEqual(4);
    });
  });

});
