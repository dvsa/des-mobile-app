import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { provideBasePageMocks } from '@mocks/test-providers';
import { provideMockStore } from '@ngrx/store/testing';

import { TestCentre } from '@dvsa/mes-journal-schema';
import { ModalController } from '@ionic/angular';

import { AdvancedSearchComponent } from '@pages/test-results-search/components/advanced-search/advanced-search';
import { SearchResultComponent } from '@pages/test-results-search/components/search-result/search-result';
import { TestResultSearchViewDidEnter } from '@pages/test-results-search/test-results-search.actions';

import { AppConfigProvider } from '@providers/app-config/app-config';
import { AppConfig } from '@providers/app-config/app-config.model';
import { ExaminerRole } from '@providers/app-config/constants/examiner-role.constants';

import { SearchResultTestSchema } from '@dvsa/mes-search-schema';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { NetworkStateProviderMock } from '@providers/network-state/__mocks__/network-state.mock';
import { NetworkStateProvider } from '@providers/network-state/network-state';
import { SearchProviderMock } from '@providers/search/__mocks__/search.mock';
import { SearchProvider } from '@providers/search/search';
import { MockComponent } from 'ng-mocks';
import { Observable, Subject, Subscription } from 'rxjs';

import { AdvancedSearchComponent as AdvancedSearchComponent_1 } from '../components/advanced-search/advanced-search';
import { SearchResultComponent as SearchResultComponent_1 } from '../components/search-result/search-result';
import { TestResultsSearchPage } from '../test-results-search';

enum SearchBy {
  DriverNumber = 'driverNumber',
  ApplicationReference = 'appReference',
}

