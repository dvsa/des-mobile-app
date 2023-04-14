import { TestBed } from '@angular/core/testing';
import { NavigationStateProvider } from '@providers/navigation-state/navigation-state';
import { REKEY_SEARCH_PAGE, DELEGATED_REKEY_SEARCH_PAGE } from '@pages/page-names.constants';
import { Router } from '@angular/router';

describe('navigation-state', () => {
  let navProvider: NavigationStateProvider;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NavigationStateProvider,
      ],
    });

    navProvider = TestBed.inject(NavigationStateProvider);
  });

  describe('isRekeySearch', () => {
    it('should return true if the url contains REKEY_SEARCH_PAGE', () => {
      navProvider['router'] = { url: REKEY_SEARCH_PAGE } as Router;
      expect(navProvider.isRekeySearch()).toEqual(true);
    });
    it('should return false if the url does not contain REKEY_SEARCH_PAGE', () => {
      navProvider['router'] = { url: 'test' } as Router;
      expect(navProvider.isRekeySearch()).toEqual(false);
    });
  });
  describe('isDelegatedExaminerRekeySearch', () => {
    it('should return true if the url contains DELEGATED_REKEY_SEARCH_PAGE', () => {
      navProvider['router'] = { url: DELEGATED_REKEY_SEARCH_PAGE } as Router;
      expect(navProvider.isDelegatedExaminerRekeySearch()).toEqual(true);
    });
    it('should return false if the url does not contain DELEGATED_REKEY_SEARCH_PAGE', () => {
      navProvider['router'] = { url: 'test' } as Router;
      expect(navProvider.isDelegatedExaminerRekeySearch()).toEqual(false);
    });
  });
});
