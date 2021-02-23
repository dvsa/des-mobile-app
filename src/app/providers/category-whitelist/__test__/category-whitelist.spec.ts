import { TestBed } from '@angular/core/testing';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { CategoryWhitelistProvider } from '../category-whitelist';

describe('CategoryWhitelistProvider', () => {
  let provider: CategoryWhitelistProvider;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    provider = new CategoryWhitelistProvider();
  });

  describe('Should be correctly configured', () => {
    it('should be created successfully', () => {
      expect(provider).toBeTruthy();
    });
  });

  describe('isWhiteListed', () => {
    it('should return true if category is white listed', () => {
      expect(provider.isWhiteListed(TestCategory.B)).toEqual(true);
    });

    it('should return false if category is white listed', () => {
      expect(provider.isWhiteListed(TestCategory.CCPC)).toEqual(false);
    });
  });

});
