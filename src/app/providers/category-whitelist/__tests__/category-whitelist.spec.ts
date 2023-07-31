import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { CategoryWhitelistProvider } from '../category-whitelist';

xdescribe('CategoryWhitelistProvider', () => {
  let provider: CategoryWhitelistProvider;

  beforeEach(() => {
    provider = new CategoryWhitelistProvider();
  });

  xdescribe('Should be correctly configured', () => {
    it('should be created successfully', () => {
      expect(provider)
        .toBeTruthy();
    });
  });

  xdescribe('isWhiteListed', () => {
    it('shout return true if category whitelisted', () => {
      expect(provider.isWhiteListed(TestCategory.B))
        .toEqual(true);
    });

    it('shout return false if category blacklisted', () => {
      expect(provider.isWhiteListed(TestCategory.A))
        .toEqual(false);
    });
  });

});
