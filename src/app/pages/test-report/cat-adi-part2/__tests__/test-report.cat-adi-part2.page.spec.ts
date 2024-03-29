import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, ModalController, NavParams, Platform } from '@ionic/angular';
import { ModalControllerMock, NavParamsMock, PlatformMock } from '@mocks/index.mock';
import { MockComponent } from 'ng-mocks';
import { AppModule } from '@app/app.module';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { DateTimeProviderMock } from '@providers/date-time/__mocks__/date-time.mock';
import { TickIndicatorComponent } from '@components/common/tick-indicator/tick-indicator';
import { By } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';
import { initialState } from '@store/tests/test-data/cat-b/test-data.reducer';
import { TestReportValidatorProvider } from '@providers/test-report-validator/test-report-validator';
import { TestReportValidatorProviderMock } from '@providers/test-report-validator/__mocks__/test-report-validator.mock';
import { PracticeModeBanner } from '@components/common/practice-mode-banner/practice-mode-banner';
import { candidateMock } from '@store/tests/__mocks__/tests.mock';
import { TestReportCatADI2Page } from '@pages/test-report/cat-adi-part2/test-report.cat-adi-part2.page';
import { ManoeuvresComponent } from '@pages/test-report/cat-adi-part2/components/manoeuvres/manoeuvres';
import {
  ManoeuvresPopoverComponentAdiPart2,
} from '@pages/test-report/cat-adi-part2/components/manoeuvres-popover/manoeuvres-popover';
import { VehicleCheckComponent } from '@pages/test-report/cat-adi-part2/components/vehicle-check/vehicle-check';
import { CatADI2UniqueTypes } from '@dvsa/mes-test-schema/categories/ADI2';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { TestReportBasePageComponent } from '@shared/classes/test-flow-base-pages/test-report/test-report-base-page';
import { ControlledStopComponent } from '../../components/controlled-stop/controlled-stop';
import { ManoeuvreCompetencyComponent } from '../../components/manoeuvre-competency/manoeuvre-competency';
import { EtaComponent } from '../../components/examiner-takes-action/eta';
import { LegalRequirementComponent } from '../../components/legal-requirement/legal-requirement';
import { testReportReducer } from '../../test-report.reducer';
import { ToolbarComponent } from '../../components/toolbar/toolbar';
import { DrivingFaultSummaryComponent } from '../../components/driving-fault-summary/driving-fault-summary';
import { CompetencyButtonComponent } from '../../components/competency-button/competency-button';
import { CompetencyComponent } from '../../components/competency/competency';
import { EcoComponent } from '../../components/eco/eco';

describe('TestReportCatADI2Page', () => {
  let fixture: ComponentFixture<TestReportCatADI2Page>;
  let component: TestReportCatADI2Page;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestReportCatADI2Page,
        MockComponent(TickIndicatorComponent),
        MockComponent(CompetencyComponent),
        MockComponent(CompetencyButtonComponent),
        MockComponent(LegalRequirementComponent),
        MockComponent(EtaComponent),
        MockComponent(DrivingFaultSummaryComponent),
        MockComponent(ToolbarComponent),
        MockComponent(ControlledStopComponent),
        MockComponent(ManoeuvreCompetencyComponent),
        MockComponent(EcoComponent),
        MockComponent(PracticeModeBanner),
        MockComponent(ManoeuvresComponent),
        MockComponent(VehicleCheckComponent),
        MockComponent(ManoeuvresPopoverComponentAdiPart2),
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
                testData: initialState,
                journalData: {
                  candidate: candidateMock,
                },
                category: TestCategory.ADI2,
              } as CatADI2UniqueTypes.TestResult,
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
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestReportCatADI2Page);
    component = fixture.componentInstance;
  });

  describe('DOM', () => {

    describe('Fault Modes Styling', () => {
      it('should not have any fault mode styles applied when serious and dangerous mode is disabled', () => {
        expect(fixture.debugElement.query(By.css('.serious-mode')))
          .toBeNull();
        expect(fixture.debugElement.query(By.css('.dangerous-mode')))
          .toBeNull();
      });
      it('should have serious fault mode styles applied when serious mode is enabled', () => {
        component.isSeriousMode = true;
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('.serious-mode')))
          .toBeDefined();
        expect(fixture.debugElement.query(By.css('.dangerous-mode')))
          .toBeNull();
      });
      it('should have dangerous fault mode styles applied when dangerous mode is enabled', () => {
        component.isDangerousMode = true;
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('.serious-mode')))
          .toBeNull();
        expect(fixture.debugElement.query(By.css('.dangerous-mode')))
          .toBeDefined();
      });
    });
  });

  describe('ionViewDidLeave', () => {
    it('should run basePageComponent functions', () => {
      spyOn(TestReportBasePageComponent.prototype, 'ionViewDidLeave');
      spyOn(TestReportBasePageComponent.prototype, 'cancelSubscription');
      component.ionViewDidLeave();

      expect(TestReportBasePageComponent.prototype.ionViewDidLeave)
        .toHaveBeenCalled();
      expect(TestReportBasePageComponent.prototype.cancelSubscription)
        .toHaveBeenCalled();
    });
  });

  describe('End Test Button', () => {
    it('should call the end test function', () => {
      spyOn(component, 'onEndTestClick');
      const endTestButton = fixture.debugElement.query(By.css('#end-test-button'));
      endTestButton.triggerEventHandler('click', null);
      expect(component.onEndTestClick)
        .toHaveBeenCalled();
    });
  });

});
