import { ComponentFixture, waitForAsync, TestBed } from '@angular/core/testing';
import { Platform, ModalController } from '@ionic/angular';
import { ModalControllerMock, PlatformMock } from '@mocks/index.mock';
import { By } from '@angular/platform-browser';

import { AppModule } from '@app/app.module';
import { AppComponent } from '@app/app.component';
import { MockAppComponent } from '@app/__mocks__/app.component.mock';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { SearchProvider } from '@providers/search/search';
import { SearchProviderMock } from '@providers/search/__mocks__/search.mock';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { AppConfigProviderMock } from '@providers/app-config/__mocks__/app-config.mock';
import { ExaminerRole } from '@providers/app-config/constants/examiner-role.constants';
import { ComponentsModule } from '@components/common/common-components.module';
import { AppConfig } from '@providers/app-config/app-config.model';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MockComponent } from 'ng-mocks';
import { AdvancedSearchComponent } from '@pages/test-results-search/components/advanced-search/advanced-search';
import { SearchResultComponent } from '@pages/test-results-search/components/search-result/search-result';
import { Observable, Subscription } from 'rxjs';
import { TestResultSearchViewDidEnter } from '@pages/test-results-search/test-results-search.actions';
import { TestCentre } from '@dvsa/mes-journal-schema';
import { TestResultsSearchPage } from '../test-results-search';
import { TestResultsSearchComponentsModule } from '../components/test-results-search-components.module';

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

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [
        TestResultsSearchPage,
        MockComponent(AdvancedSearchComponent),
        MockComponent(SearchResultComponent),
      ],
      imports: [
        AppModule,
        TestResultsSearchComponentsModule,
        ComponentsModule,
      ],
      providers: [
        { provide: Platform, useClass: PlatformMock },
        { provide: ModalController, useClass: ModalControllerMock },
        { provide: AuthenticationProvider, useClass: AuthenticationProviderMock },
        { provide: SearchProvider, useClass: SearchProviderMock },
        { provide: AppConfigProvider, useClass: AppConfigProviderMock },
        { provide: AppComponent, useClass: MockAppComponent },
      ],
    });

    fixture = TestBed.createComponent(TestResultsSearchPage);
    component = fixture.componentInstance;
    modalController = TestBed.inject(ModalController);
    appConfigProviderMock = TestBed.inject(AppConfigProvider);
    authProviderMock = TestBed.inject(AuthenticationProvider);
  }));

  describe('DOM', () => {
    describe('ionViewWillEnter', () => {
      it('should setup subscription if merged is present', () => {
        component.merged$ = new Observable<TestCentre[]>();
        component.ionViewWillEnter();

        expect(component.subscription)
          .toBeDefined();
      });
    });
    describe('advanced search', () => {
      describe('when the user is an LDTM', () => {
        beforeEach(() => {
          spyOn(appConfigProviderMock, 'getAppConfig').and.returnValue({ role: ExaminerRole.LDTM } as AppConfig);
          fixture.detectChanges();
        });

        it('displays the advanced search', () => {
          expect(fixture.debugElement.query(By.css('#tab-search-advanced'))).not.toBeNull();
        });
      });

      describe('when the user is a DE', () => {
        beforeEach(() => {
          spyOn(appConfigProviderMock, 'getAppConfig').and.returnValue({ role: ExaminerRole.DE } as AppConfig);
          spyOn(authProviderMock, 'getEmployeeId').and.returnValue('testValue');
          fixture.detectChanges();
        });

        it('verifyAdvancedSearch returns employee ID when the user is a DE', () => {
          expect(component.verifyAdvancedSearch()).toBe('testValue');
        });
      });
    });

    describe('ionViewDidEnter', () => {
      it('should dispatch the view did enter action', () => {
        spyOn(component['store$'], 'dispatch');
        component.ionViewDidEnter();
        expect(component['store$'].dispatch).toHaveBeenCalledWith(TestResultSearchViewDidEnter());
      });
    });

    describe('ionViewDidLeave', () => {
      it('should unsubscribe from the subscription if there is one', () => {
        component.subscription = new Subscription();
        spyOn(component.subscription, 'unsubscribe');
        component.ionViewDidLeave();
        expect(component.subscription.unsubscribe)
          .toHaveBeenCalled();
      });
    });

    describe('searchTests', () => {
      it('should set define subscription using ApplicationReference', () => {
        component.searchBy = SearchBy.ApplicationReference;
        component.searchTests();
        expect(component.subscription)
          .toBeDefined();
      });
      it('should set define subscription using DriverNumber', () => {
        component.searchBy = SearchBy.DriverNumber;
        component.searchTests();
        expect(component.subscription)
          .toBeDefined();
      });
    });

    describe('advancedSearch', () => {
      it('should set define subscription', () => {
        component.advancedSearch({});
        expect(component.subscription)
          .toBeDefined();
      });
    });

    describe('setFocus', () => {
      it('should set focusedElement to the passed parameter', () => {
        component.setFocus('test');
        expect(component.focusedElement)
          .toEqual('test');
      });
    });

    describe('searchByChanged', () => {
      it('should set searchBy to the passed parameter', () => {
        component.searchByChanged('test');
        expect(component.searchBy)
          .toEqual('test');
      });
    });

    describe('candidateInfoChanged', () => {
      it('should set candidateInfo to the passed parameter', () => {
        component.candidateInfoChanged('test');
        expect(component.candidateInfo)
          .toEqual('test');
      });
    });

    describe('showError', () => {
      it('should display a modal on error', async () => {
        spyOn(modalController, 'create').and.returnValue(Promise.resolve({
          present: async () => {},
        } as HTMLIonModalElement));
        await component.showError({ status: 500, statusText: 'error', message: 'error' });
        expect(modalController.create).toHaveBeenCalled();
      });
    });
  });
});
