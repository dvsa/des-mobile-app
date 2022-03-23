import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  IonicModule, NavController, NavParams, Config, Platform, ModalController,
} from '@ionic/angular';
import {
  NavControllerMock,
  NavParamsMock,
  ConfigMock,
  PlatformMock,
  ModalControllerMock,
} from 'ionic-mocks';
import { MockComponent } from 'ng-mocks';

import { AppModule } from '@app/app.module';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { initialState } from '@store/tests/test-data/cat-home/test-data.cat-f.reducer';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { DateTimeProviderMock } from '@providers/date-time/__mocks__/date-time.mock';
import { TickIndicatorComponent } from '@components/common/tick-indicator/tick-indicator';
import { By } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';
import { TestReportValidatorProvider } from '@providers/test-report-validator/test-report-validator';
import {
  TestReportValidatorProviderMock,
} from '@providers/test-report-validator/__mocks__/test-report-validator.mock';
import { CAT_HOME_TEST, LEGAL_REQUIREMENTS_MODAL, SPECIAL_REQUIREMENT_MODAL } from '@pages/page-names.constants';
import { NavigationStateProvider } from '@providers/navigation-state/navigation-state';
import { NavigationStateProviderMock } from '@providers/navigation-state/__mocks__/navigation-state.mock';
import { candidateMock } from '@store/tests/__mocks__/tests.mock';
import { configureTestSuite } from 'ng-bullet';
import { testReportReducer } from '../../test-report.reducer';
import { LegalRequirementComponent } from '../../components/legal-requirement/legal-requirement';
import { EtaComponent } from '../../components/examiner-takes-action/eta';
import { EcoComponent } from '../../components/eco/eco';
import { ModalEvent } from '../../test-report.constants';
import { UncoupleRecoupleComponent } from '../../components/uncouple-recouple/uncouple-recouple';
import { VehicleChecksComponent } from '../components/vehicle-checks/vehicle-checks';
import { ToolbarComponent } from '../../components/toolbar/toolbar';
import { DrivingFaultSummaryComponent } from '../../components/driving-fault-summary/driving-fault-summary';
import { CompetencyButtonComponent } from '../../components/competency-button/competency-button';
import { CompetencyComponent } from '../../components/competency/competency';
import { ReverseLeftPopoverComponent } from '../../components/reverse-left-popover/reverse-left-popover';
import { ReverseLeftComponent } from '../../components/reverse-left/reverse-left';
import { TestReportCatHomeTestPage } from '../test-report.cat-home-test.page';
import { ControlledStopComponent } from '../../components/controlled-stop/controlled-stop';
import { HighwayCodeSafetyComponent } from '../../components/highway-code-safety/highway-code-safety';

