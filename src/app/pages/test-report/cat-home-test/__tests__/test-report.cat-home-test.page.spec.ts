import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, ModalController, Platform } from '@ionic/angular';
import { ModalControllerMock, PlatformMock } from '@mocks/index.mock';
import { MockComponent } from 'ng-mocks';

import { AppModule } from '@app/app.module';
import { PracticeModeBanner } from '@components/common/practice-mode-banner/practice-mode-banner';
import { TickIndicatorComponent } from '@components/common/tick-indicator/tick-indicator';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
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
import { TestReportBasePageComponent } from '@shared/classes/test-flow-base-pages/test-report/test-report-base-page';
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

  describe('ionViewDidLeave', () => {
    it('should call parent ionViewDidLeave and cancelSubscription', () => {
      spyOn(TestReportBasePageComponent.prototype, 'ionViewDidLeave').and.callThrough();
      spyOn(TestReportBasePageComponent.prototype, 'cancelSubscription').and.callThrough();
      component.ionViewDidLeave();
      expect(TestReportBasePageComponent.prototype.ionViewDidLeave).toHaveBeenCalled();
      expect(TestReportBasePageComponent.prototype.cancelSubscription).toHaveBeenCalled();
    });
  });

  describe('showManoeuvreButton', () => {
    it('should return false if testCategory is K', () => {
      component.testCategory = TestCategory.K;
      expect(component.showManoeuvreButton()).toBeFalse();
    });

    it('should return true if testCategory is not K', () => {
      component.testCategory = TestCategory.F;
      expect(component.showManoeuvreButton()).toBeTrue();
    });
  });
});
