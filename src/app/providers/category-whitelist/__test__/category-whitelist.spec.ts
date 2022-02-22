import { TestBed } from '@angular/core/testing';
import { CategoryWhitelistProvider } from '../category-whitelist';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';

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
    it('shout return true if category whitelisted', () => {
      expect(provider.isWhiteListed(TestCategory.B)).toEqual(true);
    });

    it('shout return false if category blacklisted', () => {
      expect(provider.isWhiteListed(TestCategory.A)).toEqual(false);
    });
  });

});