describe('TestReportCatHomeTestPage', () => {
  let fixture: ComponentFixture<TestReportCatHomeTestPage>;
  let component: TestReportCatHomeTestPage;
  let navController: NavController;
  let modalController: ModalController;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [TestReportCatHomeTestPage,
        MockComponent(TickIndicatorComponent),
        MockComponent(CompetencyComponent),
        MockComponent(CompetencyButtonComponent),
        MockComponent(LegalRequirementComponent),
        MockComponent(EtaComponent),
        MockComponent(DrivingFaultSummaryComponent),
        MockComponent(ToolbarComponent),
        MockComponent(EcoComponent),
        MockComponent(UncoupleRecoupleComponent),
        MockComponent(ReverseLeftComponent),
        MockComponent(ReverseLeftPopoverComponent),
        MockComponent(VehicleChecksComponent),
        MockComponent(ControlledStopComponent),
        MockComponent(HighwayCodeSafetyComponent),
      ],
      imports: [
        IonicModule,
        AppModule,
        StoreModule.forFeature('tests', () => (
          {
            currentTest: {
              slotId: '123',
            },
            testStatus: {},
            startedTests: {
              123: {
                category: 'F',
                testData: initialState,
                journalData: {
                  candidate: candidateMock,
                },
              },
            },
          })),
        StoreModule.forFeature('testReport', testReportReducer),
      ],
      providers: [
        { provide: NavController, useFactory: () => NavControllerMock.instance() },
        { provide: NavParams, useFactory: () => NavParamsMock.instance() },
        { provide: Config, useFactory: () => ConfigMock.instance() },
        { provide: Platform, useFactory: () => PlatformMock.instance() },
        { provide: AuthenticationProvider, useClass: AuthenticationProviderMock },
        { provide: DateTimeProvider, useClass: DateTimeProviderMock },
        { provide: ModalController, useFactory: () => ModalControllerMock.instance() },
        { provide: TestReportValidatorProvider, useClass: TestReportValidatorProviderMock },
        { provide: NavigationStateProvider, useClass: NavigationStateProviderMock },
      ],
    });
  });

  beforeEach((() => {
    fixture = TestBed.createComponent(TestReportCatHomeTestPage);
    component = fixture.componentInstance;
  }));

  describe('DOM', () => {
    describe('getCallback', () => {
      it('should return the callback method', () => {
        const toggleReportOverlaySpy = spyOn(component, 'toggleReportOverlay').and.callThrough();
        component.getCallback().callbackMethod();
        expect(toggleReportOverlaySpy).toHaveBeenCalled();
        expect(component.displayOverlay).toEqual(true);
      });
    });

    describe('When the category is K', () => {
      it('should not show the manoeuvre button', () => {
        component.testCategory = TestCategory.K;
        const result = component.showManoeuvreButton();
        expect(result).toEqual(false);
      });

      it('should not show the special requirement modal', () => {
        const { calls } = modalController.create as jasmine.Spy;
        component.testCategory = TestCategory.K;
        component.manoeuvresCompleted = false;
        component.isTestReportValid = true;
        component.isEtaValid = true;
        component.onEndTestClick();
        expect(calls
          .argsFor(0)[0]).toBe('EndTestModal');
      });
    });

    describe('When the category is not K', () => {
      it('should show the manoeuvre button', () => {
        component.testCategory = TestCategory.F;
        const result = component.showManoeuvreButton();
        expect(result).toEqual(true);
      });
    });

    describe('onModalDismiss', () => {
      it('should navigate to debrief page when passed a CONTINUE event', () => {
        component.onModalDismiss(ModalEvent.CONTINUE);
        const { calls } = navController.navigateForward as jasmine.Spy;
        expect(calls.argsFor(0)[0]).toBe(CAT_HOME_TEST.DEBRIEF_PAGE);
      });

      it('should navigate to debrief page when passed a TERMINATE event', () => {
        component.onModalDismiss(ModalEvent.TERMINATE);
        const { calls } = navController.navigateForward as jasmine.Spy;
        expect(calls.argsFor(0)[0]).toBe(CAT_HOME_TEST.DEBRIEF_PAGE);
      });
    });
  });

  describe('DOM', () => {

    describe('Fault Modes Styling', () => {
      it('should not have any fault mode styles applied when serious and dangerous mode is disabled', () => {
        expect(fixture.debugElement.query(By.css('.serious-mode'))).toBeNull();
        expect(fixture.debugElement.query(By.css('.dangerous-mode'))).toBeNull();
      });
      it('should have serious fault mode styles applied when serious mode is enabled', async () => {
        component.isSeriousMode = true;
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('.serious-mode'))).toBeDefined();
        expect(fixture.debugElement.query(By.css('.dangerous-mode'))).toBeNull();
      });
      it('should have dangerous fault mode styles applied when dangerous mode is enabled', () => {
        component.isDangerousMode = true;
        component.testCategory = TestCategory.F;
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('.serious-mode'))).toBeNull();
        expect(fixture.debugElement.query(By.css('.dangerous-mode'))).toBeDefined();
      });
    });
  });

  describe('End Test Button', () => {
    it('should call the end test function', () => {
      spyOn(component, 'onEndTestClick');
      const endTestButton = fixture.debugElement.query(By.css('#end-test-button'));
      endTestButton.triggerEventHandler('click', null);
      expect(component.onEndTestClick).toHaveBeenCalled();
    });

    describe('when the test report is invalid', () => {
      it('should show the Legal Requirements modal', () => {
        const { calls } = modalController.create as jasmine.Spy;
        const endTestButton = fixture.debugElement.query(By.css('#end-test-button'));
        component.testCategory = TestCategory.K;
        component.isTestReportValid = false;
        endTestButton.triggerEventHandler('click', null);
        expect(calls
          .argsFor(0)[0]).toBe(LEGAL_REQUIREMENTS_MODAL);
      });
    });

    describe('when ETA is invalid', () => {
      it('should show the ETA invalid modal', () => {
        const { calls } = modalController.create as jasmine.Spy;
        const endTestButton = fixture.debugElement.query(By.css('#end-test-button'));
        component.testCategory = TestCategory.K;
        component.isTestReportValid = true;
        component.isEtaValid = false;
        endTestButton.triggerEventHandler('click', null);
        expect(calls
          .argsFor(0)[0]).toBe('EtaInvalidModal');
      });
    });

    describe('when the manoeuvres are incomplete and the category is not K', () => {
      it('should show the special requirement modal', () => {
        const { calls } = modalController.create as jasmine.Spy;
        const endTestButton = fixture.debugElement.query(By.css('#end-test-button'));
        component.testCategory = TestCategory.F;
        component.manoeuvresCompleted = false;
        component.isTestReportValid = true;
        component.isEtaValid = true;
        endTestButton.triggerEventHandler('click', null);
        expect(calls
          .argsFor(0)[0]).toBe(SPECIAL_REQUIREMENT_MODAL);
      });
    });

  });
});
