import { TestBed } from '@angular/core/testing';
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

});
