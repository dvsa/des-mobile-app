import { TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { getPageNameByCategoryAndKey } from '@pages/page-names.constants';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';

describe('PageNameConstants', () => {

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        IonicModule,
      ],
    });
  }));

  describe('getPageNameByCategoryAndKey', () => {
    it('should return OfficeCatADIPart2Page if the category is ADI2', () => {
      expect(getPageNameByCategoryAndKey(TestCategory.ADI2, 'OFFICE_PAGE')).toEqual('OfficeCatADIPart2Page');
    });
    it('should return undefined if the category is A', () => {
      expect(getPageNameByCategoryAndKey(TestCategory.A, 'OFFICE_PAGE')).toEqual(undefined);
    });
    [TestCategory.ADI3, TestCategory.SC].forEach((value) => {
      it('should return OfficeCatADIPart3Page if the category is ' + value, () => {
        expect(getPageNameByCategoryAndKey(value, 'OFFICE_PAGE')).toEqual('OfficeCatADIPart3Page');
      });
    });
    it('should return OfficeCatBPage if the category is B', () => {
      expect(getPageNameByCategoryAndKey(TestCategory.B, 'OFFICE_PAGE')).toEqual('OfficeCatBPage');
    });
    [TestCategory.C, TestCategory.C1, TestCategory.CE, TestCategory.C1E].forEach((value) => {
      it('should return OfficeCatCPage if the category is ' + value, () => {
        expect(getPageNameByCategoryAndKey(value, 'OFFICE_PAGE')).toEqual('OfficeCatCPage');
      });
    });
    [TestCategory.CCPC, TestCategory.DCPC].forEach((value) => {
      it('should return OfficeCatCPCPage if the category is ' + value, () => {
        expect(getPageNameByCategoryAndKey(value, 'OFFICE_PAGE')).toEqual('OfficeCatCPCPage');
      });
    });
    [TestCategory.D, TestCategory.D1, TestCategory.DE, TestCategory.D1E].forEach((value) => {
      it('should return OfficeCatDPage if the category is ' + value, () => {
        expect(getPageNameByCategoryAndKey(value, 'OFFICE_PAGE')).toEqual('OfficeCatDPage');
      });
    });
    [TestCategory.F, TestCategory.G, TestCategory.H, TestCategory.K].forEach((value) => {
      it('should return OfficeCatHomeTestPage if the category is ' + value, () => {
        expect(getPageNameByCategoryAndKey(value, 'OFFICE_PAGE')).toEqual('OfficeCatHomeTestPage');
      });
    });
    [
      TestCategory.EUA1M1,
      TestCategory.EUA2M1,
      TestCategory.EUAM1,
      TestCategory.EUAMM1,
    ].forEach((value) => {
      it('should return OfficeCatAMod1Page if the category is ' + value, () => {
        expect(getPageNameByCategoryAndKey(value, 'OFFICE_PAGE')).toEqual('OfficeCatAMod1Page');
      });
    });
    [
      TestCategory.EUA1M2,
      TestCategory.EUA2M2,
      TestCategory.EUAM2,
      TestCategory.EUAMM2,
    ].forEach((value) => {
      it('should return OfficeCatAMod2Page if the category is ' + value, () => {
        expect(getPageNameByCategoryAndKey(value, 'OFFICE_PAGE')).toEqual('OfficeCatAMod2Page');
      });
    });
    [
      TestCategory.CM,
      TestCategory.C1M,
      TestCategory.CEM,
      TestCategory.C1EM,
      TestCategory.DM,
      TestCategory.D1M,
      TestCategory.DEM,
      TestCategory.D1EM,
    ].forEach((value) => {
      it('should return OfficeCatManoeuvrePage if the category is ' + value, () => {
        expect(getPageNameByCategoryAndKey(value, 'OFFICE_PAGE')).toEqual('OfficeCatManoeuvrePage');
      });
    });
  });
});