describe('TestResultsSearchPage', () => {
  let fixture: ComponentFixture<TestResultsSearchPage>;
  let component: TestResultsSearchPage;
  let modalController: ModalController;
  let appConfigProviderMock: AppConfigProvider;
  let authProviderMock: AuthenticationProvider;

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        SearchResultComponent_1,
        AdvancedSearchComponent_1,
        TestResultsSearchPage,
        MockComponent(AdvancedSearchComponent),
        MockComponent(SearchResultComponent),
      ],
      providers: [
        provideBasePageMocks(),
        provideMockStore({ initialState: { refData: { testCentres: { active: [], inactive: [] } } } }),
        {
          provide: SearchProvider,
          useClass: SearchProviderMock,
        },
        {
          provide: NetworkStateProvider,
          useClass: NetworkStateProviderMock,
        },
      ],
    });

    fixture = TestBed.createComponent(TestResultsSearchPage);
    component = fixture.componentInstance;
    modalController = TestBed.inject(ModalController);
    appConfigProviderMock = TestBed.inject(AppConfigProvider);
    authProviderMock = TestBed.inject(AuthenticationProvider);
  });

  describe('DOM', () => {
    it('should keep initial bindings stable during change detection', () => {
      fixture.detectChanges();
      expect(() => fixture.checkNoChanges()).not.toThrow();
    });

    describe('ionViewWillEnter', () => {
      it('should setup subscription if merged is present', () => {
        component.merged$ = new Observable<TestCentre[]>();
        component.ionViewWillEnter();

        expect(component.subscription).toBeDefined();
      });
    });
    describe('advanced search', () => {
      describe('when the user is an LDTM', () => {
        beforeEach(() => {
          vi.spyOn(appConfigProviderMock, 'getAppConfig').mockReturnValue({ role: ExaminerRole.LDTM } as AppConfig);
          fixture.detectChanges();
        });

        it('displays the advanced search', () => {
          expect(fixture.debugElement.query(By.css('#tab-search-advanced'))).not.toBeNull();
        });
      });

      describe('when the user is a DE', () => {
        beforeEach(() => {
          vi.spyOn(appConfigProviderMock, 'getAppConfig').mockReturnValue({ role: ExaminerRole.DE } as AppConfig);
          vi.spyOn(authProviderMock, 'getEmployeeId').mockReturnValue('testValue');
          fixture.detectChanges();
        });

        it('verifyAdvancedSearch returns employee ID when the user is a DE', () => {
          expect(component.verifyAdvancedSearch()).toBe('testValue');
        });
      });
    });

    describe('ionViewDidEnter', () => {
      it('should dispatch the view did enter action', () => {
        vi.spyOn(component.store$, 'dispatch').mockReturnValue(undefined);
        component.ionViewDidEnter();
        expect(component.store$.dispatch).toHaveBeenCalledWith(TestResultSearchViewDidEnter());
      });
    });

    describe('ionViewDidLeave', () => {
      it('should unsubscribe from the subscription if there is one', () => {
        component.subscription = new Subscription();
        vi.spyOn(component.subscription, 'unsubscribe').mockReturnValue(undefined);
        component.ionViewDidLeave();
        expect(component.subscription.unsubscribe).toHaveBeenCalled();
      });
    });

    describe('searchTests', () => {
      for (const searchBy of [SearchBy.ApplicationReference, SearchBy.DriverNumber]) {
        it(`should refresh the spinner and results after an asynchronous ${searchBy} search`, async () => {
          const results$ = new Subject<SearchResultTestSchema[]>();
          vi.spyOn(component.searchProvider, 'applicationReferenceSearch').mockReturnValue(results$);
          vi.spyOn(component.searchProvider, 'driverNumberSearch').mockReturnValue(results$);
          component.searchBy = searchBy;
          fixture.autoDetectChanges();
          await fixture.whenStable();
          component.candidateInfoChanged('12345678901');
          fixture.detectChanges();
          fixture.debugElement.query(By.css('#test-result-search-button')).triggerEventHandler('click');
          await fixture.whenStable();
          expect(fixture.debugElement.query(By.css('#search-spinner'))).not.toBeNull();

          results$.next([]);
          results$.complete();
          await fixture.whenStable();

          expect(fixture.debugElement.query(By.css('#search-spinner'))).toBeNull();
          expect(fixture.debugElement.query(By.css('#test-result-search-no-results-message'))).not.toBeNull();
          expect(() => fixture.checkNoChanges()).not.toThrow();
        });
      }

      it('should set define subscription using ApplicationReference', () => {
        component.searchBy = SearchBy.ApplicationReference;
        component.searchTests();
        expect(component.subscription).toBeDefined();
      });
      it('should set define subscription using DriverNumber', () => {
        component.searchBy = SearchBy.DriverNumber;
        component.searchTests();
        expect(component.subscription).toBeDefined();
      });
    });

    describe('advancedSearch', () => {
      it('should refresh the spinner and results after an asynchronous advanced search', async () => {
        const results$ = new Subject<SearchResultTestSchema[]>();
        vi.spyOn(component.searchProvider, 'advancedSearch').mockReturnValue(results$);
        fixture.autoDetectChanges();
        await fixture.whenStable();
        const advancedSearch = fixture.debugElement.query(By.directive(AdvancedSearchComponent));
        advancedSearch.triggerEventHandler('onSearchTests', {});
        await fixture.whenStable();
        expect(advancedSearch.componentInstance.showSpinner).toBe(true);

        results$.next([]);
        results$.complete();
        await fixture.whenStable();

        expect(advancedSearch.componentInstance.showSpinner).toBe(false);
        expect(fixture.debugElement.query(By.css('#test-result-search-no-results-message'))).not.toBeNull();
        expect(() => fixture.checkNoChanges()).not.toThrow();
      });

      it('should set define subscription', () => {
        component.advancedSearch({});
        expect(component.subscription).toBeDefined();
      });
    });

    for (const searchType of ['applicationReferenceSearch', 'driverNumberSearch', 'advancedSearch'] as const) {
      it(`should refresh the view when ${searchType} fails`, async () => {
        const results$ = new Subject<SearchResultTestSchema[]>();
        vi.spyOn(component.searchProvider, searchType).mockReturnValue(results$);
        let finishErrorModal: () => void;
        vi.spyOn(component, 'showError').mockReturnValue(
          new Promise<void>((resolve) => {
            finishErrorModal = resolve;
          })
        );
        fixture.autoDetectChanges();
        await fixture.whenStable();
        component.hasSearched.set(true);
        component.candidateInfoChanged('12345678901');
        if (searchType === 'advancedSearch') {
          component.advancedSearch({});
        } else {
          component.searchBy =
            searchType === 'driverNumberSearch' ? SearchBy.DriverNumber : SearchBy.ApplicationReference;
          component.searchTests();
        }
        fixture.detectChanges();

        results$.error(new Error('Search failed'));
        await fixture.whenStable();
        expect(component.showError).toHaveBeenCalled();
        expect(fixture.debugElement.query(By.css('#search-spinner'))).toBeNull();
        const advancedSearch = fixture.debugElement.query(By.directive(AdvancedSearchComponent));
        expect(advancedSearch.componentInstance.showSpinner).toBeFalsy();
        expect(() => fixture.checkNoChanges()).not.toThrow();

        finishErrorModal();
        await Promise.resolve();
        await fixture.whenStable();
        expect(fixture.debugElement.query(By.css('#test-result-search-no-results-message'))).toBeNull();
        expect(() => fixture.checkNoChanges()).not.toThrow();
      });
    }

    describe('setFocus', () => {
      it('should set focusedElement to the passed parameter', () => {
        component.setFocus('test');
        expect(component.focusedElement).toEqual('test');
      });
    });

    describe('searchByChanged', () => {
      it('should set searchBy to the passed parameter', () => {
        component.searchByChanged('test');
        expect(component.searchBy).toEqual('test');
      });
    });

    describe('candidateInfoChanged', () => {
      it('should set candidateInfo to the passed parameter formatted correctly', () => {
        component.candidateInfoChanged('test');
        expect(component.candidateInfo).toEqual('TEST');
      });
    });

    describe('showError', () => {
      it('should display a modal on error', async () => {
        vi.spyOn(modalController, 'create').mockReturnValue(
          Promise.resolve({
            present: async () => {},
          } as HTMLIonModalElement)
        );
        await component.showError(new Error('error'));
        expect(modalController.create).toHaveBeenCalled();
      });
    });
  });
});
