import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, ModalController, NavParams, Platform } from '@ionic/angular';
import { ModalControllerMock, NavParamsMock, PlatformMock } from '@mocks/index.mock';
import { MockComponent } from 'ng-mocks';

import { By } from '@angular/platform-browser';
import { AppModule } from '@app/app.module';
import { PracticeModeBanner } from '@components/common/practice-mode-banner/practice-mode-banner';
import { TickIndicatorComponent } from '@components/common/tick-indicator/tick-indicator';
import { StoreModule } from '@ngrx/store';
import { VehicleChecksComponent } from '@pages/test-report/cat-home-test/components/vehicle-checks/vehicle-checks';
import { TestReportCatHomeTestPage } from '@pages/test-report/cat-home-test/test-report.cat-home-test.page';
import { HighwayCodeSafetyComponent } from '@pages/test-report/components/highway-code-safety/highway-code-safety';
import { ReverseLeftPopoverComponent } from '@pages/test-report/components/reverse-left-popover/reverse-left-popover';
import { ReverseLeftComponent } from '@pages/test-report/components/reverse-left/reverse-left';
import { UncoupleRecoupleComponent } from '@pages/test-report/components/uncouple-recouple/uncouple-recouple';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { DateTimeProviderMock } from '@providers/date-time/__mocks__/date-time.mock';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { TestReportValidatorProviderMock } from '@providers/test-report-validator/__mocks__/test-report-validator.mock';
import { TestReportValidatorProvider } from '@providers/test-report-validator/test-report-validator';
import { candidateMock } from '@store/tests/__mocks__/tests.mock';
import { initialState } from '@store/tests/test-data/cat-b/test-data.reducer';
import { CompetencyButtonComponent } from '../../components/competency-button/competency-button';
import { CompetencyComponent } from '../../components/competency/competency';
import { ControlledStopComponent } from '../../components/controlled-stop/controlled-stop';
import { DrivingFaultSummaryComponent } from '../../components/driving-fault-summary/driving-fault-summary';
import { EcoComponent } from '../../components/eco/eco';
import { EtaComponent } from '../../components/examiner-takes-action/eta';
import { LegalRequirementComponent } from '../../components/legal-requirement/legal-requirement';
import { ManoeuvreCompetencyComponent } from '../../components/manoeuvre-competency/manoeuvre-competency';
import { ToolbarComponent } from '../../components/toolbar/toolbar';
import { testReportReducer } from '../../test-report.reducer';

describe('TestReportCatHomeTestPage', () => {
  let fixture: ComponentFixture<TestReportCatHomeTestPage>;
  let component: TestReportCatHomeTestPage;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestReportCatHomeTestPage,
        MockComponent(ReverseLeftPopoverComponent),
        MockComponent(ReverseLeftComponent),
        MockComponent(TickIndicatorComponent),
        MockComponent(CompetencyComponent),
        MockComponent(CompetencyButtonComponent),
        MockComponent(LegalRequirementComponent),
        MockComponent(EtaComponent),
        MockComponent(DrivingFaultSummaryComponent),
        MockComponent(ToolbarComponent),
        MockComponent(ControlledStopComponent),
        MockComponent(ManoeuvreCompetencyComponent),
        MockComponent(VehicleChecksComponent),
        MockComponent(EcoComponent),
        MockComponent(PracticeModeBanner),
        MockComponent(UncoupleRecoupleComponent),
        MockComponent(HighwayCodeSafetyComponent),
      ],
      imports: [
        IonicModule,
        AppModule,
        StoreModule.forFeature('tests', () => ({
          currentTest: {
            slotId: '123',
          },
          testStatus: {},
          startedTests: {
            123: {
              testData: initialState,
              journalData: {
                candidate: candidateMock,
              },
              delegatedTest: false,
            },
          },
        })),
        StoreModule.forFeature('testReport', testReportReducer),
      ],
      providers: [
        {
          provide: NavParams,
          useClass: NavParamsMock,
        },
        {
          provide: Platform,
          useClass: PlatformMock,
        },
        {
          provide: AuthenticationProvider,
          useClass: AuthenticationProviderMock,
        },
        {
          provide: DateTimeProvider,
          useClass: DateTimeProviderMock,
        },
        {
          provide: ModalController,
          useClass: ModalControllerMock,
        },
        {
          provide: TestReportValidatorProvider,
          useClass: TestReportValidatorProviderMock,
        },
      ],
    });

    fixture = TestBed.createComponent(TestReportCatHomeTestPage);
    component = fixture.componentInstance;
  });

  describe('DOM', () => {
    describe('Fault Modes Styling', () => {
      it('should not have any fault mode styles applied when serious and dangerous mode is disabled', () => {
        expect(fixture.debugElement.query(By.css('.serious-mode'))).toBeNull();
        expect(fixture.debugElement.query(By.css('.dangerous-mode'))).toBeNull();
      });
      it('should have serious fault mode styles applied when serious mode is enabled', () => {
        component.isSeriousMode = true;
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('.serious-mode'))).toBeDefined();
        expect(fixture.debugElement.query(By.css('.dangerous-mode'))).toBeNull();
      });
      it('should have dangerous fault mode styles applied when dangerous mode is enabled', () => {
        component.isDangerousMode = true;
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
  });
});
