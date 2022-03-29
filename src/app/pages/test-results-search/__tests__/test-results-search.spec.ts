import { ComponentFixture, waitForAsync, TestBed } from '@angular/core/testing';
import { Platform, ModalController } from '@ionic/angular';
import { PlatformMock } from 'ionic-mocks';
import { By } from '@angular/platform-browser';
import { configureTestSuite } from 'ng-bullet';

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
import { ModalControllerMock } from '@mocks/ionic-mocks/modal-controller.mock';
import { AppConfig } from '@providers/app-config/app-config.model';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestResultsSearchComponentsModule } from '../components/test-results-search-components.module';
import { TestResultsSearchPage } from '../test-results-search';

describe('TestResultsSearchPage', () => {
  let fixture: ComponentFixture<TestResultsSearchPage>;
  let component: TestResultsSearchPage;
  let modalController: ModalController;
  let appConfigProviderMock: AppConfigProvider;
  let authProviderMock: AuthenticationProvider;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [
        TestResultsSearchPage,
      ],
      imports: [
        AppModule,
        TestResultsSearchComponentsModule,
        ComponentsModule,
      ],
      providers: [
        { provide: Platform, useFactory: () => PlatformMock.instance() },
        { provide: ModalController, useClass: ModalControllerMock },
        { provide: AuthenticationProvider, useClass: AuthenticationProviderMock },
        { provide: SearchProvider, useClass: SearchProviderMock },
        { provide: AppConfigProvider, useClass: AppConfigProviderMock },
        { provide: AppComponent, useClass: MockAppComponent },
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(TestResultsSearchPage);
    component = fixture.componentInstance;
    modalController = TestBed.inject(ModalController);
    appConfigProviderMock = TestBed.inject(AppConfigProvider);
    authProviderMock = TestBed.inject(AuthenticationProvider);
  }));

  describe('DOM', () => {
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
